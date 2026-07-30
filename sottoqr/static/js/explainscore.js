/* ============================================================================
   explainscore.js  —  SottoQR "Explainable Integrity Score" (ADD-ONLY)

   Turns the final score into a transparent, signal-by-signal breakdown:
   each of the 7 forensic signals gets a bar, a suspicion value, a status
   pill, a plain-language "what this checks", and how many points it removed
   from 100. All data already exists in your /api/verify response — this only
   VISUALISES it. Judges love Explainable AI.

   INTEGRATION: add ONE line before </body> in templates/index.html:
       <script src="/static/js/explainscore.js"></script>
   Nothing else. It injects its own styles (using your existing CSS variables,
   so it matches your design) and auto-wraps your renderResult(), so your
   main.js and CSS are never touched.
   ============================================================================ */
(function () {
  "use strict";

  // signal key in the /api/verify response  ->  label, icon, weight, what-it-checks
  // weights mirror forensics.py (W_ELA, W_EXIF, ...), so "points removed" is exact.
  var SIGNALS = [
    { key: "ela_score",        w: 0.12, icon: "\uD83D\uDD2C", bn: "ELA (এরর লেভেল)",        en: "ELA (Error Level)",   dbn: "রিকম্প্রেশন বা লোকাল এডিটের চিহ্ন",     den: "recompression / local edits" },
    { key: "exif_score",       w: 0.12, icon: "\uD83C\uDFF7\uFE0F", bn: "EXIF মেটাডেটা",    en: "EXIF Metadata",       dbn: "ক্যামেরা তথ্য মুছে ফেলা / এডিট টুল ট্যাগ", den: "stripped metadata / editor tags" },
    { key: "blur_score",       w: 0.18, icon: "\uD83C\uDF2B\uFE0F", bn: "ব্লার / শার্পনেস",  en: "Blur / Sharpness",    dbn: "ইচ্ছাকৃতভাবে ঝাপসা করে বিবরণ ঢাকা",     den: "blurred to obscure detail" },
    { key: "hist_score",       w: 0.15, icon: "\uD83D\uDCCA", bn: "হিস্টোগ্রাম",           en: "Histogram",           dbn: "ব্রাইটনেস / কন্ট্রাস্ট কারসাজি",         den: "brightness / contrast manipulation" },
    { key: "block_score",      w: 0.18, icon: "\uD83E\uDDF1", bn: "JPEG ব্লক আর্টিফ্যাক্ট",  en: "JPEG Blockiness",     dbn: "বারবার সেভ / স্ক্রিনশট রিকম্প্রেশন",     den: "re-compression / screenshot" },
    { key: "rotation_score",   w: 0.13, icon: "\uD83D\uDD04", bn: "রোটেশন / ক্রপ",         en: "Rotation / Crop",     dbn: "ঘুরিয়ে-কেটে এডিটের প্রান্তে ক্যানভাস ফিল", den: "rotate-and-crop canvas fill" },
    { key: "screenshot_score", w: 0.12, icon: "\uD83D\uDCF1", bn: "স্ক্রিনশট",             en: "Screenshot",          dbn: "স্ক্রিন রেজোলিউশনের সাথে হুবহু মিল",     den: "matches a screen resolution" }
  ];

  function lang() { return window.currentLang === "en" ? "en" : "bn"; }

  function status(v) {
    if (v < 30) return { cls: "ok",   bn: "\u2714 পরিষ্কার", en: "\u2714 Clean",     color: "var(--green)" };
    if (v < 60) return { cls: "warn", bn: "\u26A0 সন্দেহ",   en: "\u26A0 Suspicious", color: "var(--yellow)" };
    return              { cls: "bad",  bn: "\u2715 ঝুঁকি",    en: "\u2715 High risk",  color: "var(--red)" };
  }

  // Build the breakdown HTML for a /api/verify result object.
  window.renderScoreBreakdown = function (data) {
    var L = lang();
    var rows = SIGNALS.map(function (s) {
      var v = Math.round(Number(data[s.key] || 0));
      return { s: s, v: v, contrib: +(v * s.w).toFixed(1), st: status(v) };
    }).sort(function (a, b) { return b.contrib - a.contrib; }); // biggest drivers first

    var head = L === "bn" ? "স্কোর কেন? — প্রতিটি সিগনালের ব্যাখ্যা"
                          : "Why this score? — signal by signal";
    var hint = L === "bn" ? "সন্দেহ ০ = পরিষ্কার · ১০০ = ঝুঁকি · ডানে: স্কোর থেকে কত বিয়োগ হয়েছে"
                          : "suspicion 0 = clean · 100 = risk · right: points removed from the score";

    var html = '<div class="xscore"><div class="xscore-head">' + head +
               '</div><div class="xscore-hint">' + hint + "</div>";

    rows.forEach(function (r) {
      html +=
        '<div class="xrow">' +
          '<div class="xrow-top">' +
            '<span class="xname">' + r.s.icon + " " + (L === "bn" ? r.s.bn : r.s.en) + "</span>" +
            '<span class="xpill xpill-' + r.st.cls + '">' + (L === "bn" ? r.st.bn : r.st.en) + "</span>" +
          "</div>" +
          '<div class="xbar"><span class="xbar-fill" style="width:' + r.v + "%;background:" + r.st.color + ';"></span></div>' +
          '<div class="xrow-bot">' +
            '<span class="xdesc">' + (L === "bn" ? r.s.dbn : r.s.den) + "</span>" +
            '<span class="xnums">' + r.v + '<span class="xunit">/100</span> \u00B7 \u2212' + r.contrib + "</span>" +
          "</div>" +
        "</div>";
    });

    if (Number(data.phash_match_flag) === 1) {
      html += '<div class="xreuse">' +
        (L === "bn"
          ? "\uD83D\uDD01 এই ছবি আগে দেখা গেছে — পুনঃব্যবহৃত বা পুরনো ছবি (হার্ড ফ্ল্যাগ, স্কোর জোরপূর্বক কমানো হয়েছে)"
          : "\uD83D\uDD01 This image was seen before — reused/old image (hard flag; score forced down)") +
        "</div>";
    }
    return html + "</div>";
  };

  // ---- inject styles once (uses YOUR CSS variables, so it matches the site) ----
  function injectStyles() {
    if (document.getElementById("xscore-styles")) return;
    var css = ""
      + ".xscore{margin-top:20px;border-top:1px solid rgba(245,183,0,.18);padding-top:16px;}"
      + ".xscore-head{font-family:var(--font-display-en,'Anton');letter-spacing:.4px;font-size:1rem;color:var(--yellow);text-transform:uppercase;}"
      + ".xscore-hint{font-size:.72rem;opacity:.55;margin:2px 0 14px;}"
      + ".xrow{margin-bottom:13px;}"
      + ".xrow-top{display:flex;justify-content:space-between;align-items:center;gap:10px;}"
      + ".xname{font-size:.88rem;font-weight:700;color:var(--ink);}"
      + ".xpill{font-size:.66rem;font-weight:800;padding:2px 9px;border-radius:999px;white-space:nowrap;}"
      + ".xpill-ok{background:rgba(0,105,62,.22);color:#7fd9ae;border:1px solid rgba(0,105,62,.5);}"
      + ".xpill-warn{background:rgba(245,183,0,.16);color:var(--yellow);border:1px solid rgba(245,183,0,.5);}"
      + ".xpill-bad{background:rgba(214,0,28,.18);color:#ff8a8a;border:1px solid rgba(214,0,28,.5);}"
      + ".xbar{height:8px;border-radius:999px;background:#0f0f0f;border:1px solid rgba(255,255,255,.06);overflow:hidden;margin:6px 0 4px;}"
      + ".xbar-fill{display:block;height:100%;border-radius:999px;transition:width .5s ease;}"
      + ".xrow-bot{display:flex;justify-content:space-between;align-items:baseline;gap:10px;}"
      + ".xdesc{font-size:.76rem;opacity:.62;}"
      + ".xnums{font-family:var(--font-display-en,'Anton');font-size:1rem;color:var(--ink);white-space:nowrap;}"
      + ".xunit{font-size:.62rem;opacity:.5;}"
      + ".xreuse{margin-top:8px;font-size:.82rem;background:rgba(214,0,28,.14);border:1px solid rgba(214,0,28,.4);color:#ffb3b3;padding:9px 12px;border-radius:var(--radius,4px);}";
    var el = document.createElement("style");
    el.id = "xscore-styles";
    el.textContent = css;
    document.head.appendChild(el);
  }

  // ---- put the breakdown inside the existing result panel ----
  function inject(data) {
    var panel = document.getElementById("resultPanel");
    if (!panel) return;
    injectStyles();
    var box = document.getElementById("scoreBreakdown");
    if (!box) {
      box = document.createElement("div");
      box.id = "scoreBreakdown";
    }
    box.innerHTML = window.renderScoreBreakdown(data);
    // place it just before the download buttons if present, else at the end
    var actions = panel.querySelector(".cert-actions");
    if (actions) panel.insertBefore(box, actions);
    else panel.appendChild(box);
    // one-click court-ready PDF for this evidence
    if (actions && data && data.id != null && !actions.querySelector(".court-pdf-link")) {
      var a = document.createElement("a");
      a.className = "court-pdf-link";
      a.href = "/api/evidence/" + data.id + "/pdf";
      a.target = "_blank";
      a.textContent = lang() === "bn" ? "\u2696\uFE0F কোর্ট PDF" : "\u2696\uFE0F Court PDF";
      actions.appendChild(a);
    }
    window.__lastVerify = data;
  }

  // ---- wrap renderResult() with zero edits to main.js ----
  function hook() {
    if (typeof window.renderResult === "function" && !window.renderResult.__xwrapped) {
      var orig = window.renderResult;
      window.renderResult = function (data) {
        var out = orig.apply(this, arguments);
        try { inject(data); } catch (e) { /* never break the original result */ }
        return out;
      };
      window.renderResult.__xwrapped = true;
    }
  }
  hook();
  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", hook);

  // register bilingual labels for the two new nav links (main.js's I18N is global)
  try {
    if (typeof I18N !== "undefined") {
      I18N.navDashboard = I18N.navDashboard || { bn: "ড্যাশবোর্ড", en: "Dashboard" };
      I18N.navMemorial = I18N.navMemorial || { bn: "স্মৃতি প্রাচীর", en: "Memorial" };
      if (typeof applyLang === "function" && typeof currentLang !== "undefined") applyLang(currentLang);
    }
  } catch (e) {}

  // re-render breakdown in the new language when the user flips বাংলা/English
  document.addEventListener("click", function (e) {
    if (e.target.closest && e.target.closest(".lang-switch") && window.__lastVerify) {
      setTimeout(function () { inject(window.__lastVerify); }, 0);
    }
  });
})();
