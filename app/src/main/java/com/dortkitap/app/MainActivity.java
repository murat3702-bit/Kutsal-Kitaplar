package com.dortkitap.app;

import android.annotation.SuppressLint;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Context;
import android.content.SharedPreferences;
import android.content.Intent;
import android.os.Bundle;
import android.view.KeyEvent;
import android.webkit.JavascriptInterface;
import android.webkit.ValueCallback;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import androidx.appcompat.app.AppCompatActivity;

public class MainActivity extends AppCompatActivity {

    private WebView webView;

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
