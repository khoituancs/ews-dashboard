// ============================================================
// app.js
// Gắn kết toàn bộ dashboard: đồng hồ, ticker, live simulation, bảng dữ liệu
// ============================================================

let currentRaw = null;
let liveInterval = null;
let isLive = true;
let prevScores = {}; // để so sánh tăng giảm cho hiệu ứng flash

// ---------- Lịch sử điểm số, phục vụ biểu đồ xu hướng theo thời gian ----------
const HISTORY_MAX = 60;
const HISTORY_MIN_GAP_MS = 200; // tránh dồn quá nhiều điểm khi kéo nhanh thanh trượt
let history = [];
let lastHistoryPush = 0;

function pushHistory(groupScores, raw) {
  const now = Date.now();
  if (now - lastHistoryPush < HISTORY_MIN_GAP_MS) return;
  lastHistoryPush = now;
  history.push({
    t: new Date(now),
    groupScores: { ...groupScores },
    raw: JSON.parse(JSON.stringify(raw)),
  });
  if (history.length > HISTORY_MAX) history.shift();
}

// ---------- Đồng hồ ----------
function updateClock() {
  const now = new Date();
  const pad = n => String(n).padStart(2, "0");
  document.getElementById("clock-time").textContent =
    `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())} ICT`;
  document.getElementById("clock-date").textContent =
    now.toLocaleDateString("vi-VN", { weekday: "short", day: "2-digit", month: "2-digit", year: "numeric" });
}

// ---------- Ticker tape ----------
function buildTicker(groupScores) {
  const track = document.getElementById("ticker-track");
  const items = Object.keys(RISK_GROUPS).map(k => {
    const g = RISK_GROUPS[k];
    const score = groupScores[k];
    const tier = scoreToTier(score);
    const arrow = score >= 50 ? "▲" : "▼";
    return `<span class="ticker-item" style="background:${tier.color}">${g.code} &nbsp; <span class="val">${score.toFixed(1)}</span> &nbsp; ${arrow}</span>`;
  }).join("");
  // Lặp lại 2 lần để cuộn liên tục không đứt đoạn
  track.innerHTML = items + items;
}

// ---------- Danh sách nhóm bên trái ----------
function buildGroupList(groupScores) {
  const list = document.getElementById("group-list");
  list.innerHTML = Object.keys(RISK_GROUPS).map(k => {
    const g = RISK_GROUPS[k];
    const score = groupScores[k];
    const tier = scoreToTier(score);
    return `<li class="group-row clickable" data-group="${k}" tabindex="0" role="button" aria-label="Xem định nghĩa nhóm ${g.name}">
      <span><span class="dot" style="background:${tier.color}"></span><span class="gcode">${g.code}</span><span class="gname">${g.name}</span></span>
      <span class="gscore" style="color:${tier.color}">${score.toFixed(1)}</span>
    </li>`;
  }).join("");
}

// ---------- Bảng chi tiết 28 chỉ báo ----------
function buildTable(rawValues) {
  const tbody = document.getElementById("table-body");
  let rows = "";
  Object.keys(RISK_GROUPS).forEach(gKey => {
    const group = RISK_GROUPS[gKey];
    group.indicators.forEach(ind => {
      const value = rawValues[gKey][ind.id];
      const score = normalizeIndicator(value, ind.thresholds, ind.inverse);
      const tier = scoreToTier(score);
      const rowId = `row-${gKey}-${ind.id}`;
      const prevScore = prevScores[rowId];
      let flashClass = "";
      if (prevScore !== undefined) {
        if (score > prevScore + 0.5) flashClass = "flash-up";
        else if (score < prevScore - 0.5) flashClass = "flash-down";
      }
      prevScores[rowId] = score;
      rows += `<tr id="${rowId}" class="clickable ${flashClass}" data-group="${gKey}" data-ind="${ind.id}" tabindex="0" role="button" aria-label="Xem định nghĩa chỉ báo ${ind.name}">
        <td style="color:#555">${group.code}${ind.id}</td>
        <td>${group.name}</td>
        <td style="color:#aaa">${ind.name}</td>
        <td style="text-align:right">${value.toFixed(2)}</td>
        <td style="color:#666">${ind.unit}</td>
        <td style="text-align:right; color:${tier.color}; font-weight:600">${score.toFixed(1)}</td>
        <td><span class="badge" style="background:${tier.color}22; color:${tier.color}; border:1px solid ${tier.color}">${tier.label}</span></td>
      </tr>`;
    });
  });
  tbody.innerHTML = rows;
}

// ---------- Cập nhật toàn bộ dashboard ----------
function updateDashboard(newRaw) {
  currentRaw = newRaw;
  const { groupScores, msi, fci, ewi } = computeAllScores(currentRaw);
  const tier = scoreToTier(ewi);

  document.getElementById("ewi-number").textContent = ewi.toFixed(1);
  document.getElementById("ewi-number").style.color = tier.color;
  document.getElementById("ewi-tier").textContent = `MỨC ${tier.label}, ${tier.short}`;
  document.getElementById("ewi-tier").style.color = tier.color;
  document.getElementById("msi-value").textContent = msi.toFixed(1);
  document.getElementById("fci-value").textContent = fci.toFixed(1);
  document.getElementById("ewi-updated").textContent = new Date().toLocaleTimeString("vi-VN");

  pushHistory(groupScores, currentRaw);

  buildTicker(groupScores);
  buildGroupList(groupScores);
  buildTable(currentRaw);
  renderMatrix(msi, fci);
  renderGroupTrend(history);
  renderHeatmap(currentRaw);
}

// ---------- Sự kiện chọn kịch bản hoặc kéo cường độ ----------
function applyScenario() {
  const scenarioKey = document.getElementById("scenario").value;
  const intensity = Number(document.getElementById("intensity").value) / 100;
  // Ghi đè mức độ nghiêm trọng tạm thời theo thanh trượt cường độ,
  // giữ nguyên hồ sơ (profile) cường độ tương đối giữa các nhóm của kịch bản
  const scenario = { ...SCENARIOS[scenarioKey], severity: intensity };
  SCENARIOS["_custom"] = scenario;
  const raw = generateRawValues("_custom");
  updateDashboard(raw);
}

function updateScenarioDesc() {
  const scenarioKey = document.getElementById("scenario").value;
  document.getElementById("scenario-desc").textContent = SCENARIOS[scenarioKey].desc || "";
}

document.getElementById("scenario").addEventListener("change", () => {
  const scenarioKey = document.getElementById("scenario").value;
  const baseline = SCENARIOS[scenarioKey].baseline ?? 15;
  document.getElementById("intensity").value = baseline;
  document.getElementById("intensity-val").textContent = baseline + "%";
  updateScenarioDesc();
  applyScenario();
});
document.getElementById("intensity").addEventListener("input", (e) => {
  document.getElementById("intensity-val").textContent = e.target.value + "%";
  applyScenario();
});
document.getElementById("btn-refresh").addEventListener("click", applyScenario);

document.getElementById("btn-live").addEventListener("click", (e) => {
  isLive = !isLive;
  e.target.textContent = isLive ? "Tạm dừng LIVE" : "Bật lại LIVE";
  if (isLive) startLiveSimulation();
  else clearInterval(liveInterval);
});

// ---------- Chế độ live: mỗi 3 giây dao động nhẹ quanh giá trị hiện tại ----------
function startLiveSimulation() {
  liveInterval = setInterval(() => {
    if (!currentRaw) return;
    const scenarioKey = document.getElementById("scenario").value;
    const nextRaw = generateRawValues(scenarioKey, true, currentRaw);
    updateDashboard(nextRaw);
  }, 3000);
}

// ---------- Khởi tạo ----------
function init() {
  updateClock();
  setInterval(updateClock, 1000);
  updateScenarioDesc();
  applyScenario();
  startLiveSimulation();
}

init();
