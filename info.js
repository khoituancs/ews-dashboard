// ============================================================
// info.js
// Bảng chú giải tương tác: nhấn vào EWI, MSI, FCI, nhóm rủi ro
// hoặc chỉ báo để xem định nghĩa và công thức tính.
// ============================================================

const TIER_COLORS = ["#00C805", "#FFCC00", "#FF9900", "#FF3B30"];

function thresholdRangeText(ind) {
  const [t1, t2, t3] = ind.thresholds;
  const u = ind.unit;
  if (ind.inverse) {
    return [
      `Xanh &nbsp;·&nbsp; ≥ ${t1} ${u}`,
      `Vàng &nbsp;·&nbsp; ${t2} – ${t1} ${u}`,
      `Cam &nbsp;·&nbsp; ${t3} – ${t2} ${u}`,
      `Đỏ &nbsp;·&nbsp; < ${t3} ${u}`,
    ];
  }
  return [
    `Xanh &nbsp;·&nbsp; < ${t1} ${u}`,
    `Vàng &nbsp;·&nbsp; ${t1} – ${t2} ${u}`,
    `Cam &nbsp;·&nbsp; ${t2} – ${t3} ${u}`,
    `Đỏ &nbsp;·&nbsp; > ${t3} ${u}`,
  ];
}

function buildIndicatorInfoHTML(gKey, indId) {
  const group = RISK_GROUPS[gKey];
  const ind = group.indicators.find(i => i.id === indId);
  const ranges = thresholdRangeText(ind);

  let currentBlock = "";
  if (currentRaw && currentRaw[gKey]) {
    const value = currentRaw[gKey][indId];
    const score = normalizeIndicator(value, ind.thresholds, ind.inverse);
    const tier = scoreToTier(score);
    currentBlock = `
      <div class="info-current">
        <span>Giá trị hiện tại</span><strong>${value.toFixed(2)} ${ind.unit}</strong>
      </div>
      <div class="info-current">
        <span>Điểm chuẩn hoá</span><strong style="color:${tier.color}">${score.toFixed(1)} / 100 &nbsp;·&nbsp; ${tier.label}</strong>
      </div>`;
  }

  return `
    <div class="info-def">${ind.desc || ""}</div>
    <div class="info-formula">
      <div class="info-formula-label">CÔNG THỨC CHUẨN HOÁ ĐIỂM, 0 ĐẾN 100</div>
      <code>Điểm = nội suy tuyến tính(giá trị thô, ngưỡng Xanh/Vàng/Cam/Đỏ)</code>
      <div class="info-formula-sub">${ind.inverse ? "Chiều đảo ngược: giá trị càng thấp, rủi ro và điểm càng cao." : "Chiều thuận: giá trị càng cao, rủi ro và điểm càng cao."}</div>
    </div>
    <div class="info-thresholds">
      ${ranges.map((t, i) => `<div class="info-th-row" style="color:${TIER_COLORS[i]}">${t}</div>`).join("")}
    </div>
    ${currentBlock}
    <div class="info-meta">Thuộc nhóm <span class="info-link" data-group="${gKey}">${group.code} · ${group.name}</span> &nbsp;·&nbsp; Mã chỉ báo <strong>${group.code}${indId}</strong></div>
  `;
}

function buildGroupInfoHTML(gKey) {
  const group = RISK_GROUPS[gKey];
  const isMSI = MSI_WEIGHTS[gKey] !== undefined;
  const weight = isMSI ? MSI_WEIGHTS[gKey] : FCI_WEIGHTS[gKey];
  const parentLabel = isMSI ? "MSI · Chỉ số căng thẳng thị trường tức thời" : "FCI · Chỉ số điều kiện tài chính nền";
  const parentType = isMSI ? "msi" : "fci";

  let currentBlock = "";
  if (currentRaw) {
    const score = computeGroupScore(gKey, currentRaw);
    const tier = scoreToTier(score);
    currentBlock = `<div class="info-current"><span>Điểm nhóm hiện tại</span><strong style="color:${tier.color}">${score.toFixed(1)} / 100 &nbsp;·&nbsp; ${tier.label}</strong></div>`;
  }

  const indList = group.indicators.map(ind =>
    `<li class="info-link" data-group="${gKey}" data-ind="${ind.id}">${group.code}${ind.id} &nbsp;—&nbsp; ${ind.name}</li>`
  ).join("");

  return `
    <div class="info-def">${group.desc}</div>
    <div class="info-formula">
      <div class="info-formula-label">CÔNG THỨC ĐIỂM NHÓM</div>
      <code>Điểm nhóm = trung bình cộng điểm chuẩn hoá của 4 chỉ báo (a, b, c, d)</code>
    </div>
    <div class="info-meta">Đóng góp vào <span class="info-link" data-composite="${parentType}">${parentLabel}</span> với trọng số <strong>${(weight * 100).toFixed(0)}%</strong></div>
    ${currentBlock}
    <div class="info-formula-label" style="margin-top:12px;">4 CHỈ BÁO THÀNH PHẦN</div>
    <ul class="info-ind-list">${indList}</ul>
  `;
}

function buildCompositeWeightRows(weights) {
  return Object.entries(weights).map(([k, w]) => `
    <div class="info-th-row">
      <span class="info-link" data-group="${k}">${RISK_GROUPS[k].code} · ${RISK_GROUPS[k].name}</span>
      <strong>${(w * 100).toFixed(0)}%</strong>
    </div>`).join("");
}

function buildCompositeInfoHTML(type) {
  if (type === "msi") {
    let currentBlock = "";
    if (currentRaw) {
      const { msi } = computeAllScores(currentRaw);
      const tier = scoreToTier(msi);
      currentBlock = `<div class="info-current"><span>Giá trị hiện tại</span><strong style="color:${tier.color}">${msi.toFixed(1)} / 100 &nbsp;·&nbsp; ${tier.label}</strong></div>`;
    }
    return `
      <div class="info-def">Market Stress Index, chỉ số tổng hợp đo mức độ căng thẳng thị trường tức thời, tổng hợp từ các nhóm biến động nhanh: lãi suất, tỷ giá, giá tài sản và tâm lý nhà đầu tư.</div>
      <div class="info-formula">
        <div class="info-formula-label">CÔNG THỨC</div>
        <code>MSI = Σ (trọng số nhóm × điểm nhóm)</code>
      </div>
      <div class="info-thresholds">${buildCompositeWeightRows(MSI_WEIGHTS)}</div>
      ${currentBlock}
    `;
  }
  if (type === "fci") {
    let currentBlock = "";
    if (currentRaw) {
      const { fci } = computeAllScores(currentRaw);
      const tier = scoreToTier(fci);
      currentBlock = `<div class="info-current"><span>Giá trị hiện tại</span><strong style="color:${tier.color}">${fci.toFixed(1)} / 100 &nbsp;·&nbsp; ${tier.label}</strong></div>`;
    }
    return `
      <div class="info-def">Financial Conditions Index, chỉ số tổng hợp đo điều kiện tài chính nền, tổng hợp từ các nhóm biến động chậm hơn nhưng mang tính cấu trúc: thanh khoản, tập trung tín dụng và dòng vốn.</div>
      <div class="info-formula">
        <div class="info-formula-label">CÔNG THỨC</div>
        <code>FCI = Σ (trọng số nhóm × điểm nhóm)</code>
      </div>
      <div class="info-thresholds">${buildCompositeWeightRows(FCI_WEIGHTS)}</div>
      ${currentBlock}
    `;
  }
  // ewi
  const { alpha, beta, gamma } = EWI_PARAMS;
  let currentBlock = "";
  if (currentRaw) {
    const { msi, fci, ewi } = computeAllScores(currentRaw);
    const tier = scoreToTier(ewi);
    currentBlock = `
      <div class="info-current"><span>MSI hiện tại</span><strong class="info-link" data-composite="msi">${msi.toFixed(1)}</strong></div>
      <div class="info-current"><span>FCI hiện tại</span><strong class="info-link" data-composite="fci">${fci.toFixed(1)}</strong></div>
      <div class="info-current"><span>VIFC-EWI hiện tại</span><strong style="color:${tier.color}">${ewi.toFixed(1)} / 100 &nbsp;·&nbsp; ${tier.label}</strong></div>
    `;
  }
  return `
    <div class="info-def">VIFC Early Warning Index, chỉ số cảnh báo sớm tổng hợp toàn hệ thống trên thang điểm 0 đến 100, kết hợp căng thẳng tức thời (MSI) và điều kiện nền (FCI), cộng thêm số hạng tương tác phản ánh rủi ro khuếch đại khi cả hai cùng tăng cao.</div>
    <div class="info-formula">
      <div class="info-formula-label">CÔNG THỨC</div>
      <code>EWI = α×MSI + β×FCI + γ×(MSI×FCI/100)</code>
      <div class="info-formula-sub">α = ${alpha}, β = ${beta}, γ = ${gamma}</div>
    </div>
    ${currentBlock}
    <div class="info-meta">4 mức cảnh báo: Xanh (0-25) an toàn, Vàng (25-50) theo dõi, Cam (50-75) cảnh báo, Đỏ (75-100) khẩn cấp.</div>
  `;
}

// ---------- Mở / đóng modal ----------
function openInfoModal(tag, title, bodyHTML) {
  document.getElementById("info-modal-tag").textContent = tag;
  document.getElementById("info-modal-title").textContent = title;
  document.getElementById("info-modal-body").innerHTML = bodyHTML;
  document.getElementById("info-modal-overlay").classList.add("open");
}

function closeInfoModal() {
  document.getElementById("info-modal-overlay").classList.remove("open");
}

function showIndicatorInfo(gKey, indId) {
  const group = RISK_GROUPS[gKey];
  const ind = group.indicators.find(i => i.id === indId);
  openInfoModal("CHỈ BÁO", `${group.code}${indId} · ${ind.name}`, buildIndicatorInfoHTML(gKey, indId));
}

function showGroupInfo(gKey) {
  const group = RISK_GROUPS[gKey];
  openInfoModal(group.tier === "MSI" ? "NHÓM · MSI" : "NHÓM · FCI", `${group.code} · ${group.name}`, buildGroupInfoHTML(gKey));
}

function showCompositeInfo(type) {
  const titles = {
    msi: "MSI · CHỈ SỐ CĂNG THẲNG THỊ TRƯỜNG",
    fci: "FCI · CHỈ SỐ ĐIỀU KIỆN TÀI CHÍNH",
    ewi: "VIFC-EWI · CHỈ SỐ CẢNH BÁO SỚM TỔNG HỢP",
  };
  openInfoModal("CHỈ SỐ TỔNG HỢP", titles[type], buildCompositeInfoHTML(type));
}

// ---------- Gắn sự kiện ----------
document.getElementById("ewi-number").addEventListener("click", () => showCompositeInfo("ewi"));
document.getElementById("ewi-tier").addEventListener("click", () => showCompositeInfo("ewi"));
document.getElementById("msi-metric").addEventListener("click", () => showCompositeInfo("msi"));
document.getElementById("fci-metric").addEventListener("click", () => showCompositeInfo("fci"));
document.getElementById("matrix-msi-fci").addEventListener("click", () => showCompositeInfo("ewi"));

document.getElementById("group-list").addEventListener("click", (e) => {
  const row = e.target.closest("[data-group]");
  if (row) showGroupInfo(row.dataset.group);
});

document.getElementById("table-body").addEventListener("click", (e) => {
  const row = e.target.closest("tr[data-group]");
  if (row) showIndicatorInfo(row.dataset.group, row.dataset.ind);
});

// Cho phép kích hoạt bằng bàn phím, Enter hoặc Space, trên các phần tử có role="button"
document.addEventListener("keydown", (e) => {
  if (e.key !== "Enter" && e.key !== " ") return;
  const el = e.target.closest('[role="button"]');
  if (el) {
    e.preventDefault();
    el.click();
  }
});

// Điều hướng chéo bên trong nội dung modal, ví dụ từ chỉ báo sang nhóm, từ nhóm sang MSI/FCI
document.getElementById("info-modal-body").addEventListener("click", (e) => {
  const link = e.target.closest("[data-ind]");
  if (link) { showIndicatorInfo(link.dataset.group, link.dataset.ind); return; }
  const groupLink = e.target.closest("[data-group]");
  if (groupLink) { showGroupInfo(groupLink.dataset.group); return; }
  const compositeLink = e.target.closest("[data-composite]");
  if (compositeLink) { showCompositeInfo(compositeLink.dataset.composite); }
});

document.getElementById("info-modal-close").addEventListener("click", closeInfoModal);
document.getElementById("info-modal-overlay").addEventListener("click", (e) => {
  if (e.target.id === "info-modal-overlay") closeInfoModal();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeInfoModal();
});
