(function () {
  "use strict";

  // ---------- Book registry ----------
  var BOOKS = {
    kuran: { label: "Kur'an", kind: "flat", unitLabel: "sûre", data: window.KURAN_DATA },
    incil: { label: "İncil", kind: "nested", unitLabel: "İncil", subLabel: "bölüm", data: window.INCIL_DATA },
    tevrat: { label: "Tevrat", kind: "nested", unitLabel: "kitap", subLabel: "bölüm", data: window.TEVRAT_DATA },
    zebur: { label: "Zebur", kind: "flat", unitLabel: "mezmur", data: window.ZEBUR_DATA }
  };
  var BOOK_ORDER = ["kuran", "incil", "tevrat", "zebur"];
  var BOOK_CARD_CLASS = { kuran: "b-kuran", incil: "b-incil", tevrat: "b-tevrat", zebur: "b-zebur" };
  var BOOK_ICON = {
    kuran: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5c-1.6 1.4-1.6 3.2 0 4.6 1.6-1.4 1.6-3.2 0-4.6Z"/><path d="M8 9.5a4 4 0 1 1 8 0v1a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2v-1Z"/><path d="M4 21v-6.2c0-.8.5-1.5 1.3-1.8L9 11.6V21H4Z"/><path d="M20 21v-6.2c0-.8-.5-1.5-1.3-1.8L15 11.6V21h5Z"/><path d="M9 21v-4.5a3 3 0 0 1 6 0V21H9Z"/></svg>',
    incil: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M11 2h2v3.2h3.2v2H13V8l5 3v10H6V11l5-3V7.2H7.8v-2H11V2Z"/></svg>',
    tevrat: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 21V9.3L7 7l3 2.3V21H4Z"/><path d="M14 21V9.3l3-2.3 3 2.3V21h-6Z"/><path d="M10.5 21v-4a1.5 1.5 0 0 1 3 0v4h-3Z"/></svg>',
    zebur: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.5l1.9 5.4L19.3 9.6l-5.4 1.9L12 16.9l-1.9-5.4L4.7 9.6l5.4-1.9L12 2.5Z"/><path d="M18.8 14.5l.9 2.1 2.1.9-2.1.9-.9 2.1-.9-2.1-2.1-.9 2.1-.9.9-2.1Z"/></svg>'
  };
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
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M5 13l4 4L19 7"/></svg>'
  };

  // ---------- Storage helpers ----------
  var LS_FAV = "dk_favorites", LS_HIST = "dk_history", LS_SIZE = "dk_font_size", LS_BOOKMARK = "dk_bookmarks";
  var LS_FONT_FAMILY = "dk_font_family", LS_FONT_STYLE = "dk_font_style", LS_THEME = "dk_theme";
  function loadJSON(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch (e) { return fallback; }
  }
  function saveJSON(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  var state = {
    favorites: loadJSON(LS_FAV, []),   // [{book,unit,ch,n,snippet,loc}]
    history: loadJSON(LS_HIST, []),    // [{book,unit,ch,loc,ts,n,vi,total}]
    bookmarks: loadJSON(LS_BOOKMARK, []), // [{book,unit,ch,loc}] - whole chapter/sûre/mezmur
    fontSize: parseInt(localStorage.getItem(LS_SIZE) || "17", 10),
    fontFamily: localStorage.getItem(LS_FONT_FAMILY) || "sistem",
    fontStyle: localStorage.getItem(LS_FONT_STYLE) || "normal",
    theme: localStorage.getItem(LS_THEME) || "sistem"
  };

  var FONT_OPTIONS = {
    sistem: { label: "Sistem", css: "inherit" },
    serif: { label: "Şerif", css: "Georgia, 'Times New Roman', serif" },
    roboto: { label: "Roboto", css: "Roboto, sans-serif" },
    comfortaa: { label: "Comfortaa", css: "Comfortaa, sans-serif" }
  };
  var STYLE_OPTIONS = {
    normal: { label: "Normal", italic: "normal", weight: 400 },
    italic: { label: "İtalik", italic: "italic", weight: 400 },
    kalin: { label: "Kalın", italic: "normal", weight: 700 }
  };

  function applySettings() {
    var root = document.documentElement;
    var fam = FONT_OPTIONS[state.fontFamily] || FONT_OPTIONS.sistem;
    var sty = STYLE_OPTIONS[state.fontStyle] || STYLE_OPTIONS.normal;
    root.style.setProperty("--reader-font", fam.css);
    root.style.setProperty("--reader-italic", sty.italic);
    root.style.setProperty("--reader-weight", sty.weight);
    if (state.theme === "light" || state.theme === "dark") root.setAttribute("data-theme", state.theme);
    else root.removeAttribute("data-theme");
  }
  applySettings();

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
    state.history = state.history.filter(function (h) { return !(h.book === entry.book && h.unit === entry.unit); });
    entry.ts = Date.now();
    state.history.unshift(entry);
    state.history = state.history.slice(0, 20);
    saveJSON(LS_HIST, state.history);
  }

  function bookmarkKey(b) { return [b.book, b.unit, b.ch || ""].join("|"); }
  function isBookmarked(book, unit, ch) {
    var k = [book, unit, ch || ""].join("|");
    return state.bookmarks.some(function (b) { return bookmarkKey(b) === k; });
  }
  function toggleBookmark(entry) {
    var k = bookmarkKey(entry);
    var idx = state.bookmarks.findIndex(function (b) { return bookmarkKey(b) === k; });
    if (idx >= 0) state.bookmarks.splice(idx, 1);
    else state.bookmarks.unshift(entry);
    saveJSON(LS_BOOKMARK, state.bookmarks);
  }

  // ---------- Data access helpers ----------
  function getUnits(bookKey) { return BOOKS[bookKey].data || []; }
  function getUnit(bookKey, unitId) {
    var units = getUnits(bookKey);
    return units.find(function (u) { return String(u.id) === String(unitId); });
  }
  function getChapter(bookKey, unitId, ch) {
    var unit = getUnit(bookKey, unitId);
    if (!unit) return null;
    if (BOOKS[bookKey].kind === "flat") return unit;
    return unit.chapters.find(function (c) { return String(c.ch) === String(ch); });
  }
  function unitLocLabel(bookKey, unitId, ch) {
    var unit = getUnit(bookKey, unitId);
    if (!unit) return "";
    if (BOOKS[bookKey].kind === "flat") return unit.name;
    return unit.name + (ch ? " " + ch + ". Bölüm" : "");
  }

  // Returns {prev: {url,label}|null, next: {url,label}|null} for the reader's
  // footer navigation: sûre-to-sûre (Kur'an), mezmur-to-mezmur (Zebur),
  // bölüm-to-bölüm within a book and across book boundaries (Tevrat/İncil).
  function getAdjacent(bookKey, unitId, ch) {
    var book = BOOKS[bookKey];
    var units = getUnits(bookKey);
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

  // ---------- Router ----------
  var root = document.getElementById("app");
  function readUrl(book, unit, ch, n) {
    var parts = ["#/read", book, unit];
    if (ch) parts.push(ch);
    else if (n) parts.push("");
    if (n) parts.push(n);
    return parts.join("/");
  }
  function route() {
    var raw = location.hash.replace(/^#\/?/, "");
    var parts = raw === "" ? [] : raw.split("/");
    window.scrollTo(0, 0);
    if (parts.length === 0) return renderHome();
    if (parts[0] === "list") return renderList(parts[1]);
    if (parts[0] === "chapters") return renderChapters(parts[1], parts[2]);
    if (parts[0] === "read") return renderReader(parts[1], parts[2], parts[3], parts[4]);
    if (parts[0] === "search") return renderSearch(decodeURIComponent(parts[1] || ""));
    if (parts[0] === "records") return renderRecords();
    if (parts[0] === "settings") return renderSettings();
    renderHome();
  }
  window.addEventListener("hashchange", route);

  function go(hash) { location.hash = hash; }

  function topbar(title, opts) {
    opts = opts || {};
    var el = document.createElement("div");
    el.className = "topbar";
    var back = "";
    if (opts.back) {
      back = '<button class="icon-btn" data-back>' + ICON.back + "</button>";
    }
    el.innerHTML = back + "<h1>" + title + "</h1>" + (opts.right || "");
    if (opts.back) {
      el.querySelector("[data-back]").addEventListener("click", function () {
        history.back();
      });
    }
    return el;
  }

  function tabbar(active) {
    var bar = el("div", "tabbar");
    var items = [
      { key: "home", label: "Ana Sayfa", icon: ICON.home, hash: "#/" },
      { key: "records", label: "Kayıtlar", icon: ICON.bookmark, hash: "#/records" },
      { key: "search", label: "Ara", icon: ICON.search, hash: "#/search" },
      { key: "settings", label: "Ayarlar", icon: ICON.sliders, hash: "#/settings" }
    ];
    items.forEach(function (it) {
      var btn = el("button", "tab-item" + (it.key === active ? " active" : ""));
      btn.innerHTML = it.icon + "<span>" + it.label + "</span>";
      btn.addEventListener("click", function () { go(it.hash); });
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

    var header = el("div", "home-header");
    header.innerHTML = '<span class="logo">' + BRAND_LOGO + "</span><h1>Kutsal Kitaplar</h1>";
    screen.appendChild(header);

    if (state.history.length > 0) {
      var last = state.history[0];
      var badgeNum = last.ch || last.unit;
      var pct = last.total ? Math.round(((last.vi || 0) + 1) / last.total * 100) : 0;
      var card = el("div", "resume-card");
      card.innerHTML =
        '<div class="resume-badge">' + escapeHtml(String(badgeNum)) + "</div>" +
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
        '<p class="name">' + b.label + "</p>";
      card.addEventListener("click", function () { go("#/list/" + key); });
      grid.appendChild(card);
    });
    screen.appendChild(grid);

    var vod = getVerseOfDay();
    if (vod) {
      var vCard = el("div", "verse-day-card");
      vCard.innerHTML =
        '<p class="greeting">- ' + greeting() + "</p>" +
        '<p class="quote">&ldquo;' + escapeHtml(vod.verse.t) + '&rdquo;</p>' +
        '<div class="ref">Kur\'an ' + vod.surah.id + ":" + vod.verse.n + " " + ICON.chevRight + "</div>";
      vCard.querySelector(".ref").addEventListener("click", function () {
        go(readUrl("kuran", vod.surah.id, null, vod.verse.n));
      });
      screen.appendChild(vCard);
    }

    screen.appendChild(el("div", "home-footer", "Yapım ve Derleme Murat BOSTANCI"));

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

  // ---------- List screen (units of a book) ----------
  function renderList(bookKey) {
    var book = BOOKS[bookKey];
    root.innerHTML = "";
    root.appendChild(topbar(book.label, { back: true }));
    var screen = el("div", "screen");
    var units = getUnits(bookKey);
    units.forEach(function (u) {
      var row = el("div", "list-row");
      var sub = book.kind === "nested" ? u.chapters.length + " bölüm" : (u.verses ? u.verses.length + " ayet" : "");
      row.innerHTML =
        '<div><div class="name">' + u.id + ". " + u.name + '</div><div class="sub">' + sub + "</div></div>" +
        '<div class="chevron">' + ICON.chevron + "</div>";
      row.addEventListener("click", function () {
        if (book.kind === "flat") go(readUrl(bookKey, u.id));
        else go("#/chapters/" + bookKey + "/" + u.id);
      });
      screen.appendChild(row);
    });
    root.appendChild(screen);
  }

  // ---------- Chapters screen (for nested books) ----------
  function renderChapters(bookKey, unitId) {
    var book = BOOKS[bookKey];
    var unit = getUnit(bookKey, unitId);
    root.innerHTML = "";
    root.appendChild(topbar(unit.name, { back: true }));
    var screen = el("div", "screen");
    unit.chapters.forEach(function (c) {
      var row = el("div", "list-row");
      row.innerHTML =
        '<div><div class="name">' + c.ch + ". Bölüm</div><div class=\"sub\">" + c.verses.length + " ayet</div></div>" +
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
    var bookmarked = isBookmarked(bookKey, unitId, ch);
    header.innerHTML =
      '<button class="icon-btn" data-back>' + ICON.back + "</button>" +
      '<div class="title">' + title + "</div>" +
      '<div class="font-controls">' +
      '<button class="icon-btn" data-bookmark>' + (bookmarked ? ICON.bookmarkFill : ICON.bookmark) + "</button>" +
      '<button class="icon-btn" data-dec>' + ICON.minus + "</button>" +
      '<button class="icon-btn" data-inc>' + ICON.plus + "</button>" +
      "</div>";
    header.querySelector("[data-back]").addEventListener("click", function () { history.back(); });
    header.querySelector("[data-dec]").addEventListener("click", function () { changeFont(-1); });
    header.querySelector("[data-inc]").addEventListener("click", function () { changeFont(1); });
    header.querySelector("[data-bookmark]").addEventListener("click", function (e) {
      toggleBookmark({ book: bookKey, unit: unitId, ch: ch || null, loc: title });
      var nowOn = isBookmarked(bookKey, unitId, ch);
      e.currentTarget.innerHTML = nowOn ? ICON.bookmarkFill : ICON.bookmark;
    });
    root.appendChild(header);

    var block = el("div", "verse-block");
    block.style.setProperty("--reader-size", state.fontSize + "px");
    chapter.verses.forEach(function (v, vi) {
      var vEl = el("div", "verse");
      vEl.dataset.vi = vi;
      vEl.dataset.n = v.n;
      var fav = isFav(bookKey, unitId, ch || null, v.n);
      if (fav) vEl.classList.add("fav");
      vEl.innerHTML =
        '<div class="num">' + v.n + "</div>" +
        '<div class="text">' + escapeHtml(v.t) + "</div>";
      vEl.addEventListener("click", function () {
        toggleFav({
          book: bookKey, unit: unitId, ch: ch || null, n: v.n,
          loc: title + ", " + v.n + ". ayet", snippet: v.t.slice(0, 90)
        });
        vEl.classList.toggle("fav");
      });
      if (String(v.n) === String(scrollToVerse)) vEl.id = "target-verse";
      block.appendChild(vEl);
    });
    root.appendChild(block);

    var adj = getAdjacent(bookKey, unitId, ch);
    var nav = el("div", "reader-nav");
    if (adj.prev) {
      var pBtn = el("button", "nav-btn prev");
      pBtn.innerHTML = ICON.chevLeft + '<span class="lbl"><small>Önceki</small><span>' + escapeHtml(adj.prev.label) + "</span></span>";
      pBtn.addEventListener("click", function () { go(adj.prev.url); });
      nav.appendChild(pBtn);
    } else {
      nav.appendChild(el("div", "nav-spacer"));
    }
    if (adj.next) {
      var nBtn = el("button", "nav-btn next");
      nBtn.innerHTML = '<span class="lbl"><small>Sonraki</small><span>' + escapeHtml(adj.next.label) + "</span></span>" + ICON.chevRight;
      nBtn.addEventListener("click", function () { go(adj.next.url); });
      nav.appendChild(nBtn);
    } else {
      nav.appendChild(el("div", "nav-spacer"));
    }
    root.appendChild(nav);

    function changeFont(delta) {
      state.fontSize = Math.max(13, Math.min(24, state.fontSize + delta));
      localStorage.setItem(LS_SIZE, state.fontSize);
      block.style.setProperty("--reader-size", state.fontSize + "px");
    }

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
    screen.appendChild(el("div", "home-header", "<h1>Ara</h1>"));
    var searchBar = el("div", "search-bar");
    searchBar.innerHTML = ICON.search + '<input type="text" placeholder="Ayet veya kelime ara..." />';
    var input = searchBar.querySelector("input");
    input.value = query || "";
    screen.appendChild(searchBar);
    var results = el("div", "");
    screen.appendChild(results);
    root.appendChild(screen);
    root.appendChild(tabbar("search"));
    setTimeout(function () { input.focus(); }, 50);

    function doSearch(q) {
      results.innerHTML = "";
      if (!q || q.trim().length < 2) {
        results.innerHTML = '<div class="empty-state">En az 2 karakter girin.</div>';
        return;
      }
      var found = runSearch(q.trim());
      if (found.length === 0) {
        results.innerHTML = '<div class="empty-state">Sonuç bulunamadı.</div>';
        return;
      }
      found.slice(0, 150).forEach(function (r) {
        var row = el("div", "search-result");
        row.innerHTML =
          '<div class="loc">' + BOOKS[r.book].label + " &middot; " + r.loc + "</div>" +
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

  function runSearch(q) {
    var needle = turkishLower(q);
    var out = [];
    BOOK_ORDER.forEach(function (bookKey) {
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
                out.push({ book: bookKey, unit: u.id, ch: c.ch, n: v.n, loc: u.name + " " + c.ch + ":" + v.n, snippet: v.t });
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
    screen.appendChild(el("div", "home-header", "<h1>Kayıtlar</h1>"));

    var empty = state.bookmarks.length === 0 && state.favorites.length === 0 && state.history.length === 0;
    if (empty) {
      screen.appendChild(el("div", "empty-state", ICON.bookmark + "<div>Henüz kayıt yok.<br>Bir bölümü yer imine ekleyin ya da bir ayete dokunun.</div>"));
    } else {
      if (state.bookmarks.length) {
        var sec1 = el("div", "records-section");
        sec1.appendChild(el("h2", "", "Yer İmleri"));
        state.bookmarks.forEach(function (b) {
          var row = el("div", "list-row");
          row.innerHTML =
            '<div><div class="name">' + BOOKS[b.book].label + '</div><div class="sub">' + escapeHtml(b.loc) + "</div></div>" +
            '<div class="chevron">' + ICON.chevron + "</div>";
          row.addEventListener("click", function () { go(readUrl(b.book, b.unit, b.ch)); });
          sec1.appendChild(row);
        });
        screen.appendChild(sec1);
      }
      if (state.favorites.length) {
        var sec2 = el("div", "records-section");
        sec2.appendChild(el("h2", "", "Favori Ayetler"));
        state.favorites.forEach(function (f) {
          var row = el("div", "search-result");
          row.innerHTML =
            '<div class="loc">' + BOOKS[f.book].label + " &middot; " + escapeHtml(f.loc) + "</div>" +
            '<div class="snippet">' + escapeHtml(f.snippet) + "</div>";
          row.addEventListener("click", function () { go(readUrl(f.book, f.unit, f.ch, f.n)); });
          sec2.appendChild(row);
        });
        screen.appendChild(sec2);
      }
      if (state.history.length) {
        var sec3 = el("div", "records-section");
        sec3.appendChild(el("h2", "", "Son Okunanlar"));
        state.history.forEach(function (h) {
          var row = el("div", "list-row");
          row.innerHTML =
            '<div><div class="name">' + BOOKS[h.book].label + "</div><div class=\"sub\">" + escapeHtml(resumeLabel(h)) + "</div></div>" +
            '<div class="chevron">' + ICON.chevron + "</div>";
          row.addEventListener("click", function () { go(readUrl(h.book, h.unit, h.ch, h.n)); });
          sec3.appendChild(row);
        });
        screen.appendChild(sec3);
      }
    }
    root.appendChild(screen);
    root.appendChild(tabbar("records"));
  }

  // ---------- Settings ----------
  function renderSettings() {
    root.innerHTML = "";
    var screen = el("div", "screen");
    screen.appendChild(el("div", "home-header", "<h1>Ayarlar</h1>"));

    var g1 = el("div", "settings-group");
    g1.appendChild(el("h2", "", "Yazı Tipi"));
    Object.keys(FONT_OPTIONS).forEach(function (key) {
      var opt = FONT_OPTIONS[key];
      var row = el("div", "font-option" + (state.fontFamily === key ? " selected" : ""));
      row.innerHTML = '<span class="fname" style="font-family:' + opt.css + '">' + opt.label + '</span><span class="fcheck">' + ICON.check + "</span>";
      row.addEventListener("click", function () {
        state.fontFamily = key;
        localStorage.setItem(LS_FONT_FAMILY, key);
        applySettings();
        renderSettings();
      });
      g1.appendChild(row);
    });
    screen.appendChild(g1);

    var g2 = el("div", "settings-group");
    g2.appendChild(el("h2", "", "Yazı Stili"));
    var seg = el("div", "segmented");
    Object.keys(STYLE_OPTIONS).forEach(function (key) {
      var btn = el("button", state.fontStyle === key ? "active" : "", STYLE_OPTIONS[key].label);
      btn.addEventListener("click", function () {
        state.fontStyle = key;
        localStorage.setItem(LS_FONT_STYLE, key);
        applySettings();
        renderSettings();
      });
      seg.appendChild(btn);
    });
    g2.appendChild(seg);
    screen.appendChild(g2);

    var g3 = el("div", "settings-group");
    g3.appendChild(el("h2", "", "Yazı Boyutu"));
    var stepper = el("div", "stepper");
    stepper.innerHTML =
      '<span>Okuma ekranı yazı boyutu</span>' +
      '<div class="stepper-btns">' +
      '<button class="icon-btn" data-dec>' + ICON.minus + "</button>" +
      '<span class="val">' + state.fontSize + "</span>" +
      '<button class="icon-btn" data-inc>' + ICON.plus + "</button>" +
      "</div>";
    stepper.querySelector("[data-dec]").addEventListener("click", function () {
      state.fontSize = Math.max(13, state.fontSize - 1);
      localStorage.setItem(LS_SIZE, state.fontSize);
      renderSettings();
    });
    stepper.querySelector("[data-inc]").addEventListener("click", function () {
      state.fontSize = Math.min(24, state.fontSize + 1);
      localStorage.setItem(LS_SIZE, state.fontSize);
      renderSettings();
    });
    g3.appendChild(stepper);
    screen.appendChild(g3);

    var g4 = el("div", "settings-group");
    g4.appendChild(el("h2", "", "Tema"));
    var themeSeg = el("div", "segmented");
    var themes = { sistem: "Sistem", light: "Açık", dark: "Koyu" };
    Object.keys(themes).forEach(function (key) {
      var btn = el("button", state.theme === key ? "active" : "", themes[key]);
      btn.addEventListener("click", function () {
        state.theme = key;
        localStorage.setItem(LS_THEME, key);
        applySettings();
        renderSettings();
      });
      themeSeg.appendChild(btn);
    });
    g4.appendChild(themeSeg);
    screen.appendChild(g4);

    root.appendChild(screen);
    root.appendChild(tabbar("settings"));
  }

  // ---------- Utils ----------
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function highlight(text, q) {
    var safe = escapeHtml(text);
    var needle = turkishLower(q).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    try {
      var re = new RegExp("(" + needle + ")", "i");
      return safe.replace(re, "<mark>$1</mark>");
    } catch (e) { return safe; }
  }
  function turkishLower(s) {
    return String(s)
      .replace(/İ/g, "i").replace(/I/g, "ı")
      .toLowerCase();
  }
  function debounce(fn, ms) {
    var t;
    return function () {
      var args = arguments, ctx = this;
      clearTimeout(t);
      t = setTimeout(function () { fn.apply(ctx, args); }, ms);
    };
  }

  route();
})();
