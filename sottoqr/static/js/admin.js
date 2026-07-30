const STATUS_OPTIONS = ["Report", "Investigation", "Medical Support", "Compensation", "Final Resolution"];

function showMsg(el, text, ok) {
  el.innerHTML = `<div class="msg ${ok ? "ok" : "err"}">${text}</div>`;
  setTimeout(() => { el.innerHTML = ""; }, 4000);
}

/* ---------------- create case ---------------- */
document.getElementById("caseForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("caseFormMsg");
  const payload = {
    case_reference: document.getElementById("caseRef").value.trim() || null,
    location: document.getElementById("caseLocation").value.trim() || null,
    incident_summary: document.getElementById("caseSummary").value.trim() || null,
    is_public: document.getElementById("caseIsPublic").checked,
  };
  try {
    const res = await fetch("/api/cases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.detail || "Failed");
    showMsg(msgEl, "কেস তৈরি হয়েছে: " + data.case_reference, true);
    document.getElementById("caseForm").reset();
    document.getElementById("caseIsPublic").checked = true;
    loadCases();
  } catch (err) {
    showMsg(msgEl, "Error: " + err.message, false);
  }
});

/* ---------------- list + update cases ---------------- */
async function loadCases() {
  const tbody = document.getElementById("casesTbody");
  try {
    const res = await fetch("/api/admin/cases");
    const cases = await res.json();
    window.__allCases = cases;

    if (cases.length === 0) {
      tbody.innerHTML = `<tr><td colspan="5" class="hint">এখনো কোনো কেস নেই।</td></tr>`;
    } else {
      tbody.innerHTML = cases.map((c) => `
        <tr>
          <td>${c.case_reference}</td>
          <td>${c.location || "-"}</td>
          <td>
            <button class="visibility-toggle" data-case-id="${c.id}" data-current="${c.is_public}"
              style="background:none; border:1px solid ${c.is_public ? "var(--green)" : "var(--yellow)"}; color:${c.is_public ? "var(--green)" : "var(--yellow)"}; border-radius:999px; padding:3px 10px; font-size:0.75rem; font-weight:700;">
              ${c.is_public ? "Public" : "Pending, click to publish"}
            </button>
          </td>
          <td>
            <select class="status-select" data-case-id="${c.id}">
              ${STATUS_OPTIONS.map((s) => `<option value="${s}" ${s === c.status ? "selected" : ""}>${s}</option>`).join("")}
            </select>
          </td>
          <td>
            <input type="text" class="agency-input" data-case-id="${c.id}" placeholder="e.g. Investigation Authority"
              value="${c.updated_by_agency || ""}" style="width:170px;" />
          </td>
        </tr>
      `).join("");

      async function pushStatusUpdate(caseId) {
        const statusEl = document.querySelector(`.status-select[data-case-id="${caseId}"]`);
        const agencyEl = document.querySelector(`.agency-input[data-case-id="${caseId}"]`);
        await fetch(`/api/cases/${caseId}/status`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: statusEl.value, updated_by_agency: agencyEl.value || null }),
        });
      }

      document.querySelectorAll(".status-select").forEach((sel) => {
        sel.addEventListener("change", () => pushStatusUpdate(sel.dataset.caseId));
      });
      document.querySelectorAll(".agency-input").forEach((inp) => {
        inp.addEventListener("blur", () => pushStatusUpdate(inp.dataset.caseId));
      });

      document.querySelectorAll(".visibility-toggle").forEach((btn) => {
        btn.addEventListener("click", async () => {
          const caseId = btn.dataset.caseId;
          const newVal = btn.dataset.current !== "1";
          await fetch(`/api/cases/${caseId}/visibility?is_public=${newVal}`, { method: "PATCH" });
          loadCases();
        });
      });
    }

    // populate case dropdown in link form
    const linkSelect = document.getElementById("linkCaseSelect");
    linkSelect.innerHTML = cases.map((c) => `<option value="${c.id}">${c.case_reference}</option>`).join("");
  } catch (err) {
    tbody.innerHTML = `<tr><td colspan="5" class="msg err">Could not load cases. Is the backend running?</td></tr>`;
  }
}

/* ---------------- evidence dropdown ---------------- */
async function loadEvidence() {
  const select = document.getElementById("linkEvidenceSelect");
  try {
    const res = await fetch("/api/evidence");
    const evidence = await res.json();
    select.innerHTML = evidence.map((e) => {
      const displayName = e.filename.includes("_") ? e.filename.split("_").slice(1).join("_") : e.filename;
      return `<option value="${e.id}">#${e.id} ${displayName} (${e.verdict})</option>`;
    }).join("");
  } catch (err) {
    select.innerHTML = `<option>Could not load evidence</option>`;
  }
}

/* ---------------- link evidence to case ---------------- */
document.getElementById("linkForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const msgEl = document.getElementById("linkFormMsg");
  const caseId = document.getElementById("linkCaseSelect").value;
  const evidenceId = document.getElementById("linkEvidenceSelect").value;
  if (!caseId || !evidenceId) {
    showMsg(msgEl, "কেস আর evidence দুইটাই সিলেক্ট করুন।", false);
    return;
  }
  try {
    const res = await fetch(`/api/cases/${caseId}/link-evidence`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ evidence_image_id: parseInt(evidenceId) }),
    });
    if (!res.ok) throw new Error("Failed");
    showMsg(msgEl, "সংযুক্ত হয়েছে।", true);
  } catch (err) {
    showMsg(msgEl, "Error: " + err.message, false);
  }
});

loadCases();
loadEvidence();
