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
  document.querySelectorAll(".lang-switch button").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.lang === lang);
  });
  renderCases(window.__lastCases || []);
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

/* init */
applyLang("bn");
loadCases();

/* ============================================================
   Public incident report form
   ============================================================ */
const reportForm = document.getElementById("reportForm");
const reportMsg = document.getElementById("reportMsg");

reportForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const payload = {
    case_reference: document.getElementById("reportRef").value.trim(),
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
    reportMsg.innerHTML = `<p style="color:#7fd9ae; margin-top:10px; font-size:0.9rem;">${I18N.reportSuccess[currentLang]}</p>`;
    reportForm.reset();
  } catch (err) {
    reportMsg.innerHTML = `<p style="color:#ff9a9a; margin-top:10px; font-size:0.9rem;">${I18N.reportError[currentLang]}</p>`;
  }
});
