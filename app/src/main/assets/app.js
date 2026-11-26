// Uzun basmayla metin seçimi / bağlam menüsü engeli (input ve textarea hariç).
(function () {
  function editable(t) { return t && t.closest && t.closest("input, textarea"); }
  document.addEventListener("contextmenu", function (e) { if (!editable(e.target)) e.preventDefault(); }, true);
  document.addEventListener("selectstart", function (e) { if (!editable(e.target)) e.preventDefault(); }, true);
})();
(function () {
  "use strict";

  // ---------- Book registry ----------
  var BOOKS = {
    kuran: { label: "Kur'an", version: "Yüksel", kind: "flat", unitLabel: "sûre", data: window.KURAN_DATA },
    incil: { label: "İncil", kind: "nested", unitLabel: "İncil", subLabel: "bölüm", data: window.INCIL_DATA },
    tevrat: { label: "Tevrat", kind: "nested", unitLabel: "kitap", subLabel: "bölüm", data: window.TEVRAT_DATA },
    zebur: { label: "Zebur", kind: "flat", unitLabel: "mezmur", data: window.ZEBUR_DATA }
  };
  // Kutsal kitap başlıkları arayüzde her zaman büyük harf (Türkçe kurallarıyla: İNCİL, KUR'AN).
  function bookTitle(key) { return BOOKS[key].label.toLocaleUpperCase("tr-TR"); }
  var BOOK_ORDER = ["kuran", "incil", "tevrat", "zebur"];
  var BOOK_CARD_CLASS = { kuran: "b-kuran", incil: "b-incil", tevrat: "b-tevrat", zebur: "b-zebur" };
  var BOOK_ICON = {
    kuran: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c-1.6 1.4-1.6 3.2 0 4.6 1.6-1.4 1.6-3.2 0-4.6Z"/><path d="M8 9.5a4 4 0 1 1 8 0v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1Z"/><path d="M4 21v-6.2c0-.8.5-1.5 1.3-1.8L9 11.6V21H4Z"/><path d="M20 21v-6.2c0-.8-.5-1.5-1.3-1.8L15 11.6V21h5Z"/><path d="M9 21v-4.5a3 3 0 0 1 6 0V21H9Z"/></svg>',
    incil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3.2h3.2v2H13V8l5 3v10H6V11l5-3V7.2H7.8v-2H11V2Z"/></svg>',
    tevrat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V9.3L7 7l3 2.3V21H4Z"/><path d="M14 21V9.3l3-2.3 3 2.3V21h-6Z"/><path d="M10.5 21v-4a1.5 1.5 0 0 1 3 0v4h-3Z"/></svg>',
    zebur: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l1.9 5.4L19.3 9.6l-5.4 1.9L12 16.9l-1.9-5.4L4.7 9.6l5.4-1.9L12 2.5Z"/><path d="M18.8 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/></svg>'
  };
  var STAR_RING =
    '<svg viewBox="0 0 52 52" fill="none" stroke="currentColor" stroke-width="1.6">' +
    '<path d="M26 8 L30.5 12.5 L37 10 L38.5 16.5 L45 19 L42.5 25.5 L46 32 L39.5 33.5 L38 40 L31.5 38.5 L26 44 L20.5 38.5 L14 40 L12.5 33.5 L6 32 L8.5 25.5 L6 19 L12.5 16.5 L14 10 L20.5 12.5 Z"/>' +
    "</svg>";
  var BRAND_LOGO =
    '<svg viewBox="0 0 108 108" xmlns="http://www.w3.org/2000/svg">' +
    '<path d="M54,42 C46,34 30,32 21,35 L21,55.5 L54,58 Z" fill="#8FC93D"/>' +
    '<path d="M21,55.5 L54,58 L54,81 C46,73 30,71 21,74 Z" fill="#5EB6CC"/>' +
    '<path d="M54,42 C62,34 78,32 87,35 L87,55.5 L54,58 Z" fill="#FBBE2E"/>' +
    '<path d="M87,55.5 L54,58 L54,81 C62,73 78,71 87,74 Z" fill="#FAFAF8"/>' +
    '<path d="M54,42 C46,34 30,32 21,35 L21,74 C30,71 46,73 54,81 C62,73 78,71 87,74 L87,35 C78,32 62,34 54,42 Z" fill="none" stroke="#3A3A38" stroke-width="1.6"/>' +
    '<path d="M51.3,26 L56.7,26 L56.7,85 L54,80.5 L51.3,85 Z" fill="#E31E1E"/>' +
    '</svg>';
  var ICON = {
    search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m15 18-6-6 6-6"/></svg>',
    chevron: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 3"/></svg>',
    heart: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"/></svg>',
    heartFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 20s-7-4.4-9.5-9A5.5 5.5 0 0 1 12 6a5.5 5.5 0 0 1 9.5 5c-2.5 4.6-9.5 9-9.5 9Z"/></svg>',
    plus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>',
    minus: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
    bookmark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 4h12v16l-6-4-6 4Z"/></svg>',
    bookmarkFill: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 4h12v16l-6-4-6 4Z"/></svg>',
    chevLeft: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m15 18-6-6 6-6"/></svg>',
    chevRight: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="m9 6 6 6-6 6"/></svg>',
    home: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 11.5 12 4l8 7.5"/><path d="M6 10v10h5v-6h2v6h5V10"/></svg>',
    sliders: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 6h9M17 6h3M4 18h11M19 18h1M4 12h1M9 12h11"/><circle cx="15" cy="6" r="2" fill="currentColor" stroke="none"/><circle cx="6" cy="12" r="2" fill="currentColor" stroke="none"/><circle cx="17" cy="18" r="2" fill="currentColor" stroke="none"/></svg>',
    drop: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z"/></svg>',
    dropFill: '<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 3.5s6 6.2 6 10.5a6 6 0 0 1-12 0c0-4.3 6-10.5 6-10.5Z"/></svg>',
    pencil: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><path d="M4 20l1-4L16.5 4.5a2.1 2.1 0 0 1 3 3L8 19l-4 1Z"/><path d="M14.5 6.5l3 3"/></svg>',
    copy: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/></svg>',
    share: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><circle cx="18" cy="5.5" r="2.5"/><circle cx="6" cy="12" r="2.5"/><circle cx="18" cy="18.5" r="2.5"/><path d="M8.2 10.8l7.6-4M8.2 13.2l7.6 4"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>',
    trash: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3"/></svg>',
    exit: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>',
    cloudUp: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM14 13v4h-4v-4H7l5-5 5 5h-3z"/></svg>',
    cloudDown: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.35 10.04A7.49 7.49 0 0 0 12 4C9.11 4 6.6 5.64 5.35 8.04A5.994 5.994 0 0 0 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6L6 18"/></svg>',
    user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="3.6"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/></svg>',
    bookOpen: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 6.5C10.3 5.2 8 4.7 4 4.8v13c4-.1 6.3.4 8 1.7 1.7-1.3 4-1.8 8-1.7v-13c-4-.1-6.3.4-8 1.7Z"/><path d="M12 6.5v13"/></svg>'
  };

  // ---------- Storage helpers ----------
  var LS_FAV = "dk_favorites", LS_HIST = "dk_history", LS_BOOKMARK = "dk_bookmarks", LS_NOTES = "dk_notes", LS_SEARCH_BOOK = "dk_search_book";
  var LS_TEXT_CATS = "dk_text_cats", LS_THEME = "dk_theme", LS_OVERRIDES = "dk_overrides";
  var LS_DIM = "dk_dim";
  var LS_MEAL = "dk_kuran_meal", LS_KORDER = "dk_kuran_order";
  // Çift katmanlı kalıcı depolama: Android'de SharedPreferences (köprü) + WebView localStorage.
  // Her yazma ikisine birden yapılır; okurken önce SharedPreferences'a bakılır. Böylece uygulama
  // kapatılsa/öldürülse bile ayarlar kaybolmaz.
  function readRaw(key) {
    try {
      if (window.Android && typeof window.Android.getItem === "function") {
        var n = window.Android.getItem(key);
        if (n !== null && n !== undefined) return String(n);
      }
    } catch (e) {}
    try { return localStorage.getItem(key); } catch (e) { return null; }
  }
  function writeRaw(key, val) {
    try { localStorage.setItem(key, val); } catch (e) {}
    try { if (window.Android && typeof window.Android.setItem === "function") window.Android.setItem(key, val); } catch (e) {}
  }
  function loadJSON(key, fallback) {
    try { var v = JSON.parse(readRaw(key)); return (v === null || v === undefined) ? fallback : v; } catch (e) { return fallback; }
  }
  function saveJSON(key, val) { try { writeRaw(key, JSON.stringify(val)); } catch (e) {} }

  var TEXT_CAT_LABELS = { baslik: "Başlıklar", liste: "Sûre / Bölüm / Mezmur", ayet: "Ayetler" };
  var TEXT_CAT_DEFAULTS = {
    baslik: { family: "sistem", style: "kalin", size: 22 },
    liste: { family: "sistem", style: "normal", size: 15 },
    ayet: { family: "sistem", style: "normal", size: 17 }
  };

  // Yer imi kuralı: her kitap (Kur'an, İncil, Tevrat, Zebur) için en fazla 1 yer imi.
  // Liste yeniden eskiye sıralıdır; aynı kitaptan ilk görülen (en yeni) kalır.
  function normalizeBookmarks(list) {
    var seen = {}, out = [];
    (Array.isArray(list) ? list : []).forEach(function (b) {
      if (b && b.book && !seen[b.book]) { seen[b.book] = 1; out.push(b); }
    });
    return out;
  }

  // Eski sürümlerde biriken geçmişi tek seferlik temizle: kitap başına yalnızca en yeni kayıt kalsın.
  function dedupeHistoryByBook(list) {
    var seen = {}, out = [];
    (Array.isArray(list) ? list : []).slice().sort(function (a, b) { return (b.ts || 0) - (a.ts || 0); })
      .forEach(function (h) { if (h && h.book && !seen[h.book]) { seen[h.book] = 1; out.push(h); } });
    return out;
  }

  var state = {
    favorites: loadJSON(LS_FAV, []),   // [{book,unit,ch,n,snippet,loc}]
    history: dedupeHistoryByBook(loadJSON(LS_HIST, [])),    // kitap başına 1 kayıt: [{book,unit,ch,loc,ts,n,vi,total}]
    bookmarks: normalizeBookmarks(loadJSON(LS_BOOKMARK, [])), // kitap başına en fazla 1: [{book,unit,ch,n,loc}]
    textCats: loadJSON(LS_TEXT_CATS, JSON.parse(JSON.stringify(TEXT_CAT_DEFAULTS))),
    theme: (function () { var t = readRaw(LS_THEME); return (t === "light" || t === "dark" || t === "sepia" || t === "oled" || t === "sistem") ? t : "sistem"; })(),
    searchBook: (function () { var b = readRaw(LS_SEARCH_BOOK); return b && BOOKS[b] ? b : "all"; })(), // "all" | book key
    notes: loadJSON(LS_NOTES, []),     // [{book,unit,ch,n,loc,snippet,note,ts}]
    overrides: loadJSON(LS_OVERRIDES, {}), // { "book|unit|ch": [{n,t}, ...] } - admin-edited verse text
    adminUnlocked: false // in-memory only; resets every app restart
  };
  saveJSON(LS_BOOKMARK, state.bookmarks); // eski/yedekten gelen fazla yer imleri temizlenmiş haliyle kaydedilir
  // Merge in any category missing from an older saved shape.
  if (!state.textCats || typeof state.textCats !== "object") state.textCats = {};
  Object.keys(TEXT_CAT_DEFAULTS).forEach(function (k) {
    if (!state.textCats[k] || typeof state.textCats[k] !== "object") state.textCats[k] = JSON.parse(JSON.stringify(TEXT_CAT_DEFAULTS[k]));
  });

  // ---------- Kur'an mealleri + sûre sıralaması ----------
  // Varsayılan meal (Edip Yüksel) projenin kendi metnidir (data/kuran.js). Diğer mealler
  // data/meals/<anahtar>.js dosyalarındadır ve seçilince yüklenir (açılışta yalnızca seçili olan).
  var MEAL_DEFAULT = "edip";
  var MEALS = [ // [anahtar, tam ad, kısa ad]
    ["diyanet", "Diyanet İşleri", "Diyanet"],
    ["vakfi", "Diyanet Vakfı", "D. Vakfı"],
    ["elmali", "E. Hamdi Yazır", "Yazır"],
    ["ynuri", "Y. Nuri Öztürk", "Öztürk"],
    ["ioglu", "Mustafa İslamoğlu", "İslamoğlu"],
    ["okuyan", "Mehmet Okuyan", "Okuyan"],
    ["aktas", "Erhan Aktaş", "Aktaş"],
    ["bayrakli", "Bayraktar Bayraklı", "Bayraklı"],
    ["edip", "Edip Yüksel", "Yüksel"],
    ["hayrat", "Hayrat Neşriyat", "Hayrat"],
    ["ibnkesir", "İbn-i Kesir", "İbn-i Kesir"],
    ["kutub", "Seyyid Kutub", "Kutub"],
    ["ates", "Süleyman Ateş", "Ateş"],
    ["hyilmaz", "Hakkı Yılmaz", "Yılmaz"]
  ];
  // Nüzul (iniş) sırası: sûre numaralarının iniş sırasına göre dizilişi.
  var NUZUL_ORDER = [96, 68, 73, 74, 1, 111, 81, 87, 92, 89, 93, 94, 103, 100, 108, 102, 107, 109, 105, 113, 114, 112, 53, 80, 97, 91, 85, 95, 106, 101, 75, 104, 77, 50, 90, 86, 54, 38, 7, 72, 36, 25, 35, 19, 20, 56, 26, 27, 28, 17, 10, 11, 12, 15, 6, 37, 31, 34, 39, 40, 41, 42, 43, 44, 45, 46, 51, 88, 18, 16, 71, 14, 21, 23, 32, 52, 67, 69, 70, 78, 79, 82, 84, 30, 29, 83, 2, 8, 3, 33, 60, 4, 99, 57, 47, 13, 55, 76, 65, 98, 59, 24, 22, 63, 58, 49, 66, 64, 61, 62, 48, 5, 9, 110];
  var KURAN_BASE = window.KURAN_DATA || [];
  var AYET_SAYISI = {};
  KURAN_BASE.forEach(function (u) { AYET_SAYISI[u.id] = u.verses.length; });
  var mealCache = {}, mealBusy = false;

  function mealInfo(key) {
    for (var i = 0; i < MEALS.length; i++) if (MEALS[i][0] === key) return MEALS[i];
    return null;
  }
  // Seçili mealin sûre listesi (yüklü değilse null). Sûre adları tüm mealler için ortaktır.
  function mealUnits(key) {
    if (key === MEAL_DEFAULT) return KURAN_BASE;
    if (mealCache[key]) return mealCache[key];
    var src = window.KURAN_MEALS && window.KURAN_MEALS[key];
    if (!src) return null;
    mealCache[key] = KURAN_BASE.map(function (u, i) { return { id: u.id, name: u.name, verses: src[i] || [] }; });
    return mealCache[key];
  }
  function applyMeal(key) {
    var info = mealInfo(key), units = mealUnits(key);
    if (!info || !units) return false;
    state.meal = key;
    BOOKS.kuran.data = units;
    BOOKS.kuran.version = info[2]; // paylaşım / ayet sayfası başlığında görünen kısa ad
    return true;
  }
  function loadMeal(key, done) {
    if (mealUnits(key)) { done(true); return; }
    var sc = document.createElement("script");
    sc.src = "data/meals/" + key + ".js";
    sc.onload = function () { done(!!mealUnits(key)); };
    sc.onerror = function () { if (sc.parentNode) sc.parentNode.removeChild(sc); done(false); };
    document.head.appendChild(sc);
  }
  state.meal = MEAL_DEFAULT;
  state.kOrder = readRaw(LS_KORDER) === "nuzul" ? "nuzul" : "mushaf";
  applyMeal(MEAL_DEFAULT);
  (function () {
    var saved = readRaw(LS_MEAL);
    // Kayıtlı meal index.html tarafından önceden yüklenmiş olur; bulunamazsa varsayılana dön.
    if (saved && saved !== MEAL_DEFAULT) applyMeal(saved);
  })();

  var FONT_OPTIONS = {
    sistem: { label: "Sistem", css: "inherit" },
    serif: { label: "Şerif", css: "Georgia, 'Times New Roman', serif" },
    roboto: { label: "Roboto", css: "Roboto, sans-serif" },
    comfortaa: { label: "Comfortaa", css: "Comfortaa, sans-serif" },
    courier: { label: "Courier", css: "'Courier Prime', 'Courier New', Courier, monospace" }
  };
  var STYLE_OPTIONS = {
    normal: { label: "Normal", italic: "normal", weight: 400 },
    italic: { label: "İtalik", italic: "italic", weight: 400 },
    kalin: { label: "Kalın", italic: "normal", weight: 700 }
  };

  var FONT_SIZE_MIN = 11, FONT_SIZE_MAX = 30;
  // Kayıtlı ayarda eksik/geçersiz alan varsa yalnızca o alan varsayılana döner; geçerli seçimler korunur.
  Object.keys(TEXT_CAT_DEFAULTS).forEach(function (k) {
    var c = state.textCats[k], d = TEXT_CAT_DEFAULTS[k];
    if (!FONT_OPTIONS[c.family]) c.family = d.family;
    if (!STYLE_OPTIONS[c.style]) c.style = d.style;
    c.size = Number(c.size);
    if (!isFinite(c.size)) c.size = d.size;
    c.size = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, Math.round(c.size)));
  });

  function saveTextCats() { saveJSON(LS_TEXT_CATS, state.textCats); }

  function applySettings() {
    var root = document.documentElement;
    Object.keys(state.textCats).forEach(function (cat) {
      var c = state.textCats[cat];
      var fam = FONT_OPTIONS[c.family] || FONT_OPTIONS.sistem;
      var sty = STYLE_OPTIONS[c.style] || STYLE_OPTIONS.normal;
      root.style.setProperty("--font-" + cat, fam.css);
      root.style.setProperty("--style-" + cat, sty.italic);
      root.style.setProperty("--weight-" + cat, sty.weight);
      root.style.setProperty("--size-" + cat, (c.size / 16) + "rem");
    });
    if (state.theme === "light" || state.theme === "dark" || state.theme === "oled" || state.theme === "sepia") root.setAttribute("data-theme", state.theme);
    else root.removeAttribute("data-theme");
  }
  applySettings();

  function changeFontSize(delta) {
    var c = state.textCats.ayet;
    c.size = Math.max(FONT_SIZE_MIN, Math.min(FONT_SIZE_MAX, c.size + delta));
    saveTextCats();
    applySettings();
  }

  function greeting() {
    var h = new Date().getHours();
    if (h >= 5 && h < 12) return "Günaydın";
    if (h >= 12 && h < 18) return "İyi günler";
    if (h >= 18 && h < 22) return "İyi akşamlar";
    return "İyi geceler";
  }

  function dayOfYear(d) {
    var start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  }

  function getVerseOfDay() {
    var surahs = getUnits("kuran");
    var total = 0;
    surahs.forEach(function (s) { total += s.verses.length; });
    if (total === 0) return null;
    var idx = dayOfYear(new Date()) % total;
    for (var i = 0; i < surahs.length; i++) {
      if (idx < surahs[i].verses.length) {
        return { surah: surahs[i], verse: surahs[i].verses[idx] };
      }
      idx -= surahs[i].verses.length;
    }
    return null;
  }

  function shortUnitName(name) {
    return String(name).replace(/\s*SÛRESİ\s*$/i, "").trim();
  }

  function favKey(f) { return [f.book, f.unit, f.ch || "", f.n].join("|"); }
  function isFav(book, unit, ch, n) {
    var k = [book, unit, ch || "", n].join("|");
    return state.favorites.some(function (f) { return favKey(f) === k; });
  }
  function toggleFav(entry) {
    var k = favKey(entry);
    var idx = state.favorites.findIndex(function (f) { return favKey(f) === k; });
    if (idx >= 0) state.favorites.splice(idx, 1);
    else state.favorites.unshift(entry);
    saveJSON(LS_FAV, state.favorites);
  }
  function pushHistory(entry) {
    // Kitap bazlı upsert: her kitap için en fazla 1 kayıt (en son okunan konum), en yeni başta.
    state.history = state.history.filter(function (h) { return h.book !== entry.book; });
    entry.ts = Date.now();
    state.history.unshift(entry);
    saveJSON(LS_HIST, state.history);
  }

  function bookmarkKey(b) { return [b.book, b.unit, b.ch || "", b.n || ""].join("|"); }
  function isBookmarked(book, unit, ch, n) {
    var k = [book, unit, ch || "", n || ""].join("|");
    return state.bookmarks.some(function (b) { return bookmarkKey(b) === k; });
  }
  // Aynı yer imine tekrar basınca kaldırır. Yeni yer imi eklenince aynı kitaptaki eskisi silinir;
  // silinen eski yer imi döndürülür (yoksa null).
  function toggleBookmark(entry) {
    var k = bookmarkKey(entry);
    var idx = state.bookmarks.findIndex(function (b) { return bookmarkKey(b) === k; });
    var replaced = null;
    if (idx >= 0) {
      state.bookmarks.splice(idx, 1);
    } else {
      state.bookmarks = state.bookmarks.filter(function (b) {
        if (b.book === entry.book) { replaced = b; return false; }
        return true;
      });
      state.bookmarks.unshift(entry);
    }
    saveJSON(LS_BOOKMARK, state.bookmarks);
    return replaced;
  }

  // ---------- Notes ----------
  function noteKey(n) { return [n.book, n.unit, n.ch || "", n.n].join("|"); }
  function getNote(book, unit, ch, n) {
    var k = [book, unit, ch || "", n].join("|");
    return state.notes.find(function (x) { return noteKey(x) === k; }) || null;
  }
  function saveNote(entry) {
    var k = noteKey(entry);
    state.notes = state.notes.filter(function (x) { return noteKey(x) !== k; });
    if (entry.note && entry.note.trim()) { entry.ts = Date.now(); state.notes.unshift(entry); }
    saveJSON(LS_NOTES, state.notes);
  }

  // ---------- İncil metni değişti: eski kayıtları bir kereliğine temizle ----------
  // Yeni İncil metninde ayet gruplaması ve bölümler farklı. Eski yönetici düzenlemeleri yeni metni
  // gölgelemesin; var olmayan bölümlere ait kayıtlar silinsin, bulunamayan ayet numaraları sıfırlansın.
  (function migrateIncilData() {
    var FLAG = "dk_incil_v2";
    if (readRaw(FLAG) === "1") return;
    try {
      Object.keys(state.overrides).forEach(function (k) { if (k.indexOf("incil|") === 0) delete state.overrides[k]; });
      saveJSON(LS_OVERRIDES, state.overrides);
      var hasVerse = function (chap, n) {
        return chap.verses.some(function (v) { return String(v.n) === String(n); });
      };
      var clean = function (list, hasVi) {
        return list.filter(function (r) {
          if (!r || r.book !== "incil") return true;
          var chap = getChapter("incil", r.unit, r.ch);
          if (!chap) return false;
          if (r.n !== undefined && r.n !== null && r.n !== "" && !hasVerse(chap, r.n)) { r.n = null; if (hasVi) r.vi = 0; }
          return true;
        });
      };
      state.bookmarks = clean(state.bookmarks, false); saveJSON(LS_BOOKMARK, state.bookmarks);
      state.favorites = clean(state.favorites, false); saveJSON(LS_FAV, state.favorites);
      state.notes = clean(state.notes, false); saveJSON(LS_NOTES, state.notes);
      state.history = clean(state.history, true); saveJSON(LS_HIST, state.history);
    } catch (e) {}
    writeRaw(FLAG, "1");
  })();

  // ---------- Data access helpers ----------
  function getUnits(bookKey) { return BOOKS[bookKey].data || []; }
  // Liste ve Önceki/Sonraki için sıralı birimler (yalnızca Kur'anda nüzul sırası uygulanır).
  function orderedUnits(bookKey) {
    var units = getUnits(bookKey);
    if (bookKey !== "kuran" || state.kOrder !== "nuzul") return units;
    var byId = {};
    units.forEach(function (u) { byId[u.id] = u; });
    return NUZUL_ORDER.map(function (id) { return byId[id]; }).filter(Boolean);
  }
  function unitVerseCount(bookKey, u) {
    // Birleşik ayet gruplayan mealler için gerçek ayet sayısı (Kur'anda meal-bağımsız).
    if (bookKey === "kuran" && AYET_SAYISI[u.id]) return AYET_SAYISI[u.id];
    return u.verses ? u.verses.length : 0;
  }
  function getUnit(bookKey, unitId) {
    var units = getUnits(bookKey);
    return units.find(function (u) { return String(u.id) === String(unitId); });
  }
  // Kur'anda Edip dışındaki mealler kendi düzenleme anahtarını kullanır; böylece Edip'e yapılmış
  // eski düzenlemeler başka bir mealin metnini gölgelemez.
  function overrideKey(bookKey, unitId, ch) {
    var b = bookKey === "kuran" && state.meal !== MEAL_DEFAULT ? "kuran@" + state.meal : bookKey;
    return b + "|" + unitId + "|" + (ch || "");
  }
  function getChapter(bookKey, unitId, ch) {
    var unit = getUnit(bookKey, unitId);
    if (!unit) return null;
    var base = BOOKS[bookKey].kind === "flat" ? unit : unit.chapters.find(function (c) { return String(c.ch) === String(ch); });
    if (!base) return null;
    var ov = state.overrides[overrideKey(bookKey, unitId, ch)];
    if (ov) return { ch: base.ch, verses: ov };
    return base;
  }
  function saveOverride(bookKey, unitId, ch, verses) {
    state.overrides[overrideKey(bookKey, unitId, ch)] = verses;
    saveJSON(LS_OVERRIDES, state.overrides);
  }
  function clearOverride(bookKey, unitId, ch) {
    delete state.overrides[overrideKey(bookKey, unitId, ch)];
    saveJSON(LS_OVERRIDES, state.overrides);
  }
  function unitLocLabel(bookKey, unitId, ch) {
    var unit = getUnit(bookKey, unitId);
    if (!unit) return "";
    if (BOOKS[bookKey].kind === "flat") return unit.name;
    var cc = ch && unit.chapters ? unit.chapters.find(function (c) { return String(c.ch) === String(ch); }) : null;
    if (cc && cc.fn) return unit.name + " Dipnotlar";
    return unit.name + (ch ? " " + ch + ". Bölüm" : "");
  }
  // Dipnot bölümleri (fn:true) gerçek bölüm değildir; "Dipnotlar" olarak gösterilir.
  function chapLabel(c) { return c.fn ? "Dipnotlar" : c.ch + ". Bölüm"; }

  // Returns {prev: {url,label}|null, next: {url,label}|null} for the reader's
  // footer navigation: sûre-to-sûre (Kur'an), mezmur-to-mezmur (Zebur),
  // bölüm-to-bölüm within a book and across book boundaries (Tevrat/İncil).
  function getAdjacent(bookKey, unitId, ch) {
    var book = BOOKS[bookKey];
    var units = orderedUnits(bookKey);
    var uIdx = units.findIndex(function (u) { return String(u.id) === String(unitId); });
    if (uIdx === -1) return { prev: null, next: null };

    if (book.kind === "flat") {
      var prevU = units[uIdx - 1], nextU = units[uIdx + 1];
      return {
        prev: prevU ? { url: readUrl(bookKey, prevU.id), label: prevU.name } : null,
        next: nextU ? { url: readUrl(bookKey, nextU.id), label: nextU.name } : null
      };
    }

    var unit = units[uIdx];
    var cIdx = unit.chapters.findIndex(function (c) { return String(c.ch) === String(ch); });
    var prevInfo = null, nextInfo = null;
    if (cIdx > 0) {
      var pc = unit.chapters[cIdx - 1];
      prevInfo = { url: readUrl(bookKey, unit.id, pc.ch), label: unit.name + " " + pc.ch };
    } else if (uIdx > 0) {
      var pu = units[uIdx - 1], plc = pu.chapters[pu.chapters.length - 1];
      prevInfo = { url: readUrl(bookKey, pu.id, plc.ch), label: pu.name + " " + plc.ch };
    }
    if (cIdx < unit.chapters.length - 1) {
      var nc = unit.chapters[cIdx + 1];
      nextInfo = { url: readUrl(bookKey, unit.id, nc.ch), label: unit.name + " " + nc.ch };
    } else if (uIdx < units.length - 1) {
      var nu = units[uIdx + 1], nfc = nu.chapters[0];
      nextInfo = { url: readUrl(bookKey, nu.id, nfc.ch), label: nu.name + " " + nfc.ch };
    }
    return { prev: prevInfo, next: nextInfo };
  }

  // Ayet numarası "5" ya da birleşik "2-4" olabilir; hedef ayetin bir aralığın içinde olup olmadığına bakar.
  function nRange(n) {
    var p = String(n).split(/\s*[-\u2013\u2014]\s*/).map(function (x) { return parseInt(x, 10); }).filter(function (x) { return !isNaN(x); });
    return p.length ? [p[0], p[p.length - 1]] : null;
  }
  function findTargetIndex(verses, target) {
    if (target === undefined || target === null || target === "") return -1;
    var exact = -1, cover = -1, t = nRange(target);
    verses.forEach(function (v, i) {
      if (exact < 0 && String(v.n) === String(target)) exact = i;
      if (cover < 0 && t) { var r = nRange(v.n); if (r && r[0] <= t[0] && t[0] <= r[1]) cover = i; }
    });
    return exact >= 0 ? exact : cover;
  }

  // ---------- Verse number badge (merged numbers stack vertically) ----------
  function verseNumLen(n) {
    return String(n).split(/\s*[-\u2013\u2014]\s*/).reduce(function (m, p) { return Math.max(m, p.length); }, 1);
  }
  function verseNumHtml(n) {
    var parts = String(n).split(/\s*[-\u2013\u2014]\s*/).filter(Boolean);
    if (parts.length < 2) return escapeHtml(String(n));
    return parts.map(function (p) { return "<span>" + escapeHtml(p) + "</span>"; }).join("");
  }

  // ---------- Verse action sheet (bottom sheet) ----------
  var sheetCtx = null, sheetNodes = null, toastTimer = null;

  function titleCase(s) {
    s = String(s).toLocaleLowerCase("tr-TR");
    return s.charAt(0).toLocaleUpperCase("tr-TR") + s.slice(1);
  }
  function verseRef(c) {
    var unit = getUnit(c.book, c.unit);
    var name = unit ? unit.name : "";
    var n = c.n;
    if (c.book === "kuran") return titleCase(name.replace(/\s*S[uû]re(si)?\s*$/i, "").trim()) + " " + c.unit + ":" + n;
    if (c.fn) return titleCase(name) + " Dipnotlar";
    if (c.book === "zebur") return "Mezmur " + c.unit + ":" + n;
    return titleCase(name) + " " + c.ch + ":" + n;
  }
  function sheetHeading(c) {
    var v = BOOKS[c.book].version;
    return verseRef(c) + " \u00B7" + (v ? " " + v : "");
  }
  function shareText(c) {
    var v = BOOKS[c.book].version;
    return "\u201C" + c.t + "\u201D\n\u2014 " + verseRef(c) + (v ? " \u00B7 " + v : "");
  }

  function showToast(msg) {
    var t = document.getElementById("toast");
    if (!t) { t = el("div", "toast"); t.id = "toast"; document.body.appendChild(t); }
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.classList.remove("show"); }, 1800);
  }

  function copyToClipboard(text) {
    try {
      if (window.Android && typeof window.Android.copyText === "function") { window.Android.copyText(text); return true; }
    } catch (e) {}
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text); return true; }
    } catch (e) {}
    try {
      var ta = document.createElement("textarea");
      ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0"; ta.style.userSelect = "text"; ta.style.webkitUserSelect = "text";
      document.body.appendChild(ta); ta.select();
      var ok = document.execCommand("copy");
      document.body.removeChild(ta);
      return ok;
    } catch (e) { return false; }
  }
  function shareVerse(text) {
    try {
      if (window.Android && typeof window.Android.shareText === "function") { window.Android.shareText(text); return; }
    } catch (e) {}
    if (navigator.share) { navigator.share({ text: text }).catch(function () {}); return; }
    showToast(copyToClipboard(text) ? "Kopyalandı" : "Paylaşılamadı");
  }

  function closeVerseSheet(immediate) {
    if (!sheetNodes) return;
    var nodes = sheetNodes;
    if (sheetCtx && sheetCtx.el) sheetCtx.el.classList.remove("selected");
    sheetNodes = null; sheetCtx = null;
    document.removeEventListener("keydown", onSheetKey);
    nodes.overlay.classList.remove("open");
    if (immediate) nodes.overlay.remove();
    else setTimeout(function () { nodes.overlay.remove(); }, 220);
  }
  function onSheetKey(e) { if (e.key === "Escape") closeVerseSheet(); }

  function openVerseSheet(c) {
    closeVerseSheet(true);
    sheetCtx = c;
    if (c.el) c.el.classList.add("selected");
    var overlay = el("div", "sheet-overlay");
    var sheet = el("div", "sheet");
    sheet.setAttribute("role", "dialog");
    overlay.appendChild(sheet);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeVerseSheet(); });
    document.body.appendChild(overlay);
    sheetNodes = { overlay: overlay, sheet: sheet };
    document.addEventListener("keydown", onSheetKey);
    renderSheetActions();
    requestAnimationFrame(function () { overlay.classList.add("open"); });
  }

  function renderSheetActions() {
    var c = sheetCtx, sheet = sheetNodes.sheet;
    var bm = isBookmarked(c.book, c.unit, c.ch, c.n);
    var hl = isFav(c.book, c.unit, c.ch, c.n);
    var hasNote = !!getNote(c.book, c.unit, c.ch, c.n);
    sheet.innerHTML = '<div class="sheet-grip"></div><div class="sheet-title"></div><div class="sheet-actions"></div>';
    sheet.querySelector(".sheet-title").textContent = sheetHeading(c);
    var actions = sheet.querySelector(".sheet-actions");
    function add(label, icon, active, fn) {
      var b = el("button", "sheet-action" + (active ? " active" : ""), '<span class="ico">' + icon + "</span><span>" + label + "</span>");
      b.addEventListener("click", fn);
      actions.appendChild(b);
    }
    var loc = c.fn ? c.title : c.title + ", " + c.n + ". ayet";
    add("Yer imi", bm ? ICON.bookmarkFill : ICON.bookmark, bm, function () {
      var old = toggleBookmark({ book: c.book, unit: c.unit, ch: c.ch, n: c.n, loc: loc });
      var on = isBookmarked(c.book, c.unit, c.ch, c.n);
      if (c.el) c.el.classList.toggle("bookmarked", on);
      if (old) { // ekrandaki eski yer imi işaretini kaldır
        Array.prototype.forEach.call(document.querySelectorAll(".verse.bookmarked"), function (e) {
          if (e !== c.el && String(e.dataset.n) === String(old.n)) e.classList.remove("bookmarked");
        });
      }
      closeVerseSheet();
      showToast(on ? (old ? "Yer imi güncellendi, önceki silindi" : "Yer imi eklendi") : "Yer imi kaldırıldı");
    });
    add("Vurgu", hl ? ICON.dropFill : ICON.drop, hl, function () {
      toggleFav({ book: c.book, unit: c.unit, ch: c.ch, n: c.n, loc: loc, snippet: c.t.slice(0, 90) });
      if (c.el) c.el.classList.toggle("fav", isFav(c.book, c.unit, c.ch, c.n));
      closeVerseSheet();
    });
    add("Not", ICON.pencil, hasNote, function () { renderSheetNote(); });
    add("Kopyala", ICON.copy, false, function () {
      var ok = copyToClipboard(shareText(c));
      closeVerseSheet();
      showToast(ok ? "Kopyalandı" : "Kopyalanamadı");
    });
    add("Paylaş", ICON.share, false, function () {
      var text = shareText(c);
      closeVerseSheet();
      shareVerse(text);
    });

    // Ekran karartma yoğunluğu: - [kaydırıcı] + ve yüzde
    var dimRow = el("div", "sheet-dim",
      '<span class="sheet-dim-label">Karartma</span>' +
      '<button type="button" class="dim-step" data-d="-1" aria-label="Karartmayı azalt">\u2212</button>' +
      '<input class="dim-range" type="range" min="0" max="' + DIM_MAX + '" step="' + DIM_STEP + '" aria-label="Karartma yoğunluğu" />' +
      '<button type="button" class="dim-step" data-d="1" aria-label="Karartmayı artır">+</button>' +
      '<span class="dim-val"></span>');
    var range = dimRow.querySelector(".dim-range"), val = dimRow.querySelector(".dim-val");
    function syncDim() { range.value = String(state.dim); val.textContent = "%" + state.dim; }
    range.addEventListener("input", function () { setDim(range.value, false); val.textContent = "%" + state.dim; });
    range.addEventListener("change", function () { setDim(range.value, true); syncDim(); });
    Array.prototype.forEach.call(dimRow.querySelectorAll(".dim-step"), function (btn) {
      btn.addEventListener("click", function () { setDim(state.dim + Number(btn.getAttribute("data-d")) * DIM_STEP, true); syncDim(); });
    });
    syncDim();
    sheet.appendChild(dimRow);
  }

  function renderSheetNote() {
    var c = sheetCtx, sheet = sheetNodes.sheet;
    var existing = getNote(c.book, c.unit, c.ch, c.n);
    sheet.innerHTML =
      '<div class="sheet-grip"></div><div class="sheet-title"></div>' +
      '<textarea class="sheet-note" rows="4" placeholder="Notunuzu yazın..."></textarea>' +
      '<div class="sheet-note-actions"></div>';
    sheet.querySelector(".sheet-title").textContent = sheetHeading(c);
    var ta = sheet.querySelector(".sheet-note");
    ta.value = existing ? existing.note : "";
    var row = sheet.querySelector(".sheet-note-actions");
    var back = el("button", "admin-btn", "Geri");
    back.addEventListener("click", renderSheetActions);
    row.appendChild(back);
    if (existing) {
      var del = el("button", "admin-btn danger", "Sil");
      del.addEventListener("click", function () {
        saveNote({ book: c.book, unit: c.unit, ch: c.ch, n: c.n, note: "" });
        if (c.el) c.el.classList.remove("noted");
        closeVerseSheet();
      });
      row.appendChild(del);
    }
    var save = el("button", "admin-btn primary", "Kaydet");
    save.addEventListener("click", function () {
      var text = ta.value.trim();
      saveNote({ book: c.book, unit: c.unit, ch: c.ch, n: c.n, loc: c.title + ", " + c.n + ". ayet", snippet: c.t.slice(0, 90), note: text });
      if (c.el) c.el.classList.toggle("noted", !!text);
      closeVerseSheet();
    });
    row.appendChild(save);
    setTimeout(function () { ta.focus(); }, 60);
  }

  // ---------- Yazılımsal karartma (viewDimOverlay) ----------
  // Tüm ekranın üstüne siyah, tıklamayı geçiren bir katman koyar; yoğunluk (alpha) ayet menüsünden ayarlanır
  // ve SharedPreferences köprüsüyle (writeRaw) kalıcı olarak saklanır.
  var DIM_MAX = 80, DIM_STEP = 5;
  function clampDim(v) {
    v = Math.round(Number(v) / DIM_STEP) * DIM_STEP;
    if (!isFinite(v)) v = 0;
    return Math.max(0, Math.min(DIM_MAX, v));
  }
  try { state.dim = clampDim(readRaw(LS_DIM)); } catch (e) { state.dim = 0; }
  function dimNode() {
    var n = document.getElementById("viewDimOverlay");
    if (!n) { n = document.createElement("div"); n.id = "viewDimOverlay"; document.body.appendChild(n); }
    return n;
  }
  function applyDim() { try { dimNode().style.opacity = String(state.dim / 100); } catch (e) {} }
  function setDim(v, persist) {
    state.dim = clampDim(v);
    applyDim();
    if (persist) writeRaw(LS_DIM, String(state.dim));
  }

  // ---------- Router ----------
  var root = document.getElementById("app");
  function readUrl(book, unit, ch, n) {
    var parts = ["#/read", book, unit];
    if (ch) parts.push(ch);
    else if (n) parts.push("");
    if (n) parts.push(n);
    return parts.join("/");
  }
  // ----- Gezinme: her geçiş "replace" (yer değiştirme) ile yapılır, geçmiş yığını büyümez -----
  // Geri tuşu (uygulamadaki ok ve Android sistem tuşu) geçmişi tersten gezmez; her ekranın
  // mantıksal üst ekranına gider: ayet -> bölüm/liste -> ana sayfa. Ana sayfada geri uygulamayı kapatır.
  var replaceNext = false;

  function resetScroll() {
    window.scrollTo(0, 0);
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }


  // Önceki/Sonraki ile bölüm değiştirirken Android WebView eski sayfanın çizimini (hayalet metin) ekranda
  // bırakıp alttaki butonları gizleyebiliyordu. Çözüm: önce içeriği boşalt + en üste çık, bir kare bekle,
  // sonra yeni bölümü çiz ve çizim sonrası ekranı bir kez yeniden boyamaya zorla.
  function navTo(hash) {
    try { closeVerseSheet(true); } catch (e) {}
    root.innerHTML = "";
    resetScroll();
    void document.body.offsetHeight;
    requestAnimationFrame(function () { go(hash); });
  }
  function forceRepaint() {
    var b = document.body;
    b.style.display = "none";
    void b.offsetHeight;
    b.style.display = "";
    resetScroll();
  }

  function dispatch(parts) {
    if (parts.length === 0) return renderHome();
    if (parts[0] === "list") return renderList(parts[1]);
    if (parts[0] === "chapters") return renderChapters(parts[1], parts[2]);
    if (parts[0] === "read") return renderReader(parts[1], parts[2], parts[3], parts[4]);
    if (parts[0] === "search") return renderSearch(decodeURIComponent(parts[1] || ""));
    if (parts[0] === "records") return renderRecords();
    if (parts[0] === "settings") return renderSettings();
    if (parts[0] === "admin") return renderAdmin(parts[1], parts[2], parts[3]);
    return renderHome();
  }

  function route() {
    var current = location.hash || "#/";
    replaceNext = false;
    closeMenus();

    var raw = current.replace(/^#\/?/, "");
    var parts = raw === "" ? [] : raw.split("/");
    resetScroll();
    closeVerseSheet(true);
    document.body.classList.remove("has-tabbar", "home-lock");
    document.documentElement.classList.remove("home-lock");
    dispatch(parts);
    void document.body.offsetHeight; // yeniden yerleşimi zorla (eski içeriğin hayalet çizimini önler)
    var hasTarget = parts[0] === "read" && parts[4];
    if (!hasTarget) {
      requestAnimationFrame(function () {
        resetScroll();
        requestAnimationFrame(function () {
          if (parts[0] === "read") forceRepaint(); else resetScroll();
        });
      });
      setTimeout(function () { if (parts[0] === "read") forceRepaint(); else resetScroll(); }, 120);
    }
  }
  window.addEventListener("hashchange", route);

  // Tüm geçişler replace: tarayıcı geçmişine yeni kayıt eklenmez.
  function go(hash) {
    if ((location.hash || "#/") === hash) { route(); return; }
    replaceNext = true;
    location.replace(hash);
  }

  // Bir ekranın mantıksal üst ekranı (null = ana sayfa, geri uygulamadan çıkar).
  function parentOf(hash) {
    var raw = String(hash || "#/").replace(/^#\/?/, "");
    var p = raw === "" ? [] : raw.split("/");
    var book = p[1] && BOOKS[p[1]] ? BOOKS[p[1]] : null;
    switch (p[0]) {
      case undefined: return null;
      case "read": return book && book.kind === "flat" ? "#/list/" + p[1] : "#/chapters/" + p[1] + "/" + p[2];
      case "chapters": return "#/list/" + p[1];
      case "list": return "#/";
      case "admin":
        if (p.length <= 1) return "#/settings";
        if (p.length === 2) return "#/admin";
        if (p.length === 3) return "#/admin/" + p[1];
        return "#/admin/" + p[1] + "/" + p[2];
      default: return "#/";   // ara, kayıtlar, ayarlar ve bilinmeyen adresler -> ana sayfa
    }
  }

  // Ekrandaki geri oku: mantıksal üst ekrana yer değiştirerek geçer.
  function goBack(parent) {
    go(parent || parentOf(location.hash) || "#/");
  }

  // Android sistem geri tuşu bunu çağırır. true = uygulama içinde işlendi, false = uygulamadan çık.
  window.dkBack = function () {
    if (overlayNode) { closeOverlay(); return true; }
    if (sheetNodes) { closeVerseSheet(); return true; }
    if (closeMenus()) return true;
    var parent = parentOf(location.hash || "#/");
    if (parent === null) return false;
    go(parent);
    return true;
  };

  function topbar(title, opts) {
    opts = opts || {};
    var el = document.createElement("div");
    el.className = "topbar";
    var back = "";
    if (opts.back) {
      back = '<button class="icon-btn" data-back>' + ICON.back + "</button>";
    }
    el.innerHTML = back + '<h1 class="txt-baslik">' + title + "</h1>" + (opts.right || "");
    if (opts.back) {
      el.querySelector("[data-back]").addEventListener("click", function () {
        goBack(opts.backUrl);
      });
    }
    return el;
  }

  function exitApp() {
    try {
      if (window.Android && typeof window.Android.exitApp === "function") {
        window.Android.exitApp();
        return;
      }
    } catch (e) {}
    window.close();
  }

  var ADMIN_PIN_HASH = "38b51ad68c54c216476a47194f347f71f97c08a68e470f98bc60902024e5acd1";
  function sha256Hex(text) {
    var enc = new TextEncoder().encode(text);
    return crypto.subtle.digest("SHA-256", enc).then(function (buf) {
      var bytes = new Uint8Array(buf);
      var hex = "";
      for (var i = 0; i < bytes.length; i++) hex += bytes[i].toString(16).padStart(2, "0");
      return hex;
    });
  }

  function showPinDialog() {
    var overlay = el("div", "pin-overlay");
    overlay.innerHTML =
      '<div class="pin-box">' +
      '<p class="pin-title">Yönetim Paneli</p>' +
      '<p class="pin-sub">Şifreyi girin</p>' +
      '<input class="pin-input" type="password" inputmode="numeric" maxlength="12" />' +
      '<p class="pin-error" hidden>Şifre hatalı.</p>' +
      '<div class="pin-actions">' +
      '<button class="admin-btn pin-cancel">Vazgeç</button>' +
      '<button class="admin-btn primary pin-ok">Onayla</button>' +
      "</div></div>";
    document.body.appendChild(overlay);
    var input = overlay.querySelector(".pin-input");
    var err = overlay.querySelector(".pin-error");
    setTimeout(function () { input.focus(); }, 50);

    function close() { overlay.remove(); }
    function submit() {
      var val = input.value;
      if (!val) return;
      sha256Hex(val).then(function (hex) {
        if (hex === ADMIN_PIN_HASH) {
          state.adminUnlocked = true;
          close();
          go("#/admin");
        } else {
          err.hidden = false;
          input.value = "";
          input.focus();
        }
      });
    }
    overlay.querySelector(".pin-cancel").addEventListener("click", close);
    overlay.querySelector(".pin-ok").addEventListener("click", submit);
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") submit(); });
  }

  var footerTaps = [];
  function handleFooterTap() {
    var now = Date.now();
    footerTaps.push(now);
    footerTaps = footerTaps.filter(function (t) { return now - t < 2000; });
    if (footerTaps.length >= 5) {
      footerTaps = [];
      showPinDialog();
    }
  }

  function tabbar(active) {
    var bar = el("div", "tabbar");
    document.body.classList.add("has-tabbar");
    requestAnimationFrame(function () {
      document.documentElement.style.setProperty("--tabbar-h", bar.offsetHeight + "px");
    });
    var items = [
      { key: "home", label: "Ana Sayfa", icon: ICON.home, hash: "#/" },
      { key: "records", label: "Kayıtlar", icon: ICON.bookmark, hash: "#/records" },
      { key: "search", label: "Ara", icon: ICON.search, hash: "#/search" },
      { key: "settings", label: "Ayarlar", icon: ICON.sliders, hash: "#/settings" },
      { key: "exit", label: "Çıkış", icon: ICON.exit, exit: true }
    ];
    items.forEach(function (it) {
      var isActive = it.key === active;
      var btn = el("button", "tab-item" + (isActive ? " active" : "") + (it.exit ? " exit" : ""));
      var iconHtml = isActive ? '<span class="tab-pill">' + it.icon + "</span>" : it.icon;
      btn.innerHTML = iconHtml + "<span>" + it.label + "</span>";
      btn.addEventListener("click", function () { it.exit ? exitApp() : go(it.hash); });
      bar.appendChild(btn);
    });
    return bar;
  }

  function el(tag, cls, html) {
    var e = document.createElement(tag);
    if (cls) e.className = cls;
    if (html !== undefined) e.innerHTML = html;
    return e;
  }

  // ---------- Home ----------
  function renderHome() {
    root.innerHTML = "";
    var screen = el("div", "screen");

    // Ana sayfa kaydırmasız: sayfa sabit, yalnızca Günün Ayeti kartının içi kayar.
    document.body.classList.add("home-lock");
    document.documentElement.classList.add("home-lock");
    var header = el("div", "home-header");
    header.innerHTML = '<h1 class="txt-baslik">Kutsal Kitaplar</h1>';
    screen.appendChild(header);

    if (state.history.length > 0) {
      var last = state.history[0];
      var badgeNum = last.ch || last.unit;
      var pct = last.total ? Math.round(((last.vi || 0) + 1) / last.total * 100) : 0;
      var card = el("div", "resume-card");
      card.innerHTML =
        '<div class="resume-badge">' + STAR_RING + '<span class="num">' + escapeHtml(String(badgeNum)) + "</span></div>" +
        '<div class="resume-info">' +
        '<p class="label">Kaldığın Yer</p>' +
        '<p class="loc">' + escapeHtml(resumeLabel(last)) + "</p>" +
        '<div class="bar"><div class="bar-fill" style="width:' + pct + '%"></div></div>' +
        "</div>" +
        '<div class="chevron">' + ICON.chevron + "</div>";
      card.addEventListener("click", function () { go(readUrl(last.book, last.unit, last.ch, last.n)); });
      screen.appendChild(card);
    }

    var grid = el("div", "book-grid");
    BOOK_ORDER.forEach(function (key) {
      var b = BOOKS[key];
      var card = el("button", "book-card " + BOOK_CARD_CLASS[key]);
      card.innerHTML =
        '<div class="badge">' + BOOK_ICON[key] + "</div>" +
        '<p class="name book-name">' + bookTitle(key) + "</p>";
      card.addEventListener("click", function () { go("#/list/" + key); });
      grid.appendChild(card);
    });
    screen.appendChild(grid);

    var vod = getVerseOfDay();
    if (vod) {
      var vCard = el("div", "verse-day-card");
      vCard.innerHTML =
        '<p class="greeting">- ' + greeting() + "</p>" +
        '<div class="quote-scroll"><p class="quote">&ldquo;' + escapeHtml(vod.verse.t) + '&rdquo;</p></div>' +
        '<div class="ref">KUR\'AN ' + vod.surah.id + ":" + vod.verse.n + " &middot; Edip Yüksel Meali " + ICON.chevRight + "</div>";
      vCard.querySelector(".ref").addEventListener("click", function () {
        go(readUrl("kuran", vod.surah.id, null, vod.verse.n));
      });
      screen.appendChild(vCard);
    }

    var footer = el("div", "home-footer", "Yazılım ve Derleme Murat BOSTANCI ®");
    footer.addEventListener("click", handleFooterTap);
    screen.appendChild(footer);

    root.appendChild(screen);
    root.appendChild(tabbar("home"));
  }

  function resumeLabel(entry) {
    var unit = getUnit(entry.book, entry.unit);
    if (!unit) return "";
    var name = shortUnitName(unit.name);
    if (BOOKS[entry.book].kind === "flat") {
      return name + " " + entry.unit + (entry.n ? ":" + entry.n : "");
    }
    return name + " " + entry.ch + (entry.n ? ":" + entry.n : "");
  }

  // ---------- Kur'an üst çubuk menüleri (sıralama + meal) ----------
  // Açılır menüler ikonun altında yüzer (position:absolute); üst çubuğu büyütmez, listeyi itmez.
  var openMenu = null; // { wrap, pop, btn }
  var swallowClickUntil = 0;
  function closeMenus() {
    if (!openMenu) return false;
    var m = openMenu; openMenu = null;
    try { m.btn.setAttribute("aria-expanded", "false"); if (m.pop.parentNode) m.pop.parentNode.removeChild(m.pop); } catch (e) {}
    return true;
  }
  // Dışarı dokunma: menüyü kapat ve o dokunuşun listedeki bir satırı açmasını engelle.
  document.addEventListener("pointerdown", function (e) {
    if (openMenu && !(e.target.closest && e.target.closest(".tb-menu"))) { closeMenus(); swallowClickUntil = Date.now() + 450; }
  }, true);
  document.addEventListener("click", function (e) {
    if (Date.now() < swallowClickUntil && !(e.target.closest && e.target.closest(".tb-menu"))) {
      swallowClickUntil = 0; e.stopPropagation(); e.preventDefault();
    }
  }, true);
  // Liste kaydırılınca menü kapanır.
  window.addEventListener("scroll", function () { if (openMenu) closeMenus(); }, { passive: true });

  function menuItem(label, sub, active, onPick) {
    var b = el("button", "pop-item" + (active ? " active" : ""));
    b.setAttribute("role", "menuitemradio");
    b.setAttribute("aria-checked", active ? "true" : "false");
    b.innerHTML = '<span class="pop-label"><span>' + escapeHtml(label) + "</span>" + (sub ? "<small>" + escapeHtml(sub) + "</small>" : "") + "</span>" +
      '<span class="pop-check">' + (active ? ICON.check : "") + "</span>";
    b.addEventListener("click", onPick);
    return b;
  }

  function kuranMenus(onChange) {
    var frag = document.createDocumentFragment();

    function makeMenu(iconHtml, label, buildItems, title, extraCls) {
      var wrap = el("div", "tb-menu");
      var btn = el("button", "icon-btn", iconHtml);
      btn.setAttribute("aria-label", label);
      btn.setAttribute("aria-haspopup", "menu");
      btn.setAttribute("aria-expanded", "false");
      btn.addEventListener("click", function () {
        var wasOpen = openMenu && openMenu.btn === btn;
        closeMenus();
        if (wasOpen) return;
        var pop = el("div", "pop-menu" + (extraCls ? " " + extraCls : ""));
        pop.setAttribute("role", "menu");
        pop.appendChild(el("div", "pop-title", title));
        var list = el("div", "pop-list");
        buildItems(list);
        pop.appendChild(list);
        wrap.appendChild(pop);
        btn.setAttribute("aria-expanded", "true");
        openMenu = { wrap: wrap, pop: pop, btn: btn };
        // Seçili öğe görünür alanın dışındaysa kaydır (görünüyorsa liste en baştan başlar).
        var act = list.querySelector(".active");
        if (act) {
          var top = act.offsetTop - list.offsetTop;
          if (top + act.offsetHeight > list.clientHeight) list.scrollTop = Math.max(0, top - 8);
        }
      });
      wrap.appendChild(btn);
      return wrap;
    }

    // Sıralama (okuma/kitap ikonu) — kişi ikonunun soluna
    frag.appendChild(makeMenu(ICON.bookOpen, "Sûre sıralaması", function (list) {
      [["mushaf", "Mushaf sırası", "Kur'an'daki sıra"], ["nuzul", "Nüzul sırası", "İniş sırası"]].forEach(function (o) {
        list.appendChild(menuItem(o[1], o[2], state.kOrder === o[0], function () {
          var changed = state.kOrder !== o[0];
          state.kOrder = o[0]; writeRaw(LS_KORDER, o[0]);
          closeMenus();
          if (changed) { onChange(true); showToast(o[1]); }
        }));
      });
    }, "Sıralama"));

    // Meal seçimi (kişi/yazar ikonu) — en sağda
    frag.appendChild(makeMenu(ICON.user, "Meal seç", function (list) {
      MEALS.slice().sort(function (a, b) { return a[1].localeCompare(b[1], "tr"); }).forEach(function (m) {
        list.appendChild(menuItem(m[1], "", state.meal === m[0], function () {
          if (m[0] === state.meal) { closeMenus(); return; }
          if (mealBusy) return;
          mealBusy = true;
          loadMeal(m[0], function (ok) {
            mealBusy = false;
            if (!ok || !applyMeal(m[0])) { showToast("Meal yüklenemedi"); return; }
            writeRaw(LS_MEAL, m[0]);
            closeMenus();
            onChange(false);
            showToast(m[1] + " meali");
          });
        }));
      });
    }, "Meal", "pop-meals"));
    return frag;
  }

  // ---------- List screen (units of a book) ----------
  function renderList(bookKey) {
    var book = BOOKS[bookKey];
    root.innerHTML = "";
    var bar = topbar(bookTitle(bookKey), { back: true, backUrl: "#/" });
    root.appendChild(bar);
    var screen = el("div", "screen");
    function paint() {
      screen.innerHTML = "";
      var nuzul = bookKey === "kuran" && state.kOrder === "nuzul";
      orderedUnits(bookKey).forEach(function (u, i) {
        var row = el("div", "list-row");
        var cnt = unitVerseCount(bookKey, u);
        var sub = book.kind === "nested" ? u.chapters.length + " bölüm" : (u.verses ? cnt + " ayet" : "");
        if (nuzul) sub = u.id + ". sûre \u00B7 " + sub;
        row.innerHTML =
          '<div><div class="name txt-liste">' + (nuzul ? i + 1 : u.id) + ". " + u.name + '</div><div class="sub">' + sub + "</div></div>" +
          '<div class="chevron">' + ICON.chevron + "</div>";
        row.addEventListener("click", function () {
          if (book.kind === "flat") go(readUrl(bookKey, u.id));
          else go("#/chapters/" + bookKey + "/" + u.id);
        });
        screen.appendChild(row);
      });
    }
    if (bookKey === "kuran") {
      bar.appendChild(kuranMenus(function (orderChanged) {
        paint();
        if (orderChanged) resetScroll(); // yeni sıralamada listenin başına dön; meal değişince konum korunur
      }));
    }
    paint();
    root.appendChild(screen);
  }

  // ---------- Chapters screen (for nested books) ----------
  function renderChapters(bookKey, unitId) {
    var book = BOOKS[bookKey];
    var unit = getUnit(bookKey, unitId);
    root.innerHTML = "";
    root.appendChild(topbar(unit.name, { back: true, backUrl: "#/list/" + bookKey }));
    var screen = el("div", "screen");
    unit.chapters.forEach(function (c) {
      var row = el("div", "list-row");
      row.innerHTML =
        '<div><div class="name txt-liste">' + chapLabel(c) + "</div><div class=\"sub\">" + c.verses.length + (c.fn ? " dipnot" : " ayet") + "</div></div>" +
        '<div class="chevron">' + ICON.chevron + "</div>";
      row.addEventListener("click", function () { go(readUrl(bookKey, unitId, c.ch)); });
      screen.appendChild(row);
    });
    root.appendChild(screen);
  }

  // ---------- Reader ----------
  function renderReader(bookKey, unitId, ch, scrollToVerse) {
    var book = BOOKS[bookKey];
    var chapter = getChapter(bookKey, unitId, ch);
    if (!chapter) return renderHome();

    var histEntry = { book: bookKey, unit: unitId, ch: ch || null, loc: unitLocLabel(bookKey, unitId, ch), n: null, vi: 0, total: chapter.verses.length };
    pushHistory(histEntry);

    root.innerHTML = "";
    var header = el("div", "reader-header");
    var title = unitLocLabel(bookKey, unitId, ch);
    header.innerHTML =
      '<button class="icon-btn" data-back>' + ICON.back + "</button>" +
      '<div class="title txt-liste">' + title + "</div>" +
      '<div class="font-controls">' +
      '<button class="icon-btn" data-dec>' + ICON.minus + "</button>" +
      '<button class="icon-btn" data-inc>' + ICON.plus + "</button>" +
      "</div>";
    header.querySelector("[data-back]").addEventListener("click", function () {
      goBack(book.kind === "flat" ? "#/list/" + bookKey : "#/chapters/" + bookKey + "/" + unitId);
    });
    header.querySelector("[data-dec]").addEventListener("click", function () { changeFontSize(-1); });
    header.querySelector("[data-inc]").addEventListener("click", function () { changeFontSize(1); });
    root.appendChild(header);

    var block = el("div", "verse-block");
    block.setAttribute("lang", "tr");
    var targetVi = findTargetIndex(chapter.verses, scrollToVerse);
    chapter.verses.forEach(function (v, vi) {
      if (v.h) {
        var hEl = el("div", "verse-heading");
        hEl.textContent = v.h;
        block.appendChild(hEl);
      }
      var vEl = el("div", "verse");
      vEl.dataset.vi = vi;
      vEl.dataset.n = v.n;
      if (isFav(bookKey, unitId, ch || null, v.n)) vEl.classList.add("fav");
      if (getNote(bookKey, unitId, ch || null, v.n)) vEl.classList.add("noted");
      if (isBookmarked(bookKey, unitId, ch || null, v.n)) vEl.classList.add("bookmarked");
      vEl.innerHTML =
        '<div class="num" data-len="' + (chapter.fn ? 1 : verseNumLen(v.n)) + '">' + (chapter.fn ? "&bull;" : verseNumHtml(v.n)) + "</div>" +
        '<div class="vbody"><div class="text txt-ayet">' + escapeHtml(v.t) + "</div>" +
        (v.d ? '<div class="verse-note">' + escapeHtml(v.d) + "</div>" : "") + "</div>";
      vEl.addEventListener("click", function () {
        openVerseSheet({ book: bookKey, unit: unitId, ch: ch || null, n: v.n, t: v.t, title: title, fn: !!chapter.fn, el: vEl });
      });
      if (vi === targetVi) vEl.id = "target-verse";
      block.appendChild(vEl);
    });
    root.appendChild(block);

    var adj = getAdjacent(bookKey, unitId, ch);
    var nav = el("div", "reader-nav");
    if (adj.prev) {
      var pBtn = el("button", "nav-btn prev");
      pBtn.innerHTML = ICON.chevLeft + "<span>Önceki</span>";
      pBtn.addEventListener("click", function () { navTo(adj.prev.url); });
      nav.appendChild(pBtn);
    } else {
      nav.appendChild(el("div", "nav-slot prev"));
    }
    if (adj.next) {
      var nBtn = el("button", "nav-btn next");
      nBtn.innerHTML = "<span>Sonraki</span>" + ICON.chevRight;
      nBtn.addEventListener("click", function () { navTo(adj.next.url); });
      nav.appendChild(nBtn);
    } else {
      nav.appendChild(el("div", "nav-slot next"));
    }
    root.appendChild(nav);

    if (scrollToVerse) {
      var t = document.getElementById("target-verse");
      if (t) setTimeout(function () { t.scrollIntoView({ block: "center" }); }, 50);
    }

    // Track reading progress (topmost visible verse) for the Home "Kaldığın Yer" card.
    var headerH = header.getBoundingClientRect().height;
    var onScroll = debounce(function () {
      var verses = block.querySelectorAll(".verse");
      var current = verses[0];
      for (var i = 0; i < verses.length; i++) {
        if (verses[i].getBoundingClientRect().top >= headerH) { current = verses[i]; break; }
        current = verses[i];
      }
      if (!current) return;
      histEntry.vi = parseInt(current.dataset.vi, 10) || 0;
      histEntry.n = current.dataset.n;
      saveJSON(LS_HIST, state.history);
    }, 250);
    window.addEventListener("scroll", onScroll);
    window.addEventListener("hashchange", function cleanup() {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("hashchange", cleanup);
    }, { once: true });
  }

  // ---------- Search ----------
  function renderSearch(query) {
    root.innerHTML = "";
    var screen = el("div", "screen");
    screen.appendChild(el("div", "home-header", '<h1 class="txt-baslik">Ara</h1>'));
    var searchBar = el("div", "search-bar");
    searchBar.innerHTML = ICON.search + '<input type="text" placeholder="Ayet veya kelime ara..." />';
    var input = searchBar.querySelector("input");
    input.value = query || "";
    screen.appendChild(searchBar);

    // Kitap seçim filtresi (çipler)
    var chips = el("div", "search-filter");
    chips.setAttribute("role", "tablist");
    var FILTERS = [{ key: "all", label: "Tümü" }].concat(["kuran", "tevrat", "zebur", "incil"].filter(function (k) { return BOOKS[k]; }).map(function (k) {
      return { key: k, label: k === "kuran" ? "Kur\u2019an-\u0131 Kerim" : BOOKS[k].label };
    }));
    function paintChips() {
      Array.prototype.forEach.call(chips.children, function (c) {
        var on = c.dataset.key === state.searchBook;
        c.classList.toggle("active", on);
        c.setAttribute("aria-selected", on ? "true" : "false");
      });
    }
    FILTERS.forEach(function (f) {
      var chip = el("button", "chip", escapeHtml(f.label));
      chip.dataset.key = f.key;
      chip.setAttribute("role", "tab");
      chip.addEventListener("click", function () {
        if (state.searchBook === f.key) return;
        state.searchBook = f.key;
        writeRaw(LS_SEARCH_BOOK, f.key);
        paintChips();
        doSearch(input.value);
      });
      chips.appendChild(chip);
    });
    paintChips();
    screen.appendChild(chips);

    var results = el("div", "");
    screen.appendChild(results);
    root.appendChild(screen);
    root.appendChild(tabbar("search"));
    // Not: Açılışta otomatik odaklanma yok; klavye kullanıcı kutuya dokununca açılır.

    function doSearch(q) {
      results.innerHTML = "";
      if (!q || q.trim().length < 2) {
        results.innerHTML = '<div class="empty-state">En az 2 karakter girin.</div>';
        return;
      }
      var found = runSearch(q.trim(), state.searchBook);
      if (found.length === 0) {
        results.innerHTML = '<div class="empty-state">Sonuç bulunamadı.</div>';
        return;
      }
      found.slice(0, 150).forEach(function (r) {
        var row = el("div", "search-result");
        row.innerHTML =
          '<div class="loc">' + bookTitle(r.book) + " &middot; " + r.loc + "</div>" +
          '<div class="snippet">' + highlight(r.snippet, q) + "</div>";
        row.addEventListener("click", function () {
          go(readUrl(r.book, r.unit, r.ch, r.n));
        });
        results.appendChild(row);
      });
    }
    input.addEventListener("input", debounce(function () { doSearch(input.value); }, 250));
    input.addEventListener("keydown", function (e) { if (e.key === "Enter") doSearch(input.value); });
    if (query) doSearch(query);
  }

  function runSearch(q, bookFilter) {
    var needle = turkishLower(q);
    var out = [];
    var keys = (bookFilter && bookFilter !== "all" && BOOKS[bookFilter]) ? [bookFilter] : BOOK_ORDER;
    keys.forEach(function (bookKey) {
      var book = BOOKS[bookKey];
      getUnits(bookKey).forEach(function (u) {
        if (book.kind === "flat") {
          u.verses.forEach(function (v) {
            if (turkishLower(v.t).indexOf(needle) !== -1) {
              out.push({ book: bookKey, unit: u.id, ch: null, n: v.n, loc: u.name + ", " + v.n, snippet: v.t });
            }
          });
        } else {
          u.chapters.forEach(function (c) {
            c.verses.forEach(function (v) {
              if (turkishLower(v.t).indexOf(needle) !== -1) {
                out.push({ book: bookKey, unit: u.id, ch: c.ch, n: v.n, loc: c.fn ? u.name + " Dipnotlar" : u.name + " " + c.ch + ":" + v.n, snippet: v.t });
              }
            });
          });
        }
      });
    });
    return out;
  }

  // ---------- Records (bookmarks + favorites + history) ----------
  function renderRecords() {
    root.innerHTML = "";
    var screen = el("div", "screen");
    screen.appendChild(el("div", "home-header", '<h1 class="txt-baslik">Kayıtlar</h1>'));

    var empty = state.bookmarks.length === 0 && state.favorites.length === 0 && state.notes.length === 0 && state.history.length === 0;
    if (empty) {
      screen.appendChild(el("div", "empty-state", ICON.bookmark + "<div>Henüz kayıt yok.<br>Bir ayete dokunup yer imi, vurgu veya not ekleyin.</div>"));
    } else {
      function section(title, items, key, buildMain, onOpen) {
        var sec = el("div", "records-section");
        sec.appendChild(el("h2", "", title));
        items.forEach(function (item) {
          var row = el("div", "rec-row");
          var main = el("div", "rec-main", buildMain(item));
          main.addEventListener("click", function () { onOpen(item); });
          var del = el("button", "icon-btn rec-del", ICON.trash);
          del.setAttribute("aria-label", "Sil");
          del.addEventListener("click", function (e) {
            e.stopPropagation();
            var idx = state[key].indexOf(item);
            if (idx >= 0) state[key].splice(idx, 1);
            saveJSON(key === "bookmarks" ? LS_BOOKMARK : key === "favorites" ? LS_FAV : key === "notes" ? LS_NOTES : LS_HIST, state[key]);
            renderRecords();
          });
          row.appendChild(main);
          row.appendChild(del);
          sec.appendChild(row);
        });
        screen.appendChild(sec);
      }
      if (state.bookmarks.length) {
        section("Yer İmleri", state.bookmarks, "bookmarks", function (b) {
          return '<div class="name txt-liste">' + bookTitle(b.book) + '</div><div class="sub">' + escapeHtml(b.loc) + "</div>";
        }, function (b) { go(readUrl(b.book, b.unit, b.ch, b.n)); });
      }
      if (state.favorites.length) {
        section("Vurgulanan Ayetler", state.favorites, "favorites", function (f) {
          return '<div class="loc">' + bookTitle(f.book) + " &middot; " + escapeHtml(f.loc) + '</div><div class="snippet">' + escapeHtml(f.snippet) + "</div>";
        }, function (f) { go(readUrl(f.book, f.unit, f.ch, f.n)); });
      }
      if (state.notes.length) {
        section("Notlar", state.notes, "notes", function (f) {
          return '<div class="loc">' + bookTitle(f.book) + " &middot; " + escapeHtml(f.loc) + '</div><div class="snippet">' + escapeHtml(f.note) + "</div>";
        }, function (f) { go(readUrl(f.book, f.unit, f.ch, f.n)); });
      }
      if (state.history.length) {
        section("Son Okunanlar", state.history, "history", function (h) {
          return '<div class="name txt-liste">' + bookTitle(h.book) + '</div><div class="sub">' + escapeHtml(resumeLabel(h)) + "</div>";
        }, function (h) { go(readUrl(h.book, h.unit, h.ch, h.n)); });
      }
    }
    root.appendChild(screen);
    root.appendChild(tabbar("records"));
  }

  // ---------- Sürüm / Yedekleme / Hakkında ----------
  // Her değişiklikte hem bu değer hem app/build.gradle (versionName) +1 güncellenir.
  var APP_VERSION = "2.36";
  var BACKUP_FOLDER_LABEL = "Backups / 4 Kitap";
  var BACKUP_KEYS = [LS_FAV, LS_HIST, LS_BOOKMARK, LS_NOTES, LS_SEARCH_BOOK, LS_TEXT_CATS, LS_THEME, LS_OVERRIDES, LS_DIM, LS_MEAL, LS_KORDER];
  var overlayNode = null; // açık popup / alt sayfa

  function closeOverlay(immediate) {
    if (!overlayNode) return;
    var n = overlayNode;
    overlayNode = null;
    n.classList.remove("open");
    if (immediate) n.remove();
    else setTimeout(function () { n.remove(); }, 220);
  }

  function openPopup(title, lines, buttons) {
    closeOverlay(true);
    var ov = el("div", "popup-overlay");
    var box = el("div", "popup-box");
    box.setAttribute("role", "dialog");
    var h = el("h2", "popup-title");
    h.textContent = title;
    box.appendChild(h);
    lines.forEach(function (t) {
      var p = el("p", "popup-line");
      p.textContent = t;
      box.appendChild(p);
    });
    var acts = el("div", "popup-actions");
    buttons.forEach(function (b) {
      var btn = el("button", "popup-btn" + (b.primary ? " primary" : ""));
      btn.textContent = b.label;
      btn.addEventListener("click", function () { closeOverlay(); if (b.onClick) b.onClick(); });
      acts.appendChild(btn);
    });
    box.appendChild(acts);
    ov.appendChild(box);
    ov.addEventListener("click", function (e) { if (e.target === ov) closeOverlay(); });
    document.body.appendChild(ov);
    overlayNode = ov;
    requestAnimationFrame(function () { ov.classList.add("open"); });
  }

  function openAbout() {
    openPopup("Hakkında", ["Yazılım ve Derleme", "Murat BOSTANCI\u00AE", "Ver " + APP_VERSION + " - 2026"], [{ label: "Tamam", primary: true }]);
  }

  function buildBackup() {
    var data = {};
    BACKUP_KEYS.forEach(function (k) {
      var v = readRaw(k);
      if (v !== null && v !== undefined) data[k] = v;
    });
    return JSON.stringify({ app: "4-Kitap", version: APP_VERSION, created: new Date().toISOString(), data: data }, null, 1);
  }

  function backupFileName() {
    var d = new Date(), p = function (n) { return (n < 10 ? "0" : "") + n; };
    return "4-Kitap-Yedek-" + p(d.getDate()) + "-" + p(d.getMonth() + 1) + "-" + d.getFullYear() + ".json";
  }

  function saveBackupFile() {
    var json = buildBackup(), name = backupFileName();
    try {
      if (window.Android && typeof window.Android.saveBackup === "function") { window.Android.saveBackup(name, json); return; }
    } catch (e) {}
    try { // tarayıcıda dosya indirme
      var blob = new Blob([json], { type: "application/json" });
      var a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = name;
      document.body.appendChild(a); a.click(); a.remove();
      showToast("Yedek indirildi");
    } catch (e2) { showToast("Yedek alınamadı"); }
  }

  function pickRestoreFile() {
    try {
      if (window.Android && typeof window.Android.pickRestoreFile === "function") { window.Android.pickRestoreFile(); return; }
    } catch (e) {}
    var inp = document.createElement("input");
    inp.type = "file"; inp.accept = ".json,application/json";
    inp.addEventListener("change", function () {
      var f = inp.files && inp.files[0];
      if (!f) return;
      var r = new FileReader();
      r.onload = function () { window.dkRestoreData(String(r.result)); };
      r.readAsText(f);
    });
    inp.click();
  }

  function applyBackup(data) {
    BACKUP_KEYS.forEach(function (k) { if (typeof data[k] === "string") writeRaw(k, data[k]); });
    showToast("Yedek geri yüklendi");
    setTimeout(function () { location.reload(); }, 700);
  }

  // Android tarafı bu üç fonksiyonu çağırır.
  window.dkRestoreData = function (text) {
    var obj = null;
    try { obj = JSON.parse(text); } catch (e) {}
    if (!obj || obj.app !== "4-Kitap" || !obj.data || typeof obj.data !== "object") {
      openPopup("Geri yüklenemedi", ["Seçilen dosya geçerli bir 4 Kitap yedeği değil."], [{ label: "Tamam", primary: true }]);
      return;
    }
    var lines = ["Mevcut ayarların, favorilerin, yer imlerin, kaldığın yer ve notların bu yedekteki verilerle değiştirilecek."];
    var when = obj.created ? new Date(obj.created) : null;
    if (when && !isNaN(when.getTime())) lines.push("Yedek tarihi: " + when.toLocaleDateString("tr-TR"));
    openPopup("Geri yüklensin mi?", lines, [
      { label: "Vazgeç" },
      { label: "Geri yükle", primary: true, onClick: function () { applyBackup(obj.data); } }
    ]);
  };
  window.dkBackupDone = function (ok, msg) {
    openPopup(ok ? "Yedek kaydedildi" : "Yedek alınamadı", [msg], [{ label: "Tamam", primary: true }]);
  };
  window.dkToast = function (msg) { showToast(msg); };

  function openBackupSheet() {
    closeOverlay(true);
    var overlay = el("div", "sheet-overlay");
    var sheet = el("div", "sheet backup-sheet");
    sheet.setAttribute("role", "dialog");
    sheet.innerHTML =
      '<div class="sheet-grip"></div>' +
      '<div class="backup-head"><h2 class="backup-title txt-baslik">Yedekle / geri yükle</h2>' +
      '<button class="icon-btn" data-close aria-label="Kapat">' + ICON.close + "</button></div>" +
      '<p class="backup-text">Ayarların, favorilerin, yer imlerin, kaldığın yer ve notların tek bir .json dosyasına kaydedilir. ' +
      "Android'de dosya, telefonun belleğindeki <b>" + BACKUP_FOLDER_LABEL + "</b> klasörüne otomatik kaydedilir (klasör yoksa oluşturulur). Tek yedek tutulur: yeni yedek alınca öncekinin üzerine yazılır. " +
      "İlk yedekte Android, dosya erişim izni isteyebilir. Yeni cihazda ya da yeniden kurulumdan sonra bu dosyayı seçerek her şeyi geri yükleyebilirsin.</p>" +
      '<button class="backup-btn" data-save><span class="backup-ico">' + ICON.cloudUp + "</span>Yedekle (Dosya Kaydet)</button>" +
      '<button class="backup-btn" data-restore><span class="backup-ico">' + ICON.cloudDown + "</span>Yedek Dosyadan Geri Yükle</button>";
    overlay.appendChild(sheet);
    overlay.addEventListener("click", function (e) { if (e.target === overlay) closeOverlay(); });
    sheet.querySelector("[data-close]").addEventListener("click", function () { closeOverlay(); });
    sheet.querySelector("[data-save]").addEventListener("click", function () { closeOverlay(true); saveBackupFile(); });
    sheet.querySelector("[data-restore]").addEventListener("click", function () { closeOverlay(true); pickRestoreFile(); });
    document.body.appendChild(overlay);
    overlayNode = overlay;
    requestAnimationFrame(function () { overlay.classList.add("open"); });
  }

  // ---------- Settings ----------
  var settingsOpenCat = null;   // açık yazı kartı (yalnızca oturum içi)
  function renderSettings() {
    root.innerHTML = "";
    var screen = el("div", "screen");
    screen.appendChild(el("div", "home-header", '<h1 class="txt-baslik">Ayarlar</h1>'));

    function rerender() {
      var y = window.pageYOffset || document.documentElement.scrollTop || 0;
      renderSettings();
      window.scrollTo(0, y);
    }

    // ---- Tema ----
    var g4 = el("div", "settings-group");
    g4.appendChild(el("h2", "", "Tema"));
    var themeSeg = el("div", "segmented themes");
    var themes = [
      { key: "sistem", label: "Sistem", swatch: "linear-gradient(135deg,#F7F6F3 50%,#17181A 50%)" },
      { key: "light", label: "Açık", swatch: "#F7F6F3" },
      { key: "dark", label: "Koyu", swatch: "#17181A" },
      { key: "oled", label: "Siyah", swatch: "#000000" },
      { key: "sepia", label: "Sepya", swatch: "#F4ECD8" }
    ];
    themes.forEach(function (t) {
      var btn = el("button", state.theme === t.key ? "active" : "", '<span class="swatch" style="background:' + t.swatch + '"></span>' + t.label);
      btn.addEventListener("click", function () {
        state.theme = t.key;
        writeRaw(LS_THEME, t.key);
        applySettings();
        rerender();
      });
      themeSeg.appendChild(btn);
    });
    g4.appendChild(themeSeg);
    screen.appendChild(g4);

    // ---- Yazı ayarları: her kategori açılır kart ----
    var gt = el("div", "settings-group");
    gt.appendChild(el("h2", "", "Yazı"));
    Object.keys(TEXT_CAT_LABELS).forEach(function (catKey) {
      var cat = state.textCats[catKey];
      var fam = FONT_OPTIONS[cat.family] || FONT_OPTIONS.sistem;
      var open = settingsOpenCat === catKey;
      var card = el("div", "set-card" + (open ? " open" : ""));

      var head = el("button", "set-head",
        '<div class="set-head-text"><div class="set-title">' + TEXT_CAT_LABELS[catKey] + '</div>' +
        '<div class="set-sum">' + fam.label + " · " + STYLE_OPTIONS[cat.style].label + " · " + cat.size + '</div></div>' +
        '<span class="set-chev">' + ICON.chevron + "</span>");
      head.addEventListener("click", function () {
        settingsOpenCat = open ? null : catKey;
        rerender();
      });
      card.appendChild(head);

      if (open) {
        var body = el("div", "set-body");

        var rowF = el("label", "set-row");
        rowF.appendChild(el("span", "set-label", "Yazı tipi"));
        var sel = el("select", "set-select");
        Object.keys(FONT_OPTIONS).forEach(function (key) {
          var o = document.createElement("option");
          o.value = key; o.textContent = FONT_OPTIONS[key].label;
          if (cat.family === key) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener("change", function () {
          cat.family = sel.value;
          saveTextCats(); applySettings(); rerender();
        });
        rowF.appendChild(sel);
        body.appendChild(rowF);

        var rowS = el("div", "set-row");
        rowS.appendChild(el("span", "set-label", "Stil"));
        var seg = el("div", "segmented compact");
        Object.keys(STYLE_OPTIONS).forEach(function (key) {
          var btn = el("button", cat.style === key ? "active" : "", STYLE_OPTIONS[key].label);
          btn.addEventListener("click", function () {
            cat.style = key;
            saveTextCats(); applySettings(); rerender();
          });
          seg.appendChild(btn);
        });
        rowS.appendChild(seg);
        body.appendChild(rowS);

        var rowZ = el("div", "set-row");
        rowZ.appendChild(el("span", "set-label", "Boyut"));
        var stepper = el("div", "stepper-btns",
          '<button class="icon-btn" data-dec>' + ICON.minus + "</button>" +
          '<span class="val">' + cat.size + "</span>" +
          '<button class="icon-btn" data-inc>' + ICON.plus + "</button>");
        stepper.querySelector("[data-dec]").addEventListener("click", function () {
          cat.size = Math.max(FONT_SIZE_MIN, cat.size - 1);
          saveTextCats(); applySettings(); rerender();
        });
        stepper.querySelector("[data-inc]").addEventListener("click", function () {
          cat.size = Math.min(FONT_SIZE_MAX, cat.size + 1);
          saveTextCats(); applySettings(); rerender();
        });
        rowZ.appendChild(stepper);
        body.appendChild(rowZ);

        var prev = el("div", "set-preview", "Örnek metin: Kutsal Kitaplar 123");
        var sty = STYLE_OPTIONS[cat.style];
        prev.style.fontFamily = fam.css;
        prev.style.fontStyle = sty.italic;
        prev.style.fontWeight = sty.weight;
        prev.style.fontSize = (cat.size / 16) + "rem";
        body.appendChild(prev);

        card.appendChild(body);
      }
      gt.appendChild(card);
    });
    screen.appendChild(gt);

    if (state.adminUnlocked) {
      var g5 = el("div", "settings-group");
      g5.appendChild(el("h2", "", "Yönetim"));
      var adminRow = el("div", "list-row");
      adminRow.innerHTML = '<div><div class="name">Yönetim Paneli</div><div class="sub">Sûre / bölüm / ayet metinlerini düzenle</div></div><div class="chevron">' + ICON.chevron + "</div>";
      adminRow.addEventListener("click", function () { go("#/admin"); });
      g5.appendChild(adminRow);
      screen.appendChild(g5);
    }

    // ---- Yedekleme ve Hakkında ----
    var gb = el("div", "backup-group");
    var bChip = el("button", "chip-btn accent", "Yedekle / Geri yükle");
    bChip.addEventListener("click", openBackupSheet);
    gb.appendChild(bChip);
    gb.appendChild(el("p", "backup-note", "Kayıtlar yalnızca bu cihazda saklanır."));
    var aChip = el("button", "chip-btn", "Hakkında");
    aChip.addEventListener("click", openAbout);
    gb.appendChild(aChip);
    screen.appendChild(gb);

    root.appendChild(screen);
    root.appendChild(tabbar("settings"));
  }

  // ---------- Admin (hidden content editor) ----------
  function renderAdmin(bookKey, unitId, ch) {
    if (!state.adminUnlocked) return renderHome();

    if (!bookKey) {
      root.innerHTML = "";
      root.appendChild(topbar("Yönetim Paneli", { back: true, backUrl: "#/settings" }));
      var screen0 = el("div", "screen");
      BOOK_ORDER.forEach(function (key) {
        var row = el("div", "list-row");
        row.innerHTML = '<div class="name">' + bookTitle(key) + '</div><div class="chevron">' + ICON.chevron + "</div>";
        row.addEventListener("click", function () { go("#/admin/" + key); });
        screen0.appendChild(row);
      });
      root.appendChild(screen0);
      return;
    }

    var book = BOOKS[bookKey];

    if (!unitId) {
      root.innerHTML = "";
      root.appendChild(topbar(bookTitle(bookKey) + (bookKey === "kuran" && BOOKS.kuran.version ? " \u00B7 " + BOOKS.kuran.version : ""), { back: true, backUrl: "#/admin" }));
      var screen1 = el("div", "screen");
      getUnits(bookKey).forEach(function (u) {
        var row = el("div", "list-row");
        row.innerHTML = '<div class="name">' + u.id + ". " + u.name + '</div><div class="chevron">' + ICON.chevron + "</div>";
        row.addEventListener("click", function () { go("#/admin/" + bookKey + "/" + u.id); });
        screen1.appendChild(row);
      });
      root.appendChild(screen1);
      return;
    }

    if (book.kind === "nested" && !ch) {
      var unit = getUnit(bookKey, unitId);
      root.innerHTML = "";
      root.appendChild(topbar(unit ? unit.name : "", { back: true, backUrl: "#/admin/" + bookKey }));
      var screen2 = el("div", "screen");
      (unit ? unit.chapters : []).forEach(function (c) {
        var row = el("div", "list-row");
        row.innerHTML = '<div class="name">' + chapLabel(c) + '</div><div class="chevron">' + ICON.chevron + "</div>";
        row.addEventListener("click", function () { go("#/admin/" + bookKey + "/" + unitId + "/" + c.ch); });
        screen2.appendChild(row);
      });
      root.appendChild(screen2);
      return;
    }

    renderAdminEditor(bookKey, unitId, ch);
  }

  function renderAdminEditor(bookKey, unitId, ch) {
    var chapter = getChapter(bookKey, unitId, ch);
    var verses = chapter ? chapter.verses.map(function (v) { return { n: v.n, t: v.t, h: v.h, d: v.d }; }) : [];
    var hasOverride = !!state.overrides[overrideKey(bookKey, unitId, ch)];

    root.innerHTML = "";
    root.appendChild(topbar(unitLocLabel(bookKey, unitId, ch), { back: true, backUrl: BOOKS[bookKey].kind === "flat" ? "#/admin/" + bookKey : "#/admin/" + bookKey + "/" + unitId }));
    var screen = el("div", "screen admin-editor");

    var actions = el("div", "admin-actions");
    var saveBtn = el("button", "admin-btn primary", "Kaydet");
    var addBtn = el("button", "admin-btn", "+ Ayet Ekle");
    var resetBtn = el("button", "admin-btn danger", "Orijinale Sıfırla");
    actions.appendChild(saveBtn);
    actions.appendChild(addBtn);
    if (hasOverride) actions.appendChild(resetBtn);
    screen.appendChild(actions);

    var list = el("div", "admin-rows");
    screen.appendChild(list);

    function renderRows() {
      list.innerHTML = "";
      verses.forEach(function (v, i) {
        var row = el("div", "admin-row");
        row.innerHTML =
          '<input class="admin-n" type="text" value="' + escapeHtml(String(v.n)) + '" />' +
          '<textarea class="admin-t" rows="3"></textarea>' +
          '<button class="icon-btn admin-del">' + ICON.minus + "</button>";
        row.querySelector(".admin-t").value = v.t;
        row.querySelector(".admin-n").addEventListener("input", function (e) { v.n = e.target.value; });
        row.querySelector(".admin-t").addEventListener("input", function (e) { v.t = e.target.value; });
        row.querySelector(".admin-del").addEventListener("click", function () {
          verses.splice(i, 1);
          renderRows();
        });
        list.appendChild(row);
      });
    }
    renderRows();

    addBtn.addEventListener("click", function () {
      verses.push({ n: verses.length ? verses[verses.length - 1].n : 1, t: "" });
      renderRows();
    });
    saveBtn.addEventListener("click", function () {
      saveOverride(bookKey, unitId, ch, verses.map(function (v) { return { n: v.n, t: v.t, h: v.h, d: v.d }; }));
      saveBtn.textContent = "Kaydedildi ✓";
      setTimeout(function () { saveBtn.textContent = "Kaydet"; }, 1200);
    });
    resetBtn.addEventListener("click", function () {
      clearOverride(bookKey, unitId, ch);
      renderAdminEditor(bookKey, unitId, ch);
    });

    root.appendChild(screen);
  }

  // ---------- Utils ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Aramayla aynı Türkçe küçük harf normalizasyonunu kullanır (İ/i, I/ı); tüm eşleşmeleri işaretler.
  function highlight(text, q) {
    text = String(text);
    var needle = turkishLower(String(q).trim());
    var lower = turkishLower(text);
    if (!needle || lower.length !== text.length) return escapeHtml(text);
    var out = "", pos = 0, idx;
    while ((idx = lower.indexOf(needle, pos)) !== -1) {
      out += escapeHtml(text.slice(pos, idx)) + "<mark>" + escapeHtml(text.slice(idx, idx + needle.length)) + "</mark>";
      pos = idx + needle.length;
    }
    return out + escapeHtml(text.slice(pos));
  }
  function turkishLower(s) {
    return String(s)
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLowerCase()
      .replace(/â/g, "a").replace(/î/g, "i").replace(/û/g, "u");   // şapkalı harfler aramada düz harfle eşleşir (kâfir ~ kafir)
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  applyDim();
  route();
})();
