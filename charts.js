// ============================================================
// charts.js
// Vẽ biểu đồ Plotly theo theme Bloomberg: nền đen, cam, xanh, đỏ
// ============================================================

const PLOT_FONT = { family: "IBM Plex Mono, Consolas, monospace", color: "#E8E8E8", size: 11 };
const PLOT_BASE_LAYOUT = {
  paper_bgcolor: "#0a0a0a",
  plot_bgcolor: "#0a0a0a",
  font: PLOT_FONT,
  margin: { t: 30, l: 40, r: 20, b: 40 },
};
const PLOT_CONFIG = { displayModeBar: false, responsive: true };

function renderMatrix(msi, fci) {
  const tier = scoreToTier((msi + fci) / 2);
  const trace = [{
    x: [fci], y: [msi], mode: "markers+text",
    marker: { size: 22, color: "#FF9900", line: { color: "#000", width: 2 } },
    type: "scatter", showlegend: false,
    text: ["●"], textposition: "middle center",
  }];
  const layout = {
    ...PLOT_BASE_LAYOUT,
    title: { text: "MA TRẬN MSI / FCI", font: { ...PLOT_FONT, size: 12 } },
    xaxis: { title: "FCI, điều kiện nền", range: [0, 100], gridcolor: "#222", color: "#8a8a8a" },
    yaxis: { title: "MSI, căng thẳng tức thời", range: [0, 100], gridcolor: "#222", color: "#8a8a8a" },
    shapes: [
      { type: "rect", x0: 0, x1: 50, y0: 0, y1: 50, fillcolor: "#00C805", opacity: 0.12, line: { width: 0 } },
      { type: "rect", x0: 50, x1: 100, y0: 0, y1: 50, fillcolor: "#FFCC00", opacity: 0.12, line: { width: 0 } },
      { type: "rect", x0: 0, x1: 50, y0: 50, y1: 100, fillcolor: "#FF9900", opacity: 0.12, line: { width: 0 } },
      { type: "rect", x0: 50, x1: 100, y0: 50, y1: 100, fillcolor: "#FF3B30", opacity: 0.12, line: { width: 0 } },
      { type: "line", x0: 50, x1: 50, y0: 0, y1: 100, line: { color: "#3d3d3d", width: 1, dash: "dot" } },
      { type: "line", x0: 0, x1: 100, y0: 50, y1: 50, line: { color: "#3d3d3d", width: 1, dash: "dot" } },
    ],
  };
  Plotly.newPlot("matrix-msi-fci", trace, layout, PLOT_CONFIG);
}

// Màu nhận diện riêng cho từng nhóm rủi ro trên biểu đồ xu hướng, tách biệt
// với 4 màu mức cảnh báo (xanh/vàng/cam/đỏ) để tránh nhầm lẫn ý nghĩa
const GROUP_COLORS = {
  interest_rate: "#3399FF",
  fx_risk: "#FF33CC",
  capital_flow: "#9966FF",
  asset_price: "#33CCFF",
  concentration: "#CCCCCC",
  liquidity: "#66FFAA",
  sentiment: "#FF6699",
};

// history: mảng { t: Date, groupScores: {...}, raw: {...} }, tích luỹ theo thời gian thực
function renderGroupTrend(history) {
  const keys = Object.keys(RISK_GROUPS);
  const xs = history.map(h => h.t);
  const traces = keys.map(k => ({
    x: xs,
    y: history.map(h => h.groupScores[k]),
    mode: history.length > 1 ? "lines+markers" : "markers",
    type: "scatter",
    name: RISK_GROUPS[k].code,
    line: { color: GROUP_COLORS[k], width: 2 },
    marker: { color: GROUP_COLORS[k], size: 4 },
    hovertemplate: `${RISK_GROUPS[k].code} %{y:.1f}<extra></extra>`,
  }));
  const layout = {
    ...PLOT_BASE_LAYOUT,
    title: { text: "XU HƯỚNG 7 NHÓM RỦI RO THEO THỜI GIAN", font: { ...PLOT_FONT, size: 12 } },
    xaxis: { type: "date", tickformat: "%H:%M:%S", gridcolor: "#222", color: "#8a8a8a" },
    yaxis: { title: "Điểm, 0 đến 100", range: [0, 100], gridcolor: "#222", color: "#8a8a8a" },
    shapes: [
      { type: "rect", xref: "paper", x0: 0, x1: 1, y0: 0, y1: 25, fillcolor: "#00C805", opacity: 0.06, line: { width: 0 } },
      { type: "rect", xref: "paper", x0: 0, x1: 1, y0: 25, y1: 50, fillcolor: "#FFCC00", opacity: 0.06, line: { width: 0 } },
      { type: "rect", xref: "paper", x0: 0, x1: 1, y0: 50, y1: 75, fillcolor: "#FF9900", opacity: 0.06, line: { width: 0 } },
      { type: "rect", xref: "paper", x0: 0, x1: 1, y0: 75, y1: 100, fillcolor: "#FF3B30", opacity: 0.06, line: { width: 0 } },
    ],
    legend: { orientation: "h", font: { size: 9 }, y: -0.22 },
    margin: { t: 30, l: 45, r: 10, b: 55 },
    showlegend: true,
  };
  Plotly.newPlot("trend-groups", traces, layout, PLOT_CONFIG).then(gd => {
    gd.on("plotly_click", (data) => {
      const pt = data.points[0];
      const key = keys[pt.curveNumber];
      if (key && typeof showGroupInfo === "function") showGroupInfo(key);
    });
  });
}

// Ma trận nhanh 7 nhóm × 4 chỉ báo tại thời điểm hiện tại, mỗi ô ghi mã ký hiệu chỉ báo
function renderHeatmap(rawValues) {
  const groups = Object.keys(RISK_GROUPS);
  const z = groups.map(g => RISK_GROUPS[g].indicators.map(ind =>
    normalizeIndicator(rawValues[g][ind.id], ind.thresholds, ind.inverse)
  ));
  const y = groups.map(g => `${RISK_GROUPS[g].code}  ${RISK_GROUPS[g].name}`);
  const x = ["(a)", "(b)", "(c)", "(d)"];
  const cellLabels = groups.map(g => RISK_GROUPS[g].indicators.map(ind => `${RISK_GROUPS[g].code}${ind.id}`));
  const hoverText = groups.map(g => RISK_GROUPS[g].indicators.map(ind => {
    const v = rawValues[g][ind.id];
    return `${RISK_GROUPS[g].code}${ind.id} · ${ind.name}<br>${v.toFixed(2)} ${ind.unit}`;
  }));
  const trace = [{
    z, x, y, type: "heatmap",
    text: cellLabels,
    texttemplate: "%{text}",
    textfont: { size: 10, color: "#000" },
    customdata: hoverText,
    hovertemplate: "%{customdata}<extra></extra>",
    colorscale: [
      [0, "#00C805"], [0.25, "#00C805"],
      [0.25, "#FFCC00"], [0.5, "#FFCC00"],
      [0.5, "#FF9900"], [0.75, "#FF9900"],
      [0.75, "#FF3B30"], [1, "#FF3B30"],
    ],
    zmin: 0, zmax: 100,
    showscale: false,
    xgap: 3, ygap: 3,
  }];
  const layout = {
    ...PLOT_BASE_LAYOUT,
    title: { text: "HEATMAP (CHI TIẾT 28 CHỈ BÁO)", font: { ...PLOT_FONT, size: 12 } },
    margin: { t: 30, l: 200, r: 20, b: 30 },
    xaxis: { color: "#8a8a8a" },
    yaxis: { color: "#E8E8E8", automargin: true },
  };
  Plotly.newPlot("heatmap-indicators", trace, layout, PLOT_CONFIG).then(gd => {
    gd.on("plotly_click", (data) => {
      const pt = data.points[0];
      const rowIdx = y.indexOf(pt.y);
      const colIdx = x.indexOf(pt.x);
      if (rowIdx === -1 || colIdx === -1) return;
      const gKey = groups[rowIdx];
      const indId = RISK_GROUPS[gKey].indicators[colIdx].id;
      if (typeof showIndicatorInfo === "function") showIndicatorInfo(gKey, indId);
    });
  });
}
