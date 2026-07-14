// ============================================================
// calculations.js
// Chuẩn hóa chỉ báo, tính điểm nhóm, MSI, FCI, VIFC-EWI
// ============================================================

// Chuyển giá trị thô thành điểm 0-100 dựa trên 3 ngưỡng cắt (Xanh|Vàng|Cam|Đỏ)
function normalizeIndicator(value, thresholds, inverse = false) {
  const [t1, t2, t3] = thresholds;
  let raw;
  if (!inverse) {
    if (value < t1) raw = (value / t1) * 25;
    else if (value < t2) raw = 25 + ((value - t1) / (t2 - t1)) * 25;
    else if (value < t3) raw = 50 + ((value - t2) / (t3 - t2)) * 25;
    else raw = Math.min(100, 75 + ((value - t3) / t3) * 25);
  } else {
    if (value > t1) raw = Math.max(0, 25 - ((value - t1) / t1) * 25);
    else if (value > t2) raw = 25 + ((t1 - value) / (t1 - t2)) * 25;
    else if (value > t3) raw = 50 + ((t2 - value) / (t2 - t3)) * 25;
    else raw = Math.min(100, 75 + ((t3 - value) / Math.max(t3, 1)) * 25);
  }
  return Math.max(0, Math.min(100, raw));
}

function computeGroupScore(groupKey, rawValues) {
  const group = RISK_GROUPS[groupKey];
  const scores = group.indicators.map(ind =>
    normalizeIndicator(rawValues[groupKey][ind.id], ind.thresholds, ind.inverse)
  );
  return scores.reduce((a, b) => a + b, 0) / scores.length;
}

function computeAllScores(rawValues) {
  const groupScores = {};
  Object.keys(RISK_GROUPS).forEach(key => {
    groupScores[key] = computeGroupScore(key, rawValues);
  });

  const msi = Object.entries(MSI_WEIGHTS).reduce((sum, [k, w]) => sum + w * groupScores[k], 0);
  const fci = Object.entries(FCI_WEIGHTS).reduce((sum, [k, w]) => sum + w * groupScores[k], 0);
  const { alpha, beta, gamma } = EWI_PARAMS;
  const ewi = alpha * msi + beta * fci + gamma * (msi * fci / 100);

  return { groupScores, msi, fci, ewi };
}

function scoreToTier(score) {
  if (score < 25) return { label: "XANH", short: "AN TOÀN", color: "#00C805" };
  if (score < 50) return { label: "VÀNG", short: "THEO DÕI", color: "#FFCC00" };
  if (score < 75) return { label: "CAM", short: "CẢNH BÁO", color: "#FF9900" };
  return { label: "ĐỎ", short: "KHẨN CẤP", color: "#FF3B30" };
}

// Sinh dữ liệu thô mô phỏng từ 1 kịch bản, có thể cộng thêm nhiễu ngẫu nhiên nhỏ (chế độ live)
// Cường độ mỗi nhóm = profile[nhóm] của kịch bản × mức độ nghiêm trọng tổng thể (severity, 0 đến 1)
function generateRawValues(scenarioKey, jitterOnly = false, prevRaw = null) {
  const scenario = SCENARIOS[scenarioKey];
  const severity = scenario.severity !== undefined ? scenario.severity : scenario.baseline / 100;
  const raw = {};
  Object.keys(RISK_GROUPS).forEach(gKey => {
    raw[gKey] = {};
    const intensity = (scenario.profile[gKey] ?? 0.3) * severity;
    RISK_GROUPS[gKey].indicators.forEach(ind => {
      const t3 = ind.thresholds[2];
      if (jitterOnly && prevRaw && prevRaw[gKey]) {
        // chế độ live: dao động nhỏ quanh giá trị hiện tại
        const base = prevRaw[gKey][ind.id];
        const jitter = (Math.random() - 0.5) * t3 * 0.06;
        let next = base + jitter;
        next = Math.max(0, next);
        raw[gKey][ind.id] = next;
      } else {
        const noise = 0.8 + Math.random() * 0.4;
        raw[gKey][ind.id] = ind.inverse
          ? ind.thresholds[0] * (1 - intensity * noise * 0.5)
          : t3 * intensity * noise;
      }
    });
  });
  return raw;
}
