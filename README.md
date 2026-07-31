<div align="center">

<img src="./assets/hero-animation.svg" alt="ShottoQR — সত্যQR — Sealed Truth for an Unforgettable July" width="100%" />

**A forensic verification engine, a justice tracker, a national transparency dashboard, and a living memorial. Built for the survivors, journalists, and citizens of the July 2024 uprising, and for every movement that comes after it.**

[![Status](https://img.shields.io/badge/status-hackathon--build-critical?style=flat-square&color=D62828)](#)
[![Layer 1](https://img.shields.io/badge/Layer%201-Verification%20Engine-FFC300?style=flat-square)](#-layer-1--সত্য-যাচাই-verification-engine)
[![Layer 2](https://img.shields.io/badge/Layer%202-Justice%20Tracker-0D1B2A?style=flat-square)](#-layer-2--ন্যায়বিচার-justice-tracker)
[![Offline Verify](https://img.shields.io/badge/verification-works%20offline-2E7D32?style=flat-square)](#-layer-1--সত্য-যাচাই-verification-engine)
[![Bilingual](https://img.shields.io/badge/bilingual-বাংলা%20%2F%20English-D62828?style=flat-square)](#)
[![License](https://img.shields.io/badge/license-MIT-black?style=flat-square)](#-license)

<a href="https://youtu.be/oMPBr9XrcvE">
  <img src="assets/demo-thumbnail.png" width="900" alt="Watch Demo">
</a>


**[▶ Live Demo](https://testt-1-zguo.onrender.com/)**

</div>

---

## ✊ The Problem

In July 2024, Bangladesh lived through a month that changed the country. Almost immediately, the record of it became a battlefield. Photos were cropped to hide context. Injuries were staged or denied. Screenshots were doctored and re-shared as proof: especially once the internet shutdown made anything hard to check in real time. Victims' families were asked to prove their own tragedy with no tools to do so and no neutral system existed to separate a real photograph of harm from a manipulated one, or to track what happened to a case after it was reported.

**ShottoQR (সত্যQR, "Truth QR")** exists to close that gap. It is a forensic evidence pipeline that tells you how trustworthy an image is *and why*, a cryptographically sealed certificate system that can be verified with nothing but a QR code, even with no internet, a transparent case-tracking system that follows a victim's journey from report to resolution without ever exposing their identity, a national transparency dashboard that turns that same data into district-level accountability, and a living bilingual memorial so July 2024 is remembered with facts attached to it, not just feeling.

This isn't a hypothetical. It's a working system with 7 real forensic signals, a SHA-256 hash-chained seal plus a real Ed25519 digital signature, an **offline** QR verifier, one-click court-ready PDF certificates, a public transparency portal, an admin review workflow, and a role-based (never name-based) chain of custody log.

---

## 📸 Platform Preview

<p align="center">
  <img src="./Screenshot%202026-07-31%20123858.png" width="280" alt="Home Page"/>
  <img src="./Screenshot%202026-07-31%20123907.png" width="280" alt="Verification Result"/>
  <img src="./Screenshot%202026-07-31%20123915.png" width="280" alt="Certificate"/>
</p>

<p align="center">
  <img src="./Screenshot%202026-07-31%20124045.png" width="280" alt="Justice Tracker"/>
  <img src="./Screenshot%202026-07-31%20124125.png" width="280" alt="Transparency Dashboard"/>
  <img src="./Screenshot%202026-07-31%20124133.png" width="280" alt="Memorial"/>
</p>

## 🧩 What It Does

### 🔍 Layer 1: সত্য যাচাই (Verification Engine)

* **7-signal forensic analysis.** ELA, EXIF metadata check, blur/sharpness, histogram clipping, JPEG blockiness, rotation canvas-fill detection, and screenshot resolution matching: combined into one Integrity Score with a visible, human-readable reasons list. Never a black-box fake/real verdict.
* **Explainable Integrity Score.** Every verdict opens into a signal-by-signal breakdown: each of the 7 signals shown with its own suspicion bar, a clean/suspicious/high-risk status pill, and exactly how many points it removed from the final score. A judge, a journalist, or a victim's family sees *why* a score is what it is, not just the number.
* **Reuse and duplicate detection.** Perceptual hashing (pHash) flags whether an uploaded image has circulated before, so recycled photos from other events can't be passed off as new evidence.
* **Tamper-evident sealing.** Every verified image gets a SHA-256 seal recorded in an append-only hash chain, *plus* a real Ed25519 digital signature. Break one link and the whole chain fails verification.
* **Offline-verifiable QR certificates.** A downloadable, watermarked certificate carries a QR code whose signature can be checked with nothing but the public key — no server, no database, no internet connection. This is what makes verification possible during an internet shutdown, which is exactly the condition July 2024 tested.
* **One-click court-ready PDF.** Every piece of sealed evidence can be exported as a single certificate: hash + full signal breakdown + signed manifest + offline QR + chain-of-custody table, formatted for an investigator or tribunal to file directly.
* **Chain of custody, without names.** Every action (Uploaded, Verified, Viewed, Linked to Case) is logged by role only: Journalist, Witness, Investigator, Admin, Public. Full accountability trail, zero ability to identify or endanger a source.

### ⚖️ Layer 2: ন্যায়বিচার (Justice Tracker)

* **Public transparency feed.** Every case moves through five visible stages: **Report → তদন্ত (Investigation) → চিকিৎসা (Medical Support) → ক্ষতিপূরণ (Compensation) → চূড়ান্ত সমাধান (Final Resolution)**. Anyone — a victim's family, a journalist, an oversight body: can see exactly where a case stands without asking.
* **Anonymous public reporting.** Zero identifying information required. Reports land in an admin queue as private by default, and only reach the public feed after human review.
* **Deliberate PII omission.** Victim name, NID, and phone number are not fields in the data model at all: not hidden, not encrypted, simply never collected, because that kind of data needs an access-controlled government system, not a hackathon database. `case_reference` is the only public-safe lookup identifier.
* **Admin panel.** Full case lifecycle management: create cases, update status, approve or reject public reports, link sealed evidence to a case.

### 📊 National Transparency Dashboard *(Command Center)*

* A ministry-grade, single-screen overview built entirely from the same case and evidence data above: live KPIs, a five-stage status funnel, a district heatmap, a 14-day flagged-upload trend, a live case feed, and a per-district **Transparency Index** (verification rate × resolution rate): a metric an oversight ministry could actually be held to.
* Reads live from the API. If the API or database isn't reachable, it falls back to a clearly labelled **DEMO DATA** view so a screen is never blank mid-presentation.
* Reachable at `/command-center`.

### 🕯️ জুলাই স্মৃতি (July Memorial)

* **Interactive Calendar.** A poster-style 1–36 July grid. Click any date to see what happened that day.
* **Timeline.** Drag to scroll through the full 36-day arc.
* **Verified Archive.** Searchable, filterable, sourced record of confirmed events (শহীদ, মোড়/turning point, হামলা, fall), built on citation rather than memory.
* **Digital Memorial Wall.** A dedicated space (`/memorial`) to light a candle, leave a flower, or post a moderated tribute for named and unnamed martyrs of the uprising: no photographs used, out of respect and privacy; only well-documented names are seeded, with room for families or admins to add verified profiles.
* **About Us.** The team behind it.

### 🌐 Site-wide

* **True bilingual support** (বাংলা ⇄ English), one click, everywhere: the entire interface, including the memorial, dashboard, and admin tooling.
* **Dark red, gold, and black visual identity** carried consistently from the homepage to the certificates themselves, with a faint fist watermark, so a sealed certificate is recognizably this movement's, not a generic template.
* **PWA-ready**: installable, with an offline-first service worker for low-connectivity field use.

---

## 🏆 Why This Should Win *(mapped to the judging rubric)*

Scored against the 80% that isn't audience engagement, because a project should win on what it is, not only on how hard its team can campaign for likes.

| Criterion | Weight | How ShottoQR earns it |
|---|---|---|
| **Impact & relevance to track** | 25% | Solves a documented, active problem: contested visual evidence and untracked justice claims from a real national event — for three concrete user groups. Victims and families get anonymous reporting, status visibility, and now a public transparency index. Journalists and investigators get independent, offline-capable verification, a custody trail, and a court-ready export. Government and oversight bodies get a structured case pipeline and a live public dashboard. This is a human rights and civic-infrastructure project, not a repurposed generic app. |
| **Technical execution** | 20% | Not a mockup. 7 independently implemented forensic signals with honestly reported score behaviour. A real SHA-256 hash-chain seal *and* a real Ed25519 signature, both independently verifiable offline. A FastAPI backend covering verification, case tracking, dashboard aggregation, and PDF export. Every claim in this README is something the code actually does, including what it doesn't yet do (see [Known Limitations](#-known-limitations-built-to-be-trusted-not-oversold)). |
| **Innovation & originality** | 15% | The combination is the innovation: forgery detection honestly scoped for real-world evidence photos from a civil movement, fused with a PII-free justice pipeline, an *offline-verifiable* cryptographic seal, an explainable (not black-box) integrity score, and a national transparency index most hackathon projects never attempt. |
| **Feasibility & resilience** | 10% | Runs on SQLite with no external services required. No GPU, no paid API keys — functional on a single low-end machine or a free-tier deploy (Render/Railway). Offline QR verification and a PWA shell mean the core trust mechanism survives exactly the condition that made July 2024 hard to document: an internet shutdown. |
| **Presentation & usability** | 10% | One homepage: verification, reporting, the dashboard, and the memorial all live in a single bilingual interface a non-technical judge, or a non-technical victim's family member, can use unassisted. See the [pitch page](./docs/index.html) for the full visual identity. |

---

## 🇧🇩 Path to National Adoption

This section exists because the goal was never just to win a hackathon. It's to build something the government can actually run.

* **Privacy by design, not privacy by policy.** PII fields don't exist in the schema, so there's nothing to leak, subpoena unsafely, or misconfigure.
* **Auditable by default.** Every seal, every view, every status change is logged and independently re-verifiable via QR, exactly the property an oversight ministry, a UN fact-finding mission, or an international press body needs before trusting a domestic system's output.
* **Offline-first trust.** Verification does not require the internet, the server, or even this codebase to be online, only the public key and the signed manifest. That property matters most in exactly the conditions a crisis creates.
* **Boring, resilient infrastructure.** SQLite to PostgreSQL is a one-line connection-string change when case volume demands it. The whole stack runs on commodity hardware.
* **Honest forensics.** The system tells you what it can and can't detect (see below) instead of pretending to be an infallible lie detector: the property a government or international body needs before staking legal or diplomatic weight on a verified badge.
* **Extendable to any future movement or disaster.** The July 2024 memorial and dashboard are a configuration of the architecture, not a hardcoded one-off. The same evidence-sealing, case-tracking, and transparency-index core could be repointed at any future crisis needing verifiable public record: an election, a disaster, a human rights investigation.

---

## ⚠️ Known Limitations (built to be trusted, not oversold)

Read this section out loud to the judges. It is a strength, not a weakness.

**Reliably detected:** Blur, crop, brightness/contrast change, JPEG re-compression artifacts, screenshot resolution matches, missing/stripped EXIF, perceptual-hash reuse.
**Partially detected:** Resized screenshots (exact-resolution screen dumps are caught reliably; a resized screenshot is harder). In-place rotate-and-crop edits with no canvas fill are harder to catch than rotate-and-expand edits, which do leave a detectable solid-colour corner fill.
**Not a deepfake detector.** The optional AI-image heuristic included in the court-PDF export is an experimental screen, explicitly labelled as such, it is not a definitive synthetic-image or GPU-based forgery classifier, and none is shipped, because the added GPU/deployment risk wasn't worth it for a hackathon-scale accuracy gain against a dataset the heuristic signals already cover well.

**The Integrity Score is decision support, not a verdict.** It ships with a visible, signal-by-signal reasons list so a human: a journalist, an investigator, a judge, makes the final call with evidence in front of them, not a black box.

---

## 🏗️ Architecture


<p align="center">
  <img src="./architecture.png" alt="ShottoQR System Architecture" width="100%">
</p>


## 📡 API Reference

**Layer 1: Verification**

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/verify` | Upload jpg/png, get back Integrity Score, verdict, reasons, QR, certificate |
| `GET` | `/api/evidence` | List all sealed evidence |
| `GET` | `/api/evidence/{id}` | Single evidence record |
| `GET` | `/api/evidence/{id}/custody-log` | Full chain-of-custody timeline (JSON) |
| `GET` | `/api/verify-seal/{id}` | Independently re-verify a seal (what the QR hits) |
| `GET` | `/api/evidence/{id}/manifest` | Signed manifest for offline verification |
| `GET` | `/api/evidence/{id}/pdf` | **One-click court-ready evidence PDF** (hash, signals, signature, custody) |
| `GET` | `/api/public-key` | The Ed25519 public key used to sign every manifest |

**Layer 2: Justice Tracker**

| Method | Endpoint | Purpose |
|---|---|---|
| `POST` | `/api/cases` | Create a case (`case_reference`, `location`, `incident_summary`, `is_public`) |
| `GET` | `/api/cases` | Public transparency feed (`is_public=1` only) |
| `GET` | `/api/cases/{id}` | Case detail and linked evidence |
| `PATCH` | `/api/cases/{id}/status` | Advance status: Report → Investigation → Medical Support → Compensation → Final Resolution |
| `POST` | `/api/cases/{id}/link-evidence` | Attach sealed evidence to a case |
| `GET` | `/api/dashboard-stats` | Live aggregates powering the National Transparency Dashboard |

## 🖥️ Admin Panel

`/admin`: create and manage cases, update status, approve or reject pending public reports, link evidence. No raw API calls required for day-to-day operation.

## 📊 National Transparency Dashboard

`/command-center`: a single-screen, ministry-style view of the whole system — KPIs, case-status funnel, verdict distribution, district heatmap, flagged-upload trend, live feed, and the per-district Transparency Index. Falls back to clearly labelled demo data if the API isn't reachable, so it's never blank mid-demo.

## 🕯️ Memorial Wall

`/memorial`: light a candle, leave a flower, or post a moderated tribute for the martyrs of July 2024. Respectful by design — no photographs, only well-documented names seeded, with light client-side moderation on tributes.


## 👥 Team

| Name | Institution | Role | GitHub |
|---|---|---|---|
| Meherun Ritu | ULAB | Team Lead | [@Meherunritu](https://github.com/Meherunritu) |
| Tahsin Shuborna | AUST | Engineering | [@tahscene](https://github.com/tahscene) |
| Shahriar Hossain Arafat | AUST | Engineering | [@ShArafat58](https://github.com/ShArafat58) |

> Before pushing: add `keys/*.key` to `.gitignore` so the Ed25519 private key never lands in a public repo.

---

## 📜 License

MIT. Built to be forked by the next team that needs to protect the record of what actually happened.

<div align="center">

**সত্য মুছে যায় না। The truth doesn't erase.**

</div>
