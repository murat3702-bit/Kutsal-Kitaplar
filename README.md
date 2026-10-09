# Dört Kitap

Tevrat, Zebur, İncil ve Kur'an metinlerini tek bir uygulamada, tamamen
çevrimdışı (internet gerektirmeden) sunan Android uygulaması.

## Nasıl derlenir

1. Bu klasörü (`DortKitap/`) açıp Android Studio'da **File → Open** ile seçin.
2. Android Studio projeyi ilk açtığında Gradle wrapper dosyalarını
   kendisi tamamlayacak / indirecektir (internet bağlantısı gerekir).
   Senkronizasyon ("Gradle Sync") bitince **Run ▶** ile bir cihaza veya
   emülatöre kurabilirsiniz.
3. İmzalı bir APK/AAB almak için **Build → Generate Signed Bundle / APK**
   yolunu izleyin.

## Yapı

- `app/src/main/assets/` — uygulamanın tamamı burada: `index.html`,
  `css/style.css`, `js/app.js` ve `data/*.js` (Tevrat, Zebur, İncil,
  Kur'an metinleri, JSON olarak gömülü). Uygulama bir WebView içinde
  bu dosyaları çalıştırır; internet bağlantısı gerektirmez.
- `app/src/main/java/.../MainActivity.java` — WebView'i başlatan,
  localStorage'ı (favoriler, son okunan, yazı boyutu) açan ve sistem
  "geri" tuşunu uygulama içi gezinmeye bağlayan tek ekran.
- İkon: basit bir "açık kitap" placeholder (`res/drawable/ic_launcher_*`).
  Dilerseniz kendi ikonunuzla değiştirebilirsiniz.

## İçerik hakkında notlar

- **Kur'an**: Edip Yüksel meali (kaynak veri setinde bu çeviri
  kullanılmış). Dipnotlar bu sürümde okunabilirliği bozmamak için
  ayet metninden çıkarıldı; istenirse ayrı bir "notlar" paneli olarak
  eklenebilir.
- **Tevrat**: kaynak veri, geleneksel 39 kitaplık Eski Ahit'ten Mezmurlar
  hariç 38 kitabı içeriyor (Mezmurlar zaten ayrı olarak Zebur'da).
- **İncil**: 4 İncil (Matta, Markos, Luka, Yuhanna).
- **Zebur**: 150 mezmur.

## Şu ana kadar tamamlanan özellikler

- Ana sayfa: 4 kitap kartı, arama çubuğu, son okunan / favoriler kısayolu
- Sûre/bölüm/kitap listeleri ve okuma ekranı (yazı boyutu +/-)
- Tüm metinlerde arama (Türkçe karakter duyarlı, vurgulu sonuç önizlemesi)
- Ayete dokunarak favorilere ekleme/çıkarma
- Son okunan otomatik kaydı (localStorage, cihazda kalır)

## Sonraki adımlar (istenirse)

- Gerçek bir uygulama ikonu (logo tasarımı)
- Kur'an dipnotlarının ayrı bir panelde gösterilmesi
- Koyu/açık tema anahtarı (şu an sistem ayarını otomatik takip ediyor)
- Splash screen
