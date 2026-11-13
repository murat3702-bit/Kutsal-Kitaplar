package com.mb.dortkitap.app;

import android.Manifest;
import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.media.MediaScannerConnection;
import android.net.Uri;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

    // Yedekleme
    private static final String BACKUP_DIR = "Backups/4 Kitap";
    private static final int REQ_ALL_FILES = 4101;
    private static final int REQ_WRITE_PERM = 4102;
    private static final int REQ_PICK_RESTORE = 4103;
    private static final int REQ_CREATE_DOC = 4104;
    private String pendingName;
    private String pendingJson;

    private class NativeBridge {
        // Ayarlar/kayıtlar için kalıcı depolama (WebView localStorage'a ek güvence).
        private SharedPreferences prefs() {
            return getSharedPreferences("dortkitap_store", Context.MODE_PRIVATE);
        }

        @JavascriptInterface
        public String getItem(String key) {
            return prefs().getString(key, null);
        }

        @JavascriptInterface
        public void setItem(String key, String value) {
            prefs().edit().putString(key, value).commit();
        }

        @JavascriptInterface
        public void copyText(final String text) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    ClipboardManager cm = (ClipboardManager) getSystemService(Context.CLIPBOARD_SERVICE);
                    if (cm != null) cm.setPrimaryClip(ClipData.newPlainText("ayet", text));
                }
            });
        }

        @JavascriptInterface
        public void shareText(final String text) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent send = new Intent(Intent.ACTION_SEND);
                    send.setType("text/plain");
                    send.putExtra(Intent.EXTRA_TEXT, text);
                    startActivity(Intent.createChooser(send, null));
                }
            });
        }

        // Yedek dosyasını Backups/4 Kitap klasörüne kaydeder (izin gerekirse ister).
        @JavascriptInterface
        public void saveBackup(final String fileName, final String json) {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    beginBackup(fileName, json);
                }
            });
        }

        // Geri yüklenecek yedek dosyasını seçtirir.
        @JavascriptInterface
        public void pickRestoreFile() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    Intent i = new Intent(Intent.ACTION_OPEN_DOCUMENT);
                    i.addCategory(Intent.CATEGORY_OPENABLE);
                    i.setType("*/*");
                    startActivityForResult(i, REQ_PICK_RESTORE);
                }
            });
        }

        @JavascriptInterface
        public void exitApp() {
            runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    finishAffinity();
                }
            });
        }
    }

    private void callJs(final String js) {
        runOnUiThread(new Runnable() {
            @Override
            public void run() {
                webView.evaluateJavascript(js, null);
            }
        });
    }

    private void jsToast(String msg) {
        callJs("window.dkToast&&window.dkToast(" + JSONObject.quote(msg) + ")");
    }

    private void jsBackupDone(boolean ok, String msg) {
        callJs("window.dkBackupDone&&window.dkBackupDone(" + ok + "," + JSONObject.quote(msg) + ")");
    }

    private boolean hasStorageAccess() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            return Environment.isExternalStorageManager();
        }
        return checkSelfPermission(Manifest.permission.WRITE_EXTERNAL_STORAGE) == PackageManager.PERMISSION_GRANTED;
    }

    @SuppressWarnings("deprecation")
    private void beginBackup(String fileName, String json) {
        pendingName = fileName;
        pendingJson = json;
        if (hasStorageAccess()) {
            writeBackupToFolder();
            return;
        }
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.R) {
            jsToast("Yedek için \"Tüm dosyalara erişim\" iznini aç, sonra geri dön");
            try {
                Intent i = new Intent(Settings.ACTION_MANAGE_APP_ALL_FILES_ACCESS_PERMISSION,
                        Uri.parse("package:" + getPackageName()));
                startActivityForResult(i, REQ_ALL_FILES);
            } catch (Exception e) {
                try {
                    startActivityForResult(new Intent(Settings.ACTION_MANAGE_ALL_FILES_ACCESS_PERMISSION), REQ_ALL_FILES);
                } catch (Exception e2) {
                    fallbackCreateDocument();
                }
            }
        } else {
            requestPermissions(new String[]{Manifest.permission.WRITE_EXTERNAL_STORAGE}, REQ_WRITE_PERM);
        }
    }

    // Klasör izni verilmezse sistemin "Dosya kaydet" penceresine düşer.
    @SuppressWarnings("deprecation")
    private void fallbackCreateDocument() {
        if (pendingJson == null) return;
        jsToast("Klasör izni verilmedi, dosya kaydetme penceresi açılıyor");
        Intent i = new Intent(Intent.ACTION_CREATE_DOCUMENT);
        i.addCategory(Intent.CATEGORY_OPENABLE);
        i.setType("application/json");
        i.putExtra(Intent.EXTRA_TITLE, pendingName);
        startActivityForResult(i, REQ_CREATE_DOC);
    }

    private void writeBackupToFolder() {
        if (pendingJson == null) return;
        try {
            File dir = new File(Environment.getExternalStorageDirectory(), BACKUP_DIR);
            if (!dir.exists() && !dir.mkdirs()) throw new IOException("Klasör oluşturulamadı");
            File f = new File(dir, pendingName);
            int n = 2;
            while (f.exists()) {
                f = new File(dir, pendingName.replace(".json", " (" + n + ").json"));
                n++;
            }
            OutputStream out = new java.io.FileOutputStream(f);
            try {
                out.write(pendingJson.getBytes("UTF-8"));
            } finally {
                out.close();
            }
            MediaScannerConnection.scanFile(this, new String[]{f.getAbsolutePath()}, null, null);
            jsBackupDone(true, "Backups / 4 Kitap klasörüne kaydedildi:\n" + f.getName());
        } catch (Exception e) {
            jsBackupDone(false, "Dosya yazılamadı: " + e.getMessage());
        } finally {
            pendingJson = null;
        }
    }

    private void writeToUri(Uri uri) {
        if (pendingJson == null) return;
        try {
            OutputStream out = getContentResolver().openOutputStream(uri, "wt");
            if (out == null) throw new IOException("Dosya açılamadı");
            try {
                out.write(pendingJson.getBytes("UTF-8"));
            } finally {
                out.close();
            }
            jsBackupDone(true, "Yedek seçtiğin konuma kaydedildi.");
        } catch (Exception e) {
            jsBackupDone(false, "Dosya yazılamadı: " + e.getMessage());
        } finally {
            pendingJson = null;
        }
    }

    private void readRestore(Uri uri) {
        try {
            InputStream in = getContentResolver().openInputStream(uri);
            if (in == null) throw new IOException("Dosya açılamadı");
            ByteArrayOutputStream bos = new ByteArrayOutputStream();
            try {
                byte[] buf = new byte[8192];
                int r;
                long total = 0;
                while ((r = in.read(buf)) != -1) {
                    total += r;
                    if (total > 30L * 1024 * 1024) throw new IOException("Dosya çok büyük");
                    bos.write(buf, 0, r);
                }
            } finally {
                in.close();
            }
            String text = bos.toString("UTF-8");
            callJs("window.dkRestoreData&&window.dkRestoreData(" + JSONObject.quote(text) + ")");
        } catch (Exception e) {
            jsBackupDone(false, "Dosya okunamadı: " + e.getMessage());
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    protected void onActivityResult(int requestCode, int resultCode, Intent data) {
        super.onActivityResult(requestCode, resultCode, data);
        if (requestCode == REQ_ALL_FILES) {
            if (hasStorageAccess()) writeBackupToFolder();
            else fallbackCreateDocument();
        } else if (requestCode == REQ_PICK_RESTORE) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null) readRestore(data.getData());
        } else if (requestCode == REQ_CREATE_DOC) {
            if (resultCode == RESULT_OK && data != null && data.getData() != null) writeToUri(data.getData());
            else pendingJson = null;
        }
    }

    @Override
    @SuppressWarnings("deprecation")
    public void onRequestPermissionsResult(int requestCode, String[] permissions, int[] grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == REQ_WRITE_PERM) {
            if (grantResults.length > 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) writeBackupToFolder();
            else fallbackCreateDocument();
        }
    }

    @SuppressLint("SetJavaScriptEnabled")
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        webView = new WebView(this);
        setContentView(webView);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);      // localStorage (favorites, history, font size)
        settings.setAllowFileAccess(true);
        settings.setCacheMode(WebSettings.LOAD_DEFAULT);

        webView.addJavascriptInterface(new NativeBridge(), "Android");
        webView.setWebViewClient(new WebViewClient());
        webView.loadUrl("file:///android_asset/index.html");
    }

    @Override
    public boolean onKeyDown(int keyCode, KeyEvent event) {
        // Geri tuşu tarayıcı geçmişini tersten gezmez: uygulamanın kendi mantıksal geri davranışı
        // çalışır (ayet -> bölüm/liste -> ana sayfa). Ana sayfada uygulama kapanır.
        if (keyCode == KeyEvent.KEYCODE_BACK) {
            webView.evaluateJavascript(
                    "(function(){try{return window.dkBack?window.dkBack():false;}catch(e){return false;}})()",
                    new ValueCallback<String>() {
                        @Override
                        public void onReceiveValue(String handled) {
                            if (!"true".equals(handled)) finish();
                        }
                    });
            return true;
        }
        return super.onKeyDown(keyCode, event);
    }
}
