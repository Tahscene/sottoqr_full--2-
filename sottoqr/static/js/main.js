/* ============================================================
   i18n
   Structure is deliberately a flat key->{lang: text} map so adding
   a 3rd/4th language later (e.g. Hindi, Arabic, French for an
   international jury) is just adding one more key per entry -
   no template restructuring needed.
   ============================================================ */
const I18N = {
  brandName:      { bn: "সত্যQR", en: "SottoQR" },
  navVerify:       { bn: "যাচাই করুন", en: "Verify" },
  navPortal:       { bn: "জাস্টিস ট্র্যাকার", en: "Justice Tracker" },
  navAbout:        { bn: "সমস্যা", en: "The Problem" },

  heroEyebrow:     { bn: "জুলাই গণঅভ্যুত্থান, ১-৩৬ জুলাই ২০২৪", en: "JULY UPRISING, 1-36 JULY 2024" },
  heroTitle1:      { bn: "সত্য যাচাই। ", en: "VERIFY THE TRUTH. " },
  heroTitleAccent: { bn: "ন্যায়বিচার ট্র্যাক।", en: "TRACK THE JUSTICE." },
  heroTagline:     { bn: "আসছে ফাল্গুনে আমরা কিন্তু দ্বিগুণ হব", en: "আসছে ফাল্গুনে আমরা কিন্তু দ্বিগুণ হব" },
  heroSub:         {
    bn: "জাতীয় সত্য যাচাই ও ন্যায়বিচার ট্র্যাকিং স্ট্যান্ডার্ড। কোনো ছবি বা ভিডিও আসল নাকি এডিট করা যাচাই করুন, আর ভুক্তভোগীর কেস কোথায় আটকে আছে দেখুন।",
    en: "A national truth-verification and justice-tracking standard. Check whether an image has been edited, and follow a victim's case from report to resolution.",
  },
  heroCta1:        { bn: "একটা ছবি যাচাই করুন", en: "Verify an Image" },
  heroCta2:        { bn: "জাস্টিস ট্র্যাকার দেখুন", en: "See the Justice Tracker" },

  marquee: {
    bn: "৩০ কোটি টাকা ক্ষতি • হাজারো ছবি ভাইরাল • কোনটা সত্যি যাচাই নেই • ন্যায়বিচার ট্র্যাক করার উপায় নেই • ডিজিটাল বিশ্বাসের কোনো জাতীয় মানদণ্ড নেই • ",
    en: "THOUSANDS OF IMAGES WENT VIRAL • NO WAY TO VERIFY WHAT'S REAL • NO WAY TO TRACK JUSTICE • NO NATIONAL STANDARD FOR DIGITAL TRUST • ",
  },

  problemEyebrow: { bn: "কেন সত্যQR", en: "WHY SOTTOQR" },
  problemTitle:   { bn: "তিনটা সমস্যা, একসাথে জড়িত", en: "Three Problems, One Root Cause" },
  problemDesc:    {
    bn: "জুলাই বিপ্লবের সময় এডিট করা, ভুয়া টাইমস্ট্যাম্প দেওয়া, আর ভুল প্রসঙ্গের ছবি সত্যিকারের প্রমাণের সাথে মিশে গিয়েছিল।",
    en: "During the July uprising, edited images, fake timestamps, and out-of-context photos got mixed in with real evidence, spreading faster than the truth could catch up.",
  },
  p1title: { bn: "যাচাই করার উপায় নেই", en: "No Way to Verify" },
  p1desc:  { bn: "কোনো ছবি আসল নাকি এডিট করা, জনমত তৈরি হওয়ার আগে যাচাই করার কোনো সহজ টুল নেই।", en: "No easy way to check if an image is authentic before it shapes public opinion." },
  p2title: { bn: "ন্যায়বিচার ট্র্যাক নেই", en: "No Way to Track Justice" },
  p2desc:  { bn: "কেস রিপোর্ট হওয়ার পর তদন্ত, ক্ষতিপূরণ কতদূর, কোনো স্বচ্ছ সিস্টেম নেই।", en: "No transparent system showing whether an investigation started or compensation ever arrived." },
  p3title: { bn: "জাতীয় মানদণ্ড নেই", en: "No National Standard" },
  p3desc:  { bn: "কোনো কিছুকে সরকারিভাবে \"verified\" চিহ্নিত করার কোনো official উপায় নেই।", en: "No official way to mark government content as verified, so even real announcements get doubted." },

  verifyEyebrow: { bn: "লেয়ার ১, ভেরিফিকেশন ইঞ্জিন", en: "LAYER 1, VERIFICATION ENGINE" },
  verifyTitle:   { bn: "SottoQR দিয়ে একটা ছবি যাচাই করুন", en: "Verify an Image with SottoQR" },
  verifyDesc:    { bn: "ছবি আপলোড করুন। ELA, EXIF, ব্লার, হিস্টোগ্রাম আর JPEG আর্টিফ্যাক্ট বিশ্লেষণ করে একটা Integrity Score আর সিল দেওয়া হবে।", en: "Upload an image. We run ELA, EXIF, blur, histogram, and JPEG-artifact analysis and return an Integrity Score with a cryptographic seal." },
  dropzoneMain:  { bn: "ছবি টেনে আনুন অথবা ক্লিক করুন", en: "Drag an image here or click to browse" },
  roleLabel:     { bn: "আপনি কে হিসেবে জমা দিচ্ছেন?", en: "Submitting as?" },
  dropzoneSub:   { bn: "JPG বা PNG, সর্বোচ্চ ১০MB", en: "JPG or PNG, up to 10MB" },
  resultPlaceholder: { bn: "যাচাইয়ের ফলাফল এখানে দেখা যাবে।", en: "Verification results will appear here." },
  analyzing:     { bn: "বিশ্লেষণ চলছে...", en: "Analyzing..." },
  uploading:     { bn: "আপলোড হচ্ছে", en: "Uploading" },
  fileTooLarge:  { bn: "ফাইল সাইজ 10MB-এর বেশি, ছোট ফাইল বেছে নিন।", en: "File is larger than 10MB, please choose a smaller file." },
  retryUpload:   { bn: "আবার চেষ্টা করুন", en: "Retry" },
  scoreLabel:    { bn: "ইন্টেগ্রিটি স্কোর", en: "Integrity Score" },
  reasonsLabel:  { bn: "কারণ", en: "Signals detected" },
  downloadCert:  { bn: "সার্টিফিকেট ডাউনলোড", en: "Download Certificate" },
  downloadWatermarked: { bn: "যাচাইকৃত ছবি ডাউনলোড", en: "Download Verified Image" },
  downloadManifest: { bn: "অফলাইন ভেরিফাই ফাইল", en: "Offline Verify File" },
  viewQr:        { bn: "QR সিল দেখুন", en: "View QR Seal" },
  errorMsg:      { bn: "সার্ভারের সাথে সংযোগ করা যায়নি, ব্যাকএন্ড চালু আছে কিনা দেখুন।", en: "Could not reach the server, check that the backend is running." },

  portalEyebrow: { bn: "লেয়ার ২, জাস্টিস ট্র্যাকার", en: "LAYER 2, JUSTICE TRACKER" },
  portalTitle:   { bn: "পাবলিক ট্রান্সপারেন্সি পোর্টাল", en: "Public Transparency Portal" },
  portalDesc:    { bn: "প্রতিটা ভুক্তভোগীর কেস রিপোর্ট থেকে চূড়ান্ত সমাধান পর্যন্ত ট্র্যাক করা হয়, নাম বা পরিচয় ছাড়াই।", en: "Every case is tracked from report to final resolution, without exposing victim identity." },
  portalDisclaimer: { bn: "এই প্রোটোটাইপে স্ট্যাটাস আপডেট সংশ্লিষ্ট কর্তৃপক্ষ ম্যানুয়ালি দেন। ভবিষ্যতে সরকারি সিস্টেমের সাথে সরাসরি API সংযোগে এই আপডেট স্বয়ংক্রিয়ভাবে সিঙ্ক হবে।", en: "In this prototype, status updates are entered manually by the relevant authority. In production, these would sync automatically through secure APIs with government systems." },
  noCases:       { bn: "এখনো কোনো পাবলিক কেস নেই। ব্যাকএন্ড API চালু করলে এখানে দেখা যাবে।", en: "No public cases yet. Cases will appear here once the backend API is running." },

  reportTitle:      { bn: "একটা ঘটনা রিপোর্ট করুন", en: "Report an Incident" },
  reportDesc:       { bn: "নাম বা পরিচয় দেওয়ার দরকার নেই। রিপোর্ট Admin review-এর পর পাবলিক পোর্টালে দেখা যাবে।", en: "No name or identity needed. Your report goes to admin review before it appears on the public portal." },
  reportRefPh:      { bn: "একটা রেফারেন্স নাম্বার দিন (যেমন SQ-2026-0042)", en: "Give it a reference number (e.g. SQ-2026-0042)" },
  reportLocationPh: { bn: "ঘটনার স্থান", en: "Location of the incident" },
  reportSummaryPh:  { bn: "কী ঘটেছিল, সংক্ষেপে লিখুন", en: "Briefly describe what happened" },
  reportSubmit:     { bn: "রিপোর্ট পাঠান", en: "Submit Report" },
  reportSuccess:    { bn: "ধন্যবাদ। রিপোর্ট জমা হয়েছে, Admin review করবে।", en: "Thank you. Your report is submitted and pending admin review." },
  reportError:      { bn: "রিপোর্ট পাঠানো যায়নি, আবার চেষ্টা করুন।", en: "Could not submit the report, please try again." },

  footerSlogan:  { bn: "আসছে ফাল্গুনে আমরা কিন্তু দ্বিগুণ হব", en: "আসছে ফাল্গুনে আমরা কিন্তু দ্বিগুণ হব" },
  footerNote:    { bn: "জুলাই গণঅভ্যুত্থান, ২০২৪-এর স্মরণে নির্মিত। হ্যাকাথন প্রোটোটাইপ।", en: "Built in memory of the July Uprising, 2024. Hackathon prototype." },

  navTimeline: { bn: "টাইমলাইন", en: "Timeline" },
  navArchive: { bn: "আর্কাইভ", en: "Archive" },
  navAboutUs: { bn: "আমাদের সম্পর্কে", en: "About Us" },
  julyBtn: { bn: "জুলাই ক্যালেন্ডার", en: "July Calendar" },
  tlKicker: { bn: "টাইমলাইন", en: "Timeline" },
  tlTitle: { bn: "৩৬ দিনের পথরেখা", en: "The 36-day path" },
  tlDesc: { bn: "শুরু থেকে পতন, প্রতিটি দিন একটি করে কার্ডে। মাউস দিয়ে টেনে ডান থেকে বাঁয়ে সরালে পরের দিনগুলো আসবে।", en: "From the spark to the fall, one card per day. Drag with the mouse, right to left, to move through the days." },
  tlHint: { bn: "টেনে সরান, ডান থেকে বাঁ", en: "Drag to move, right to left" },
  tlMore: { bn: "বিস্তারিত →", en: "Details →" },
  arKicker: { bn: "যাচাই করা আর্কাইভ", en: "Verified archive" },
  arTitle: { bn: "কবে, কোথায়, কী ঘটেছিল", en: "When, where, what happened" },
  arDesc: { bn: "জুলাই বিপ্লবের যাচাই করা ঘটনার সংগ্রহ, প্রতিটি এন্ট্রির সাথে স্থান, তারিখ আর সূত্র। খুঁজুন বা ফিল্টার করুন।", en: "A collection of verified events from the July uprising, each with a place, a date and a source. Search or filter." },
  arSearchPh: { bn: "ঘটনা, স্থান বা তারিখ খুঁজুন", en: "Search an event, place or date" },
  arAll: { bn: "সব", en: "All" },
  arMartyr: { bn: "শহীদ", en: "Martyrdom" },
  arTurning: { bn: "মোড়", en: "Turning point" },
  arAttack: { bn: "হামলা", en: "Attack" },
  arEmpty: { bn: "এই খোঁজে কিছু পাওয়া যায়নি।", en: "Nothing matched that search." },
  arVerified: { bn: "যাচাইকৃত", en: "Verified" },
  arSource: { bn: "সূত্র", en: "Source" },
  abKicker: { bn: "আমাদের সম্পর্কে", en: "About us" },
  abTitle: { bn: "যে দল সত্যQR বানিয়েছে", en: "The team behind SottoQR" },
  abDesc: { bn: "জুলাই গণঅভ্যুত্থান ২০২৪-এর স্মরণে, সত্য যাচাই আর ন্যায়বিচার ট্র্যাকিংয়ের একটি প্রকল্প।", en: "A truth-verification and justice-tracking project, built in memory of the July uprising of 2024." },
  abLeadTag: { bn: "টিম লিড", en: "TEAM LEAD" },
  abLead: { bn: "দলনেতা, Team Leader", en: "Team Leader" },
  abMember: { bn: "সদস্য, Member", en: "Member" },
  calTitle: { bn: "জুলাই বিপ্লব", en: "JULY UPRISING" },
  calSub: { bn: "১ থেকে ৩৬ জুলাই ২০২৪", en: "1 TO 36 JULY 2024" },
  dayPrev: { bn: "◀ আগের দিন", en: "◀ Prev day" },
  dayNext: { bn: "পরের দিন ▶", en: "Next day ▶" },
  bMartyr: { bn: "শহীদ", en: "Martyrdom" },
  bTurning: { bn: "মোড়", en: "Turning point" },
  bAttack: { bn: "হামলা", en: "Attack" },
  bProtest: { bn: "আন্দোলন", en: "Protest" },
  bFall: { bn: "পতন", en: "The fall" },
};

const STATUS_STEPS_KEY = "Report,Investigation,Medical Support,Compensation,Final Resolution".split(",");
const STATUS_LABELS = {
  bn: ["রিপোর্ট", "তদন্ত", "চিকিৎসা সহায়তা", "ক্ষতিপূরণ", "চূড়ান্ত সমাধান"],
  en: ["Report", "Investigation", "Medical Support", "Compensation", "Final Resolution"],
};

let currentLang = "bn";

function applyLang(lang) {
  currentLang = lang;
  document.documentElement.setAttribute("lang-mode", lang);
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (I18N[key]) el.textContent = I18N[key][lang] || I18N[key].en;
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (I18N[key]) el.placeholder = I18N[key][lang] || I18N[key].en;
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const key = el.getAttribute("data-i18n-ph");
    if (I18N[key]) el.placeholder = I18N[key][lang] || I18N[key].en;
  });
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  renderCases(window.__lastCases || []);
  if (typeof renderCalendar === "function") renderCalendar();
  if (typeof renderTimeline === "function") renderTimeline();
  if (typeof renderArchive === "function") renderArchive();
  if (typeof dayModal !== "undefined" && dayModal.classList.contains("open")) fillDay(currentDay);
}

document.querySelectorAll(".lang-switch button").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

/* ============================================================
   Verify flow
   ============================================================ */
const API_BASE = window.location.origin.startsWith("file") ? "http://localhost:8000" : "";

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const resultPanel = document.getElementById("resultPanel");

["dragenter", "dragover"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.add("dragover"); })
);
["dragleave", "drop"].forEach((evt) =>
  dropzone.addEventListener(evt, (e) => { e.preventDefault(); dropzone.classList.remove("dragover"); })
);
dropzone.addEventListener("click", () => fileInput.click());
dropzone.addEventListener("drop", (e) => {
  const file = e.dataTransfer.files[0];
  if (file) handleFile(file);
});
fileInput.addEventListener("change", (e) => {
  if (e.target.files[0]) handleFile(e.target.files[0]);
});

const MAX_UPLOAD_MB = 10;
let lastFailedFile = null;

async function handleFile(file) {
  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    resultPanel.innerHTML = `<div class="placeholder-msg">⚠ ${I18N.fileTooLarge[currentLang]}</div>`;
    return;
  }

  resultPanel.innerHTML = `<div class="placeholder-msg"><span class="spinner"></span> <span id="uploadProgressText">${I18N.analyzing[currentLang]}</span></div>`;
  lastFailedFile = file;

  const formData = new FormData();
  formData.append("file", file);

  // XHR instead of fetch so we can show real upload progress on slow connections
  const roleSelect = document.getElementById("uploaderRole");
  const role = roleSelect ? roleSelect.value : "Public";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", `${API_BASE}/api/verify?uploader_role=${encodeURIComponent(role)}`);

  xhr.upload.addEventListener("progress", (e) => {
    if (e.lengthComputable) {
      const pct = Math.round((e.loaded / e.total) * 100);
      const label = document.getElementById("uploadProgressText");
      if (label) label.textContent = `${I18N.uploading[currentLang]} ${pct}%`;
    }
  });

  xhr.onload = () => {
    if (xhr.status >= 200 && xhr.status < 300) {
      lastFailedFile = null;
      renderResult(JSON.parse(xhr.responseText));
    } else {
      showUploadError();
    }
  };
  xhr.onerror = () => showUploadError();
  xhr.ontimeout = () => showUploadError();
  xhr.timeout = 60000; // 60s - generous for slow mobile connections

  xhr.send(formData);
}

function showUploadError() {
  resultPanel.innerHTML = `
    <div class="placeholder-msg">⚠ ${I18N.errorMsg[currentLang]}</div>
    <button class="btn btn-outline" id="retryUploadBtn" style="margin-top:10px;">${I18N.retryUpload[currentLang]}</button>
  `;
  document.getElementById("retryUploadBtn").addEventListener("click", () => {
    if (lastFailedFile) handleFile(lastFailedFile);
  });
}

function verdictClass(verdict) {
  if (verdict === "Verified Authentic") return "verdict-authentic";
  if (verdict === "Needs Review") return "verdict-review";
  return "verdict-manipulated";
}

function renderResult(data) {
  let reasons = [];
  try { reasons = JSON.parse(data.reasons || "[]"); } catch (e) {}

  const reasonsHtml = reasons.length
    ? `<ul class="reasons-list">${reasons.map((r) => `<li>${r}</li>`).join("")}</ul>`
    : `<p class="placeholder-msg">-</p>`;

  resultPanel.innerHTML = `
    <div class="gauge-wrap">
      <div class="gauge"><span class="gauge-value">${Math.round(data.integrity_score)}</span></div>
      <div>
        <div style="font-size:0.78rem; opacity:0.6; margin-bottom:4px;">${I18N.scoreLabel[currentLang]}</div>
        <span class="verdict-badge ${verdictClass(data.verdict)}">${data.verdict}</span>
      </div>
    </div>
    <div style="margin-top:16px; font-size:0.85rem; font-weight:700; opacity:0.7;">${I18N.reasonsLabel[currentLang]}</div>
    ${reasonsHtml}
    <div class="cert-actions">
      ${data.watermarked_url ? `<a href="${API_BASE}${data.watermarked_url}" target="_blank">${I18N.downloadWatermarked[currentLang]}</a>` : ""}
      ${data.certificate_url ? `<a href="${API_BASE}${data.certificate_url}" target="_blank">${I18N.downloadCert[currentLang]}</a>` : ""}
      ${data.qr_url ? `<a href="${API_BASE}${data.qr_url}" target="_blank">${I18N.viewQr[currentLang]}</a>` : ""}
      ${data.manifest_url ? `<a href="${API_BASE}${data.manifest_url}" download="sottoqr_manifest_${data.id}.json">${I18N.downloadManifest[currentLang]}</a>` : ""}
    </div>
  `;
}

/* ============================================================
   Justice tracker
   ============================================================ */
const caseGrid = document.getElementById("caseGrid");

async function loadCases() {
  try {
    const res = await fetch(`${API_BASE}/api/cases`);
    if (!res.ok) throw new Error("failed");
    const cases = await res.json();
    window.__lastCases = cases;
    renderCases(cases);
  } catch (err) {
    renderCases([]);
  }
}

const STAGE_ICONS_DONE = "🟢";
const STAGE_ICON_CURRENT = "🟡";
const STAGE_ICON_PENDING = "⚪";
const STAGE_ICON_FINAL = "⚖️";

function renderCases(cases) {
  if (!cases || cases.length === 0) {
    caseGrid.innerHTML = `<p class="placeholder-msg">${I18N.noCases[currentLang]}</p>`;
    return;
  }
  caseGrid.innerHTML = cases.map((c) => {
    const stepIdx = STATUS_STEPS_KEY.indexOf(c.status);
    const labels = STATUS_LABELS[currentLang];

    const rows = STATUS_STEPS_KEY.map((s, i) => {
      const isLast = i === STATUS_STEPS_KEY.length - 1;
      let rowCls = "timeline-row pending";
      let icon = isLast ? STAGE_ICON_FINAL : STAGE_ICON_PENDING;
      if (i < stepIdx) { rowCls = "timeline-row done"; icon = isLast ? STAGE_ICON_FINAL : STAGE_ICONS_DONE; }
      else if (i === stepIdx) { rowCls = "timeline-row current"; icon = isLast ? STAGE_ICON_FINAL : STAGE_ICON_CURRENT; }
      return `<div class="${rowCls}"><span class="timeline-icon">${icon}</span><span class="timeline-label">${labels[i]}</span></div>`;
    }).join("");

    const agencyNote = c.updated_by_agency
      ? `<div class="case-agency-note">${currentLang === "bn" ? "সর্বশেষ আপডেট" : "Last updated by"}: ${c.updated_by_agency}</div>`
      : "";

    return `
      <div class="case-card">
        <div class="ref">${c.case_reference}</div>
        <h3>${c.location || (currentLang === "bn" ? "অবস্থান অজানা" : "Location unknown")}</h3>
        <p style="font-size:0.88rem; opacity:0.75;">${c.incident_summary || ""}</p>
        <div class="case-timeline">${rows}</div>
        ${agencyNote}
      </div>
    `;
  }).join("");
}

/* init moved to end of file, after July calendar/timeline/archive data is defined */

/* ============================================================
   Public incident report form
   ============================================================ */
const reportForm = document.getElementById("reportForm");
const reportMsg = document.getElementById("reportMsg");

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    location: document.getElementById("reportLocation").value.trim() || null,
    incident_summary: document.getElementById("reportSummary").value.trim() || null,
    is_public: false,
  };
  try {
    const res = await fetch(`${API_BASE}/api/cases`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.detail || "failed");
    }
    const data = await res.json();
    const refLine = currentLang === "bn"
      ? `আপনার রেফারেন্স নাম্বার: <strong>${data.case_reference}</strong>`
      : `Your reference number: <strong>${data.case_reference}</strong>`;
    reportMsg.innerHTML = `<p style="color:#7fd9ae; margin-top:10px; font-size:0.9rem;">${I18N.reportSuccess[currentLang]}<br>${refLine}</p>`;
    reportForm.reset();
  } catch (err) {
    reportMsg.innerHTML = `<p style="color:#ff9a9a; margin-top:10px; font-size:0.9rem;">${I18N.reportError[currentLang]}</p>`;
  }
});

/* ============================================================
   July Interactive Calendar, Timeline, Archive
   ============================================================ */

function t(k) { return I18N[k] ? (I18N[k][currentLang] || I18N[k].en) : k; }

/* ============================================================
   i18n  (same flat key->{currentLang} pattern as the main site)
   ============================================================ */

/* ============================================================
   The data: July 1 (=1) … August 5 (=36).  July 1 2024 was a Monday.
   Dates & facts cross-checked against BSS (national news agency),
   Wikipedia, CNN, NPR and Amnesty International. Edit freely.
   tag: protest | attack | turning | killing | fall
   loc/src present => also shown as a verified Archive entry.
   ============================================================ */
const SPARK = {
  bn:{t:"স্ফুলিঙ্গ, ৫ জুন",x:"৫ জুন ২০২৪ হাইকোর্ট ২০১৮ সালের কোটা বাতিলের পরিপত্র অবৈধ ঘোষণা করে, ফলে সরকারি চাকরিতে ৩০% মুক্তিযোদ্ধা কোটা ফিরে আসে। এখান থেকেই আন্দোলনের জন্ম।"},
  en:{t:"The spark, 5 June",x:"On 5 June 2024 the High Court declared the 2018 abolition of quotas invalid, reinstating the 30% freedom-fighter quota in government jobs. This is where the movement was born."}
};
const JULY = [
 {d:1,dow:1,bd:"১ জুলাই ২০২৪",ed:"1 July 2024",tag:"protest",
  bn:{t:"ঢাকা বিশ্ববিদ্যালয়ে আন্দোলন পুনরায় শুরু",x:"ঈদের ২৪ দিন বিরতির পর শিক্ষার্থীরা আবার রাজপথে নামে। কোটা বাতিলে নির্বাহী আদেশের দাবিতে ৪ঠা জুলাই আলটিমেটাম দেওয়া হয়।"},
  en:{t:"Protests resume at Dhaka University",x:"After a 24-day pause for Eid, students return to the streets at Dhaka University and other campuses, demanding an executive order scrapping the quota. They set 4 July as a deadline."}},
 {d:2,dow:2,bd:"২ জুলাই ২০২৪",ed:"2 July 2024",tag:"protest",
  bn:{t:"শাহবাগ অবরোধ",x:"শিক্ষার্থীরা এক ঘণ্টা শাহবাগ মোড় অবরোধ করে; জাহাঙ্গীরনগর বিশ্ববিদ্যালয়ের শিক্ষার্থীরা ঢাকা-আরিচা মহাসড়ক অবরোধ করে।"},
  en:{t:"Shahbagh blockade begins",x:"Students block the Shahbagh intersection for an hour; Jahangirnagar University students block the Dhaka-Aricha highway."}},
 {d:3,dow:3,bd:"৩ জুলাই ২০২৪",ed:"3 July 2024",tag:"protest",
  bn:{t:"কেন্দ্রীয় গ্রন্থাগার থেকে মিছিল",x:"ঢাবির কেন্দ্রীয় গ্রন্থাগার থেকে মিছিল বের হয়ে দেড় ঘণ্টা শাহবাগ অবরোধ; অন্যান্য ক্যাম্পাসেও বিক্ষোভ চলে।"},
  en:{t:"Marches from the central library",x:"A procession from Dhaka University's central library blocks Shahbagh for ninety minutes; demonstrations continue at other campuses."}},
 {d:4,dow:4,bd:"৪ জুলাই ২০২৪",ed:"4 July 2024",tag:"protest",
  bn:{t:"আদালত রায় স্থগিত করেনি",x:"আপিল বিভাগ হাইকোর্টের রায় স্থগিত করেনি। এতে সারাদেশে শিক্ষার্থীরা আন্দোলন আরও জোরদার করে।"},
  en:{t:"Court declines to halt the verdict",x:"The Appellate Division does not stay the High Court ruling on the quota, and students intensify protests across the country."}},
 {d:5,dow:5,bd:"৫ জুলাই ২০২৪",ed:"5 July 2024",tag:"protest",
  bn:{t:"'বৈষম্যবিরোধী ছাত্র আন্দোলন' গঠন",x:"এই ব্যানারে সিট-ইন, সমাবেশ ও সড়ক অবরোধ; ৭ জুলাই থেকে ক্লাস-পরীক্ষা বর্জনের ডাক দেওয়া হয়।"},
  en:{t:"'Anti-Discrimination Student Movement' forms",x:"Under this banner students hold sit-ins, rallies and road blockades, and call for a class and exam boycott from 7 July."}},
 {d:6,dow:6,bd:"৬ জুলাই ২০২৪",ed:"6 July 2024",tag:"turning",loc_bn:"শাহবাগ, ঢাকা",loc_en:"Shahbagh, Dhaka",src:"BSS",
  bn:{t:"'বাংলা ব্লকেড' শুরু",x:"বাংলা ব্লকেডের প্রথম দিনে শাহবাগ, সায়েন্স ল্যাব, নীলক্ষেতসহ প্রধান মহাসড়ক ঘণ্টার পর ঘণ্টা অবরুদ্ধ; আইন করে কোটা বাতিলের এক দফা দাবি জানানো হয়।"},
  en:{t:"'Bangla Blockade' begins",x:"On day one of the Bangla Blockade, students shut Shahbagh, Science Lab, Nilkhet and major highways for hours, and announce a one-point demand: abolish quotas by law."}},
 {d:7,dow:0,bd:"৭ জুলাই ২০২৪",ed:"7 July 2024",tag:"protest",
  bn:{t:"বাংলা ব্লকেডে অচল ঢাকা",x:"অবরোধে রাজধানী স্থবির হয়ে পড়ে; সারাদেশে কলেজ-বিশ্ববিদ্যালয়ে ক্লাস-পরীক্ষা বর্জন চলে।"},
  en:{t:"Bangla Blockade halts Dhaka",x:"The blockade brings the capital to a standstill; classes and exams are boycotted at colleges and universities nationwide."}},
 {d:8,dow:1,bd:"৮ জুলাই ২০২৪",ed:"8 July 2024",tag:"protest",
  bn:{t:"অবরোধ ছড়িয়ে পড়ে",x:"ঢাকায় ১১টি পয়েন্ট, ৯টি বিশ্ববিদ্যালয়ে বিক্ষোভ, তিন জায়গায় রেলপথ ও ছয়টি মহাসড়ক অবরোধ।"},
  en:{t:"Blockades spread",x:"Students blockade 11 points in Dhaka, protest at nine universities, and block railways and six highways."}},
 {d:9,dow:2,bd:"৯ জুলাই ২০২৪",ed:"9 July 2024",tag:"protest",
  bn:{t:"ভোর থেকে সন্ধ্যা অবরোধ",x:"সারাদেশে সড়ক ও রেলপথে ভোর-থেকে-সন্ধ্যা অবরোধের ডাক দেয় বৈষম্যবিরোধী ছাত্র আন্দোলন।"},
  en:{t:"Dawn-to-dusk blockade",x:"The movement calls a dawn-to-dusk blockade of key roads and railways across the country."}},
 {d:10,dow:3,bd:"১০ জুলাই ২০২৪",ed:"10 July 2024",tag:"protest",
  bn:{t:"চার সপ্তাহের স্থিতাবস্থা",x:"আপিল বিভাগ কোটায় চার সপ্তাহের স্থিতাবস্থা দেয়। শিক্ষার্থীরা সব গ্রেডে সংস্কারের দাবিতে অটল থাকে।"},
  en:{t:"Court imposes a four-week status quo",x:"The Appellate Division puts a four-week status quo on the quota; students press their demand for reform across all grades."}},
 {d:11,dow:4,bd:"১১ জুলাই ২০২৪",ed:"11 July 2024",tag:"protest",
  bn:{t:"সরকার আন্দোলনকে 'বেআইনি' বলে",x:"মন্ত্রীরা বলেন শিক্ষার্থীরা 'সীমা ছাড়িয়ে যাচ্ছে'। পুলিশি বাধা সত্ত্বেও গুরুত্বপূর্ণ মোড়ে সিট-ইন চলে।"},
  en:{t:"Government calls protests 'illegal'",x:"Ministers say the protesters are 'crossing limits.' Students continue sit-ins at key intersections despite police obstruction."}},
 {d:12,dow:5,bd:"১২ জুলাই ২০২৪",ed:"12 July 2024",tag:"attack",loc_bn:"কুমিল্লা",loc_en:"Cumilla",src:"BSS",
  bn:{t:"আন্দোলনকারীদের ওপর প্রথম হামলা",x:"কুমিল্লা ভিক্টোরিয়া কলেজে ছাত্রলীগের হামলা; ভিডিও ধারণকারী এক শিক্ষার্থীকে হলে নিয়ে মারধর করা হয়।"},
  en:{t:"First attacks on protesters",x:"Chhatra League members attack protesters at Cumilla Victoria College; a student filming the scene is dragged into a hall and beaten."}},
 {d:13,dow:6,bd:"১৩ জুলাই ২০২৪",ed:"13 July 2024",tag:"protest",
  bn:{t:"রাষ্ট্রপতির কাছে স্মারকলিপির ঘোষণা",x:"ছুটির দিনেও শাহবাগ অবরোধ; সব গ্রেডে কোটা সংস্কারে রাষ্ট্রপতির কাছে স্মারকলিপি দেওয়ার ঘোষণা।"},
  en:{t:"Memorandum to the President announced",x:"Despite a holiday, students block Shahbagh and announce a memorandum to the President to reform quotas across all grades."}},
 {d:14,dow:0,bd:"১৪ জুলাই ২০২৪",ed:"14 July 2024",tag:"turning",lab:"রাজাকার",labEn:"'Razakar'",loc_bn:"গণভবন, ঢাকা",loc_en:"Ganabhaban, Dhaka",src:"BSS",
  bn:{t:"'রাজাকার' মন্তব্য",x:"শিক্ষার্থীরা রাষ্ট্রপতির কাছে স্মারকলিপি দেয়। সন্ধ্যায় গণভবনে প্রধানমন্ত্রী শেখ হাসিনার বক্তব্য আন্দোলনকারীদের 'রাজাকারের সন্তান' বলার মতো ধরা হয়, যা আন্দোলনে আগুন ধরিয়ে দেয়। মধ্যরাতে ঢাবিতে বিক্ষোভ; ছাত্রীরা হলের তালা ভেঙে যোগ দেয়; ঢাবি এলাকায় ৪জি বন্ধ; রাতে চবিতে ছাত্রলীগের হামলায় ১৩ জন আহত।"},
  en:{t:"The 'Razakar' remark",x:"Students submit their memorandum to the President. That evening PM Sheikh Hasina's remarks at Ganabhaban are seen as branding protesters 'children of Razakars,' igniting the movement. Students hold a midnight protest at Dhaka University; women students break their hall locks to join; 4G is cut in the DU area; that night Chhatra League attacks protesters at Chittagong University, injuring 13."}},
 {d:15,dow:1,bd:"১৫ জুলাই ২০২৪",ed:"15 July 2024",tag:"attack",lab:"ছাত্রলীগের হামলা",labEn:"BCL attack",loc_bn:"ঢাকা বিশ্ববিদ্যালয়",loc_en:"Dhaka University",src:"BSS",
  bn:{t:"ঢাবিতে ছাত্রলীগের হামলা",x:"ক্ষমতাসীন দলের 'উপযুক্ত জবাব' ঘোষণার পর হেলমেট পরা ছাত্রলীগ ঢাবিতে রড-হাঁসুয়া নিয়ে হামলা চালায়, অন্তত ৩০০ জন আহত, এবং ঢাকা মেডিকেলে হামলা করে। শিক্ষার্থীরা ঢাবির তিনটি হল দখলে নেয়।"},
  en:{t:"Chhatra League attacks Dhaka University",x:"After the ruling party promises a 'fitting reply,' helmeted BCL activists attack protesters at Dhaka University with rods and axes, at least 300 are injured, and storm Dhaka Medical College. Students take control of three DU halls."}},
 {d:16,dow:2,bd:"১৬ জুলাই ২০২৪",ed:"16 July 2024",tag:"killing",lab:"আবু সাঈদ",labEn:"Abu Sayed",loc_bn:"রংপুর",loc_en:"Rangpur",src:"Wikipedia / NPR / Amnesty",
  bn:{t:"আবু সাঈদ শহীদ",x:"সারাদেশে বিক্ষোভ রক্তক্ষয়ী হয়ে ওঠে; ঢাকা, চট্টগ্রাম ও রংপুরে অন্তত ছয়জন নিহত। বেগম রোকেয়া বিশ্ববিদ্যালয়ের আবু সাঈদ দুই হাত ছড়িয়ে দাঁড়িয়ে থাকা অবস্থায় পুলিশের গুলিতে শহীদ হন, ভিডিওটি ভাইরাল হয়ে আন্দোলনের প্রতীক হয়ে ওঠে। (এখন 'জুলাই শহীদ দিবস' হিসেবে পালিত।)"},
  en:{t:"Abu Sayed is killed",x:"Nationwide protests turn deadly; at least six are killed in Dhaka, Chattogram and Rangpur. Abu Sayed of Begum Rokeya University is shot dead by police as he stands with arms outstretched, the footage goes viral and becomes the movement's defining image. (Now observed as July Martyrs' Day.)"}},
 {d:17,dow:3,bd:"১৭ জুলাই ২০২৪",ed:"17 July 2024",tag:"protest",
  bn:{t:"ক্যাম্পাস 'রাজনীতিমুক্ত' ঘোষণা",x:"শিক্ষার্থীরা দলীয় কর্মীদের বিতাড়িত করে ক্যাম্পাসকে রাজনীতিমুক্ত ঘোষণা করে। তিন বিশ্ববিদ্যালয়ে গায়েবানা জানাজায় পুলিশের হামলা; হল খালি করার নির্দেশ। হাসিনা জাতির উদ্দেশে ভাষণে বিচার বিভাগীয় তদন্তের আশ্বাস দেন। পরদিন 'কমপ্লিট শাটডাউন'-এর ডাক।"},
  en:{t:"Campuses declared 'free of politics'",x:"Students drive party activists off campuses and declare them free of politics. Police attack absentee funeral prayers at three universities; dorms are ordered emptied. Hasina addresses the nation, promising a judicial inquiry. Students call a 'complete shutdown' for the next day."}},
 {d:18,dow:4,bd:"১৮ জুলাই ২০২৪",ed:"18 July 2024",tag:"killing",lab:"পানি লাগবে · মুগ্ধ",labEn:"Mugdho · water",loc_bn:"উত্তরা, ঢাকা",loc_en:"Uttara, Dhaka",src:"CNN / BSS",
  bn:{t:"'কমপ্লিট শাটডাউন', মুগ্ধ শহীদ, ইন্টারনেট বন্ধ",x:"কমপ্লিট শাটডাউনে ৪৮ জেলায় ব্যাপক সহিংসতা; অন্তত ২৯ জন নিহত। পানির বোতল বিলি করতে করতে 'পানি লাগবে কারো, পানি' বলা মীর মাহফুজুর রহমান 'মুগ্ধ' উত্তরায় গুলিতে শহীদ হন। বিটিভি ও সেতু ভবনে আগুন, সারাদেশে ইন্টারনেট বন্ধ, মেট্রোরেল স্থগিত।"},
  en:{t:"'Complete Shutdown', Mugdho killed, internet cut",x:"The Complete Shutdown brings massive violence across 48 districts; at least 29 are killed. Mir Mahfuzur Rahman 'Mugdho', famous for calling out 'who needs water?' while handing out bottles, is shot dead in Uttara. BTV and Setu Bhaban are torched, the internet is blocked nationwide, and the metro is suspended."}},
 {d:19,dow:5,bd:"১৯ জুলাই ২০২৪",ed:"19 July 2024",tag:"killing",lab:"কারফিউ",labEn:"Curfew",loc_bn:"সারাদেশ",loc_en:"Nationwide",src:"BSS",
  bn:{t:"সারাদেশে কারফিউ, সেনা মোতায়েন",x:"দিনভর সহিংসতায় শতাধিক মানুষ নিহতের পর মধ্যরাতে সারাদেশে কারফিউ জারি ও সেনা মোতায়েন। ইন্টারনেট ব্ল্যাকআউট অব্যাহত। নরসিংদীতে জেল ভেঙে প্রায় ৯০০ বন্দি মুক্ত।"},
  en:{t:"Nationwide curfew, army deployed",x:"After a day of violence that kills roughly a hundred people, the government imposes a nationwide curfew at midnight and deploys the army. The internet blackout continues; in Narsingdi a crowd frees some 900 inmates from the district jail."}},
 {d:20,dow:6,bd:"২০ জুলাই ২০২৪",ed:"20 July 2024",tag:"protest",
  bn:{t:"কারফিউর প্রথম দিন; গ্রেপ্তার শুরু",x:"কারফিউর প্রথম পূর্ণ দিনে যাত্রাবাড়ী, উত্তরা, বাড্ডা ও মিরপুরে সংঘর্ষে অন্তত ২৬ জন নিহত। কারফিউ বাড়ানো হয়; সমন্বয়ক নাহিদ ইসলামকে তুলে নেয় নিরাপত্তা বাহিনী।"},
  en:{t:"First curfew day; arrests begin",x:"At least 26 are killed on the first full day of curfew, with clashes in Jatrabari, Uttara, Badda and Mirpur. The curfew is extended and coordinator Nahid Islam is picked up by security forces."}},
 {d:21,dow:0,bd:"২১ জুলাই ২০২৪",ed:"21 July 2024",tag:"turning",lab:"৭% কোটা",labEn:"7% quota",loc_bn:"সুপ্রিম কোর্ট",loc_en:"Supreme Court",src:"BSS",
  bn:{t:"সুপ্রিম কোর্টে কোটা ৭%-এ",x:"সুপ্রিম কোর্ট অধিকাংশ কোটা বাতিল করে ৯৩% সরকারি চাকরি মেধায় ও ৭% সংরক্ষিত রাখে। কিন্তু হত্যাকাণ্ডের বিচার না হওয়ায় সমন্বয়করা রায়কে সমাধান মানতে অস্বীকার করে শাটডাউন চালিয়ে যায়; আরও সাতজন নিহত।"},
  en:{t:"Supreme Court cuts the quota to 7%",x:"The Supreme Court scraps most quotas, leaving 93% of civil-service jobs open on merit and 7% reserved. But with the killings unaddressed, coordinators reject the ruling as a solution and press the shutdown; seven more are killed."}},
 {d:22,dow:1,bd:"২২ জুলাই ২০২৪",ed:"22 July 2024",tag:"protest",
  bn:{t:"কোটা প্রজ্ঞাপন অনুমোদন",x:"আদালতের আদেশে প্রধানমন্ত্রী কোটা সংস্কারের প্রজ্ঞাপন অনুমোদন করেন, তবে বিরোধী নেতাদের গ্রেপ্তার চলতে থাকে; মোট নিহতের সংখ্যা ১৮৭-তে পৌঁছায়।"},
  en:{t:"Quota gazette approved",x:"The PM approves the quota-reform gazette based on the court order, but arrests of opposition figures continue and the death toll reaches 187."}},
 {d:23,dow:2,bd:"২৩ জুলাই ২০২৪",ed:"23 July 2024",tag:"protest",
  bn:{t:"সংস্কার পরিপত্র, প্রত্যাখ্যাত",x:"সরকার কোটা সংস্কারের পরিপত্র জারি করে, তবে সংসদে আইন না হওয়ায় সংগঠকরা তা প্রত্যাখ্যান করে। বিরোধী ও আন্দোলনকারীদের ওপর অভিযান চলে; ব্রডব্যান্ড ফিরতে শুরু করে।"},
  en:{t:"Reform circular issued, and rejected",x:"The government issues the quota-reform circular, but organisers reject it, saying no law was passed in parliament. Raids continue; broadband begins to return."}},
 {d:24,dow:3,bd:"২৪ জুলাই ২০২৪",ed:"24 July 2024",tag:"protest",
  bn:{t:"ব্রডব্যান্ড ফেরে; সমন্বয়করা ফিরে আসে",x:"বাস-লঞ্চ আংশিক চালু ও ব্রডব্যান্ড পুনঃস্থাপন। পাঁচ দিন নিখোঁজ থাকার পর তিন সমন্বয়ক, আসিফ মাহমুদ, আবু বাকের মজুমদার ও রিফাত রশিদ, ফিরে আসে; তারা জানায় তাদের চোখ বেঁধে রাখা হয়েছিল।"},
  en:{t:"Broadband restored; coordinators resurface",x:"Bus and launch services partly resume and broadband is restored. Three coordinators, Asif Mahmud, Abu Baker Majumdar and Rifat Rashid, resurface after five days, saying they were held blindfolded."}},
 {d:25,dow:4,bd:"২৫ জুলাই ২০২৪",ed:"25 July 2024",tag:"protest",
  bn:{t:"ধরপাকড় বাড়ে; নিহত ২০৪",x:"সেনা মোতায়েনের পর হাসিনার প্রথম প্রকাশ্যে আগমনের মধ্যেই ব্যাপক গ্রেপ্তার চলে। মানবাধিকার সংস্থাগুলো বলে পুলিশ প্রাণঘাতী অস্ত্র ব্যবহার করেছে; মোট নিহত ২০৪।"},
  en:{t:"Crackdown widens; toll reaches 204",x:"Mass arrests continue as Hasina makes her first public appearance since the army deployment. Rights groups say police used lethal weapons on protesters; the death toll reaches 204."}},
 {d:26,dow:5,bd:"২৬ জুলাই ২০২৪",ed:"26 July 2024",tag:"attack",lab:"গ্রেফতার",labEn:"Detained",loc_bn:"ঢাকা",loc_en:"Dhaka",src:"BSS",
  bn:{t:"ডিবিতে সমন্বয়করা; 'ব্লক রেইড' শুরু",x:"ডিবি সমন্বয়ক নাহিদ ইসলাম, আসিফ মাহমুদ ও আবু বাকের মজুমদারকে তুলে নেয়। সারাদেশে 'ব্লক রেইড', হাজারো গ্রেপ্তার, জাতিসংঘ দমন-পীড়ন ও ইন্টারনেট বন্ধ শেষ করার আহ্বান জানায়।"},
  en:{t:"Coordinators taken by DB; 'block raids' begin",x:"The Detective Branch picks up coordinators Nahid Islam, Asif Mahmud and Abu Baker Majumdar. 'Block raids' sweep the country, thousands are arrested, and the UN calls for the crackdown and internet blackout to end."}},
 {d:27,dow:6,bd:"২৭ জুলাই ২০২৪",ed:"27 July 2024",tag:"attack",
  bn:{t:"আরও সমন্বয়ক আটক",x:"ডিবি 'নিরাপত্তার জন্য' সমন্বয়ক সারজিস আলম ও হাসনাত আবদুল্লাহকে হেফাজতে নেয়। ১১ দিনে ৯,০০০-এর বেশি গ্রেপ্তার; ১৪টি পশ্চিমা মিশন জবাবদিহি দাবি করে।"},
  en:{t:"More coordinators detained",x:"The DB takes coordinators Sarjis Alam and Hasnat Abdullah into custody 'for their safety.' In 11 days over 9,000 people have been arrested; 14 Western missions call for accountability."}},
 {d:28,dow:0,bd:"২৮ জুলাই ২০২৪",ed:"28 July 2024",tag:"turning",
  bn:{t:"ডিবি হেফাজতে জোরপূর্বক 'প্রত্যাহার'",x:"ডিবি সমন্বয়ক নুসরাত তাবাসসুমকে আটক করে, এরপর একটি ভিডিও প্রকাশ করে যেখানে ছয় সমন্বয়ক আন্দোলন প্রত্যাহারের বিবৃতি পড়েন। অন্য সংগঠকরা বলেন বিবৃতিটি বন্দুকের মুখে নেওয়া, এবং প্রত্যাখ্যান করেন। মোবাইল ইন্টারনেট ফেরে; সোশ্যাল মিডিয়া বন্ধ থাকে।"},
  en:{t:"A forced 'withdrawal' from DB custody",x:"The DB detains coordinator Nusrat Tabassum, then releases a video in which six coordinators read a statement calling off the protests. Other organisers say it was made at gunpoint and reject it. Mobile internet returns; social media stays blocked."}},
 {d:29,dow:1,bd:"২৯ জুলাই ২০২৪",ed:"29 July 2024",tag:"protest",
  bn:{t:"আন্দোলন পুনরায়; শিক্ষকরা যোগ দেন",x:"নেতাদের মুক্তির আলটিমেটাম উপেক্ষা করায় শিক্ষার্থীরা আবার রাজপথে নামে। হাইকোর্ট আটক সমন্বয়কদের সঙ্গে খাবারের ছবি নিয়ে ডিবিকে ভর্ৎসনা করে; শিক্ষকরা 'জুলাই গণহত্যা'র বিরুদ্ধে সমাবেশ করেন।"},
  en:{t:"Protests resume; teachers join",x:"Ignoring the ultimatum to free their leaders, students return to the streets. A High Court bench rebukes the DB over a photo of the detained coordinators sharing a meal, and university teachers rally against the 'July Massacre.'"}},
 {d:30,dow:2,bd:"৩০ জুলাই ২০২৪",ed:"30 July 2024",tag:"protest",lab:"প্রোফাইল লাল",labEn:"Red profiles",
  bn:{t:"লাল প্রোফাইলে 'শোক দিবস' প্রত্যাখ্যান",x:"সরকার রাষ্ট্রীয় শোক দিবস পালন করে; শিক্ষার্থীরা তা প্রত্যাখ্যান করে সোশ্যাল মিডিয়ায় প্রোফাইল লাল করে প্রতিবাদ জানায় ও সারাদেশে বিক্ষোভ করে। ছয় সমন্বয়ক তখনো ডিবি হেফাজতে।"},
  en:{t:"Red profiles reject the 'mourning day'",x:"The government observes an official day of mourning; students reject it and turn their social-media profiles red in protest, staging demonstrations across the country. The six coordinators remain in DB custody."}},
 {d:31,dow:3,bd:"৩১ জুলাই ২০২৪",ed:"31 July 2024",tag:"turning",lab:"মার্চ ফর জাস্টিস",labEn:"March for Justice",loc_bn:"সারাদেশ",loc_en:"Nationwide",src:"BSS",
  bn:{t:"'মার্চ ফর জাস্টিস'",x:"হত্যা, গ্রেপ্তার ও গুমের প্রতিবাদে শিক্ষার্থীরা আদালত ও ক্যাম্পাসে সারাদেশে 'মার্চ ফর জাস্টিস' করে, নয় দফা দাবি জানায়। ১৩ দিন পর ফেসবুক, হোয়াটসঅ্যাপসহ অন্যান্য প্ল্যাটফর্ম ফিরে আসে।"},
  en:{t:"'March for Justice'",x:"Students hold a nationwide 'March for Justice' at courts and campuses over the killings, arrests and enforced disappearances, pressing nine demands. After 13 days, Facebook, WhatsApp and other platforms are switched back on."}},
 {d:32,dow:4,bd:"১ আগস্ট ২০২৪",ed:"1 August 2024",tag:"turning",
  bn:{t:"সমন্বয়করা মুক্ত; জামায়াত নিষিদ্ধ",x:"সরকার সন্ত্রাসবিরোধী আইনে জামায়াতে ইসলামী ও তার ছাত্র সংগঠন নিষিদ্ধ করে। ছয় সমন্বয়ক হেফাজত থেকে মুক্তি পান; আন্দোলনকারীরা নিহতদের জন্য মিছিল ও দোয়া করে।"},
  en:{t:"Coordinators freed; Jamaat banned",x:"The government bans Jamaat-e-Islami and its student wing under anti-terror law. The six coordinators are released from custody, and protesters hold mass processions and prayers for the dead."}},
 {d:33,dow:5,bd:"২ আগস্ট ২০২৪",ed:"2 August 2024",tag:"protest",
  bn:{t:"অসহযোগের ঘোষণা",x:"মার্চ ফর জাস্টিস আরও বড় হয়; ক্ষমতাসীন কর্মী ও পুলিশের হামলায় আরও দুজন নিহত। ৪ঠা আগস্ট থেকে সারাদেশে অসহযোগ আন্দোলনের ঘোষণা। ইউনিসেফ জানায় অন্তত ৩২ শিশু নিহত।"},
  en:{t:"Non-cooperation announced",x:"Marches for justice swell; two more are killed as ruling-party activists and police attack protesters. Organisers announce a nationwide non-cooperation movement from 4 August. UNICEF says at least 32 children have died."}},
 {d:34,dow:6,bd:"৩ আগস্ট ২০২৪",ed:"3 August 2024",tag:"turning",lab:"১ দফা",labEn:"One-point demand",loc_bn:"শহীদ মিনার, ঢাকা",loc_en:"Shaheed Minar, Dhaka",src:"BSS",
  bn:{t:"এক দফা: হাসিনার পদত্যাগ",x:"কেন্দ্রীয় শহীদ মিনারে সমন্বয়ক নাহিদ ইসলাম এক দফা ঘোষণা করেন, শেখ হাসিনা ও তার মন্ত্রিসভার পদত্যাগ, এবং ৪ঠা আগস্ট থেকে পূর্ণ অসহযোগের ডাক দেন। হাসিনা আলোচনার প্রস্তাব দিলে শিক্ষার্থীরা প্রত্যাখ্যান করে।"},
  en:{t:"One-point demand: Hasina must resign",x:"At the Central Shaheed Minar, coordinator Nahid Islam announces a single demand, the resignation of Sheikh Hasina and her cabinet, and a full non-cooperation movement from 4 August. Hasina offers talks; students refuse."}},
 {d:35,dow:0,bd:"৪ আগস্ট ২০২৪",ed:"4 August 2024",tag:"killing",lab:"সবচেয়ে রক্তক্ষয়ী",labEn:"Deadliest day",loc_bn:"ঢাকা ও ২১ জেলা",loc_en:"Dhaka & 21 districts",src:"BSS",
  bn:{t:"সবচেয়ে রক্তক্ষয়ী দিন; 'ঢাকা চলো'র ডাক",x:"একক সবচেয়ে রক্তক্ষয়ী দিন: ঢাকা ও ২১ জেলায় সংঘর্ষে ১৩ পুলিশসহ প্রায় ৯১ জন নিহত। সরকার আবার ইন্টারনেট বন্ধ করে অনির্দিষ্টকালের কারফিউ ঘোষণা করে। সরকার হটাতে শিক্ষার্থীরা 'ঢাকা চলো' কর্মসূচির ডাক দেয়।"},
  en:{t:"The deadliest day; 'March to Dhaka' called",x:"The single deadliest day: around 91 people are killed, including 13 policemen, amid clashes in Dhaka and 21 districts. The government shuts the internet again and declares an indefinite curfew. Students call a 'March to Dhaka' to force the government out."}},
 {d:36,dow:1,bd:"৫ আগস্ট ২০২৪",ed:"5 August 2024",tag:"fall",lab:"৩৬ জুলাই",labEn:"36 July",loc_bn:"গণভবন, ঢাকা",loc_en:"Ganabhaban, Dhaka",src:"BSS / NPR",
  bn:{t:"৩৬ জুলাই, সরকারের পতন",x:"কারফিউ উপেক্ষা করে 'ঢাকা চলো'র ডাকে বিশাল জনস্রোত রাজধানীতে নামে। বিকেলে শেখ হাসিনা পদত্যাগ করে ভারতে পালিয়ে যান; জনতা গণভবনে প্রবেশ করে। সেনাপ্রধান অন্তর্বর্তী সরকারের ঘোষণা দেন, পনেরো বছরের শাসনের অবসান ঘটে।"},
  en:{t:"36 July, the government falls",x:"Defying the curfew, huge crowds march on the capital under the 'March to Dhaka' call. By afternoon Sheikh Hasina resigns and flees to India; crowds enter Ganabhaban. The army chief announces an interim government, ending fifteen years of rule."}},
];

/* ---------- helpers ---------- */
const BN_NUM=['০','১','২','৩','৪','৫','৬','৭','৮','৯'];
const toBn=n=>String(n).split('').map(c=>/[0-9]/.test(c)?BN_NUM[+c]:c).join('');
const DOW_BN=["রবি","সোম","মঙ্গল","বুধ","বৃহঃ","শুক্র","শনি"];
const DOW_EN=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const BADGE={
  protest:{key:"bProtest",bg:"var(--panel-light)",fg:"var(--ink)"},
  attack:{key:"bAttack",bg:"#f58c00",fg:"#0B0B0B"},
  turning:{key:"bTurning",bg:"var(--yellow)",fg:"#0B0B0B"},
  killing:{key:"bMartyr",bg:"var(--red)",fg:"var(--ink)"},
  fall:{key:"bFall",bg:"linear-gradient(90deg,var(--red),var(--yellow))",fg:"#0B0B0B"},
};

/* ---------- language ---------- */

/* ---------- calendar ---------- */
const calGrid=document.getElementById("calGrid");
function renderCalendar(){
  let html="";
  (currentLang==="bn"?DOW_BN:DOW_EN).forEach(d=>html+=`<div class="ju-dow">${d}</div>`);
  // spark cell sits in the first Sunday slot (day 1 = Monday)
  html+=`<button class="ju-cell spark" data-day="0"><span class="spk">✊</span><span class="lab">${currentLang==="bn"?"স্ফুলিঙ্গ":"Spark"}</span></button>`;
  JULY.forEach(e=>{
    const cls=e.tag==="protest"?"":`k-${e.tag}`;
    const label=(e.lab||e.labEn)?`<span class="lab">${currentLang==="bn"?(e.lab||""):(e.labEn||"")}</span>`:"";
    html+=`<button class="ju-cell ${cls}" data-day="${e.d}"><span class="tagdot"></span><span class="n">${toBn(e.d)}</span>${label}</button>`;
  });
  calGrid.innerHTML=html;
  calGrid.querySelectorAll(".ju-cell").forEach(c=>c.addEventListener("click",()=>openDay(+c.dataset.day)));
}

/* ---------- day modal ---------- */
const dayModal=document.getElementById("dayModal");
let currentDay=1;
function openDay(d){currentDay=d;fillDay(d);dayModal.classList.add("open");}
function fillDay(d){
  const band=document.getElementById("dayBand");
  const badge=document.getElementById("dayBadge");
  if(d===0){
    document.getElementById("dayNum").textContent="✊";
    document.getElementById("dayGreg").textContent=currentLang==="bn"?"৫ জুন ২০২৪":"5 June 2024";
    band.className="ju-day-band k-turning";
    badge.style.display="none";
    document.getElementById("dayTitle").textContent=SPARK[currentLang].t;
    document.getElementById("dayText").textContent=SPARK[currentLang].x;
  }else{
    const e=JULY.find(x=>x.d===d);
    document.getElementById("dayNum").textContent=d;
    document.getElementById("dayGreg").textContent=(currentLang==="bn"?e.bd:e.ed)+" · "+(currentLang==="bn"?DOW_BN:DOW_EN)[e.dow];
    band.className="ju-day-band k-"+e.tag;
    const b=BADGE[e.tag];badge.style.display="";badge.textContent=t(b.key);badge.style.background=b.bg;badge.style.color=b.fg;
    document.getElementById("dayTitle").textContent=e[currentLang].t;
    document.getElementById("dayText").textContent=e[currentLang].x;
  }
  document.getElementById("dayPrev").disabled=(d<=0);
  document.getElementById("dayNext").disabled=(d>=36);
}
document.getElementById("dayPrev").addEventListener("click",()=>openDay(Math.max(0,currentDay-1)));
document.getElementById("dayNext").addEventListener("click",()=>openDay(Math.min(36,currentDay+1)));
document.getElementById("dayClose").addEventListener("click",()=>dayModal.classList.remove("open"));
dayModal.addEventListener("click",e=>{if(e.target===dayModal)dayModal.classList.remove("open");});

/* ---------- calendar overlay open/close ---------- */
const calOverlay=document.getElementById("calOverlay");
const openCalendar=()=>{calOverlay.classList.add("open");document.body.style.overflow="hidden";};
const closeCalendar=()=>{calOverlay.classList.remove("open");document.body.style.overflow="";};
document.getElementById("openCal").addEventListener("click",openCalendar);
document.getElementById("openCal2")?.addEventListener("click",openCalendar);
document.getElementById("calClose").addEventListener("click",closeCalendar);
calOverlay.addEventListener("click",e=>{if(e.target===calOverlay)closeCalendar();});
document.addEventListener("keydown",e=>{if(e.key==="Escape"){if(dayModal.classList.contains("open"))dayModal.classList.remove("open");else if(calOverlay.classList.contains("open"))closeCalendar();}});

/* ---------- timeline (horizontal drag) ---------- */
const rail=document.getElementById("tlRail");
const track=document.getElementById("tlTrack");
function renderTimeline(){
  track.innerHTML=JULY.map(e=>{
    const cls=(e.tag==="killing")?"k-killing":(e.tag==="fall")?"k-fall":"";
    return `<div class="ju-tl-card ${cls}" data-day="${e.d}"><span class="dot"></span>
      <div class="ju-tl-num">${e.d}</div>
      <div class="ju-tl-date">${currentLang==="bn"?e.bd:e.ed}</div>
      <div class="ju-tl-t">${e[currentLang].t}</div>
      <div class="ju-tl-x">${e[currentLang].x}</div>
      <div class="ju-tl-more">${t("tlMore")}</div></div>`;
  }).join("");
  track.querySelectorAll(".ju-tl-card").forEach(c=>c.addEventListener("click",()=>{if(!moved)openDay(+c.dataset.day);}));
}
let down=false,startX,startScroll,moved=false;
rail.addEventListener("mousedown",e=>{down=true;moved=false;startX=e.pageX;startScroll=rail.scrollLeft;rail.classList.add("dragging");});
window.addEventListener("mouseup",()=>{down=false;rail.classList.remove("dragging");});
window.addEventListener("mousemove",e=>{if(!down)return;const dx=e.pageX-startX;if(Math.abs(dx)>4)moved=true;rail.scrollLeft=startScroll-dx;});
rail.addEventListener("wheel",e=>{if(Math.abs(e.deltaY)>Math.abs(e.deltaX)){rail.scrollLeft+=e.deltaY;e.preventDefault();}},{passive:false});

/* ---------- archive ---------- */
const archGrid=document.getElementById("archGrid");
const archEmpty=document.getElementById("archEmpty");
let archCat="all",archQuery="";
const ARCHIVE=JULY.filter(e=>e.loc_en&&e.src);
function renderArchive(){
  const q=archQuery.trim().toLowerCase();
  const items=ARCHIVE.filter(e=>{
    if(archCat!=="all"&&e.tag!==archCat)return false;
    if(!q)return true;
    const hay=(e.bn.t+e.bn.x+e.en.t+e.en.x+e.loc_en+e.loc_bn+e.ed+e.bd).toLowerCase();
    return hay.includes(q);
  });
  archEmpty.style.display=items.length?"none":"block";
  archGrid.innerHTML=items.map(e=>`
    <div class="ju-arch-card">
      <div class="ju-arch-top">
        <div><div class="ju-arch-date">${currentLang==="bn"?e.bd:e.ed}</div>
        <div class="ju-arch-loc">📍 ${currentLang==="bn"?e.loc_bn:e.loc_en}</div></div>
        <span class="ju-verified">✔ ${t("arVerified")}</span>
      </div>
      <div class="ju-arch-h">${e[currentLang].t}</div>
      <div class="ju-arch-s">${e[currentLang].x}</div>
      <div class="ju-arch-src">${t("arSource")}: ${e.src}</div>
    </div>`).join("");
}
document.getElementById("archSearch").addEventListener("input",e=>{archQuery=e.target.value;renderArchive();});
document.querySelectorAll(".ju-chip").forEach(ch=>ch.addEventListener("click",()=>{
  document.querySelectorAll(".ju-chip").forEach(c=>c.classList.remove("active"));
  ch.classList.add("active");archCat=ch.dataset.cat;renderArchive();
}));

/* ---------- init ---------- */

/* ---------- final init (must run after all data/functions above are defined) ---------- */
applyLang("bn");
loadCases();

/* PWA: register service worker for offline page-shell caching */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("/static/sw.js").catch(() => {});
  });
}
