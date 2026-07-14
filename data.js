// ============================================================
// data.js
// Dữ liệu cấu hình cho VIFC Early Warning System Dashboard
// 7 nhóm rủi ro, 28 chỉ báo, ngưỡng theo Phần 3, trọng số theo Phần 4
// ============================================================

const RISK_GROUPS = {
  interest_rate: {
    name: "Biến động lãi suất",
    code: "IRT",
    tier: "MSI",
    desc: "Đo lường mức độ biến động bất thường của lãi suất trên thị trường tiền tệ và trái phiếu, phản ánh áp lực thanh khoản hệ thống và kỳ vọng chính sách tiền tệ.",
    indicators: [
      { id: "a", name: "Lãi suất liên ngân hàng, thay đổi/ngày", unit: "bps", thresholds: [30, 50, 100],
        desc: "Mức thay đổi tuyệt đối trong ngày của lãi suất cho vay qua đêm trên thị trường liên ngân hàng. Biến động lớn cho thấy căng thẳng thanh khoản đột ngột giữa các tổ chức tín dụng." },
      { id: "b", name: "Chênh lệch huy động/cho vay, thay đổi", unit: "%", thresholds: [10, 20, 30],
        desc: "Tốc độ thay đổi của biên độ giữa lãi suất huy động và cho vay. Chênh lệch giãn nhanh phản ánh rủi ro định giá lại hoặc áp lực cạnh tranh huy động vốn." },
      { id: "c", name: "Biến động lợi suất trái phiếu", unit: "bps", thresholds: [15, 25, 40],
        desc: "Độ biến động lợi suất trái phiếu chính phủ hoặc doanh nghiệp trong phiên, phản ánh kỳ vọng thị trường về lạm phát, chính sách tiền tệ và rủi ro tín dụng." },
      { id: "d", name: "Chênh lệch với SOFR/SORA", unit: "bps", thresholds: [100, 150, 200],
        desc: "Mức chênh lệch giữa lãi suất trong nước và lãi suất tham chiếu quốc tế (SOFR/SORA), phản ánh áp lực chi phí vốn ngoại tệ và rủi ro chênh lệch lãi suất xuyên biên giới." },
    ],
  },
  fx_risk: {
    name: "Rủi ro tỷ giá",
    code: "FXR",
    tier: "MSI",
    desc: "Đo lường áp lực và biến động bất thường của tỷ giá hối đoái, phản ánh rủi ro dòng vốn, kỳ vọng phá giá và độ ổn định kinh tế vĩ mô.",
    indicators: [
      { id: "a", name: "Biến động tỷ giá trong phiên", unit: "%", thresholds: [1, 2, 3],
        desc: "Biên độ dao động tỷ giá giao ngay trong một phiên giao dịch. Biến động vượt ngưỡng cho thấy áp lực cung cầu ngoại tệ bất thường." },
      { id: "b", name: "Chênh lệch giao ngay/kỳ hạn, thay đổi", unit: "%", thresholds: [15, 25, 40],
        desc: "Tốc độ thay đổi chênh lệch giữa tỷ giá giao ngay và tỷ giá kỳ hạn, phản ánh kỳ vọng thị trường về biến động tỷ giá trong tương lai gần." },
      { id: "c", name: "Khối lượng phái sinh tiền tệ", unit: "% TB", thresholds: [150, 200, 300],
        desc: "Khối lượng giao dịch phái sinh ngoại tệ so với trung bình, phản ánh nhu cầu phòng vệ rủi ro tỷ giá tăng đột biến của thị trường." },
      { id: "d", name: "Chỉ số áp lực tỷ giá, EMPI", unit: "lần SD", thresholds: [1, 1.5, 2],
        desc: "Exchange Market Pressure Index, tổng hợp biến động tỷ giá, dự trữ ngoại hối và lãi suất thành một chỉ số áp lực duy nhất, tính theo số lần độ lệch chuẩn." },
    ],
  },
  capital_flow: {
    name: "Dòng vốn ra vào bất thường",
    code: "CAP",
    tier: "FCI",
    desc: "Theo dõi dòng vốn ra vào bất thường qua các kênh đầu tư gián tiếp, cho vay xuyên biên giới và tài khoản vốn ngoại tệ, cảnh báo sớm nguy cơ đảo chiều dòng vốn.",
    indicators: [
      { id: "a", name: "FPI ròng theo tuần / vốn hoá", unit: "%", thresholds: [2, 5, 10],
        desc: "Giá trị mua/bán ròng của nhà đầu tư nước ngoài (Foreign Portfolio Investment) trong tuần so với vốn hoá thị trường, đo tốc độ rút vốn hoặc đổ vốn gián tiếp." },
      { id: "b", name: "Cho vay ra nước ngoài / vốn CSH", unit: "lần", thresholds: [1.5, 2, 2.7],
        desc: "Tỷ lệ dư nợ cho vay hoặc đầu tư ra nước ngoài so với vốn chủ sở hữu, phản ánh mức độ rủi ro tập trung ra bên ngoài của tổ chức." },
      { id: "c", name: "Vay ngắn hạn nội bộ / vốn tự có", unit: "%", thresholds: [15, 21, 27],
        desc: "Tỷ trọng vay ngắn hạn giữa các đơn vị nội bộ hoặc liên quan so với vốn tự có, cảnh báo rủi ro phụ thuộc vốn ngắn hạn nội bộ." },
      { id: "d", name: "Biến động số dư TK vốn ngoại tệ", unit: "%", thresholds: [10, 20, 30],
        desc: "Mức thay đổi số dư tài khoản vốn bằng ngoại tệ, phản ánh dòng vốn ngoại tệ ra vào bất thường qua cán cân vốn." },
    ],
  },
  asset_price: {
    name: "Biến động giá tài sản",
    code: "AST",
    tier: "MSI",
    desc: "Đo lường mức độ biến động giá bất thường trên thị trường tài sản tài chính (cổ phiếu, trái phiếu), có thể phản ánh hình thành bong bóng hoặc làn sóng bán tháo.",
    indicators: [
      { id: "a", name: "Biên độ dao động trong phiên", unit: "%", thresholds: [5, 7, 10],
        desc: "Biên độ dao động giá của chỉ số hoặc cổ phiếu đại diện trong một phiên giao dịch so với giá tham chiếu." },
      { id: "b", name: "Tỷ lệ mã chạm biên độ trần/sàn", unit: "%", thresholds: [5, 15, 30],
        desc: "Tỷ lệ số mã chứng khoán tăng trần hoặc giảm sàn trên tổng số mã giao dịch, phản ánh mức độ đồng thuận cực đoan của thị trường." },
      { id: "c", name: "Chênh lệch giá VIFC/quốc tế", unit: "%", thresholds: [1, 2, 3],
        desc: "Chênh lệch giá tài sản niêm yết trong nước so với giá tham chiếu hoặc tài sản tương đồng trên thị trường quốc tế." },
      { id: "d", name: "Chỉ số biến động kiểu VIX", unit: "điểm", thresholds: [15, 20, 30],
        desc: "Chỉ số đo lường kỳ vọng biến động ngụ ý của thị trường trong ngắn hạn, tương tự chỉ số VIX, phản ánh mức độ lo ngại rủi ro của nhà đầu tư." },
    ],
  },
  concentration: {
    name: "Mức tập trung giao dịch",
    code: "CON",
    tier: "FCI",
    desc: "Đo lường mức độ tập trung rủi ro tín dụng vào một khách hàng, nhóm khách hàng liên quan hoặc một số ít thành viên thị trường, làm tăng nguy cơ lan truyền khi một đối tác gặp sự cố.",
    indicators: [
      { id: "a", name: "Tín dụng 1 khách hàng / vốn tự có", unit: "%", thresholds: [5, 7, 9],
        desc: "Tỷ lệ dư nợ cấp cho một khách hàng đơn lẻ so với vốn tự có, giới hạn theo quy định an toàn vốn nhằm tránh rủi ro tập trung quá mức." },
      { id: "b", name: "Tín dụng KH và liên quan / vốn tự có", unit: "%", thresholds: [7.5, 10.5, 13.5],
        desc: "Tỷ lệ dư nợ cấp cho một khách hàng và các bên liên quan so với vốn tự có, phản ánh rủi ro tập trung theo nhóm khách hàng." },
      { id: "c", name: "Tín dụng bên liên quan nội bộ", unit: "%", thresholds: [2.5, 3.5, 4.5],
        desc: "Tỷ trọng tín dụng cấp cho các bên liên quan nội bộ (cổ đông lớn, người có liên quan) so với vốn tự có." },
      { id: "d", name: "CR5, 5 thành viên lớn nhất", unit: "%", thresholds: [40, 55, 70],
        desc: "Tỷ trọng giao dịch hoặc dư nợ của 5 thành viên/tổ chức lớn nhất trên tổng thị trường, đo mức độ tập trung hệ thống." },
    ],
  },
  liquidity: {
    name: "Rủi ro thanh khoản",
    code: "LIQ",
    tier: "FCI",
    desc: "Đo lường khả năng đáp ứng nghĩa vụ thanh toán ngắn hạn và mức độ an toàn vốn của tổ chức tài chính, cảnh báo sớm nguy cơ mất khả năng chi trả.",
    indicators: [
      { id: "a", name: "LCR, tỷ lệ khả năng chi trả", unit: "%", thresholds: [120, 100, 90], inverse: true,
        desc: "Liquidity Coverage Ratio, tỷ lệ tài sản thanh khoản chất lượng cao trên dòng tiền ra ròng trong 30 ngày căng thẳng. Tỷ lệ càng thấp, rủi ro thanh khoản càng cao." },
      { id: "b", name: "NSFR, nguồn vốn ổn định ròng", unit: "%", thresholds: [110, 100, 95], inverse: true,
        desc: "Net Stable Funding Ratio, tỷ lệ nguồn vốn ổn định sẵn có trên nguồn vốn ổn định cần thiết trong dài hạn. Tỷ lệ càng thấp, rủi ro mất cân đối kỳ hạn càng cao." },
      { id: "c", name: "Tỷ lệ đòn bẩy, Leverage Ratio", unit: "%", thresholds: [5, 4, 3], inverse: true,
        desc: "Tỷ lệ vốn cấp 1 trên tổng tài sản không điều chỉnh rủi ro, đo mức độ sử dụng đòn bẩy tài chính. Tỷ lệ càng thấp, mức độ đòn bẩy càng cao." },
      { id: "d", name: "Margin call / tổng ký quỹ", unit: "%", thresholds: [5, 10, 15],
        desc: "Tỷ lệ giá trị các lệnh gọi ký quỹ bổ sung so với tổng giá trị ký quỹ, phản ánh áp lực thanh khoản trên thị trường giao dịch ký quỹ." },
    ],
  },
  sentiment: {
    name: "Tâm lý và hành vi NĐT",
    code: "SNT",
    tier: "MSI",
    desc: "Đo lường tâm lý thị trường và hành vi giao dịch bất thường của nhà đầu tư, có thể là dấu hiệu sớm của hoảng loạn bán tháo hoặc thao túng thị trường.",
    indicators: [
      { id: "a", name: "Tỷ lệ lệnh hủy và sửa", unit: "%", thresholds: [20, 35, 50],
        desc: "Tỷ trọng lệnh bị hủy hoặc sửa trên tổng số lệnh đặt, tỷ lệ cao bất thường có thể phản ánh hành vi thao túng hoặc tâm lý bất ổn." },
      { id: "b", name: "Khối lượng giao dịch / TB 20 phiên", unit: "%", thresholds: [150, 200, 300],
        desc: "Khối lượng giao dịch hiện tại so với trung bình 20 phiên gần nhất, đo mức độ đột biến giao dịch của thị trường." },
      { id: "c", name: "Khiếu nại NĐT / TB 4 tuần", unit: "%", thresholds: [20, 50, 100],
        desc: "Số lượng khiếu nại của nhà đầu tư so với trung bình 4 tuần gần nhất, phản ánh mức độ bất mãn hoặc sự cố vận hành thị trường." },
      { id: "d", name: "Đánh giá rủi ro rửa tiền", unit: "điểm", thresholds: [25, 50, 75],
        desc: "Điểm đánh giá tổng hợp rủi ro rửa tiền và giao dịch bất thường dựa trên các mô hình giám sát giao dịch." },
    ],
  },
};

// Trọng số nhóm cho MSI và FCI, theo Phần 4 báo cáo
const MSI_WEIGHTS = { asset_price: 0.30, fx_risk: 0.25, sentiment: 0.25, interest_rate: 0.20 };
const FCI_WEIGHTS = { liquidity: 0.35, concentration: 0.35, capital_flow: 0.30 };
const EWI_PARAMS = { alpha: 0.4, beta: 0.4, gamma: 0.2 };

// ------------------------------------------------------------
// Kịch bản mô phỏng dựng sẵn
// Mỗi kịch bản có "profile": trọng số cường độ tương đối cho từng
// nhóm rủi ro (~0.2 nền thấp đến ~1.2 cực đoan), và "baseline":
// mức cường độ % mặc định gán cho thanh trượt khi chọn kịch bản.
// Cường độ áp cho mỗi nhóm = profile[nhóm] × (thanh trượt / 100).
// ------------------------------------------------------------
const SCENARIOS = {
  binh_thuong: {
    label: "BÌNH THƯỜNG",
    desc: "Thị trường vận hành ổn định, các chỉ báo dao động nhẹ quanh vùng an toàn, không nhóm rủi ro nào nổi trội.",
    baseline: 15,
    profile: { interest_rate: 0.30, fx_risk: 0.30, capital_flow: 0.30, asset_price: 0.35, concentration: 0.40, liquidity: 0.30, sentiment: 0.30 },
  },
  soc_lai_suat: {
    label: "SỐC LÃI SUẤT ĐỘT NGỘT",
    desc: "Ngân hàng trung ương tăng lãi suất bất ngờ, đường cong lợi suất biến động mạnh, thanh khoản liên ngân hàng căng thẳng.",
    baseline: 55,
    profile: { interest_rate: 1.10, fx_risk: 0.50, capital_flow: 0.35, asset_price: 0.55, concentration: 0.30, liquidity: 0.65, sentiment: 0.45 },
  },
  soc_ty_gia: {
    label: "SỐC TỶ GIÁ ĐỘT NGỘT",
    desc: "Tỷ giá biến động mạnh trong biên độ ngắn, áp lực phá giá gia tăng, nhà đầu tư đổ xô phòng vệ rủi ro ngoại hối.",
    baseline: 62,
    profile: { interest_rate: 0.40, fx_risk: 1.15, capital_flow: 0.60, asset_price: 0.40, concentration: 0.25, liquidity: 0.40, sentiment: 0.70 },
  },
  rut_von_ngoai: {
    label: "RÚT VỐN NGOẠI Ồ ẠT",
    desc: "Nhà đầu tư nước ngoài bán ròng và rút vốn quy mô lớn trong thời gian ngắn, áp lực lan sang tỷ giá và giá tài sản.",
    baseline: 58,
    profile: { interest_rate: 0.35, fx_risk: 0.75, capital_flow: 1.15, asset_price: 0.65, concentration: 0.30, liquidity: 0.45, sentiment: 0.55 },
  },
  bong_bong_tai_san: {
    label: "BONG BÓNG TÀI SẢN XÌ HƠI",
    desc: "Giá cổ phiếu và trái phiếu sụt giảm mạnh sau giai đoạn tăng nóng, biên độ dao động và tỷ lệ mã giảm sàn vượt ngưỡng.",
    baseline: 60,
    profile: { interest_rate: 0.30, fx_risk: 0.35, capital_flow: 0.50, asset_price: 1.15, concentration: 0.55, liquidity: 0.35, sentiment: 0.75 },
  },
  khung_hoang_thanh_khoan: {
    label: "KHỦNG HOẢNG THANH KHOẢN LIÊN NGÂN HÀNG",
    desc: "Các tổ chức tín dụng khó tiếp cận vốn ngắn hạn, lãi suất qua đêm tăng vọt, LCR và NSFR suy giảm nhanh.",
    baseline: 58,
    profile: { interest_rate: 0.65, fx_risk: 0.30, capital_flow: 0.30, asset_price: 0.35, concentration: 0.50, liquidity: 1.15, sentiment: 0.40 },
  },
  tap_trung_tin_dung: {
    label: "RỦI RO TẬP TRUNG TÍN DỤNG",
    desc: "Rủi ro dồn vào một số khách hàng hoặc thành viên lớn, nguy cơ lan truyền hệ thống khi một đối tác lớn gặp sự cố.",
    baseline: 50,
    profile: { interest_rate: 0.25, fx_risk: 0.20, capital_flow: 0.30, asset_price: 0.40, concentration: 1.15, liquidity: 0.60, sentiment: 0.35 },
  },
  hoang_loan_tam_ly: {
    label: "HOẢNG LOẠN TÂM LÝ ĐÁM ĐÔNG",
    desc: "Nhà đầu tư bán tháo theo tâm lý đám đông, khối lượng giao dịch và tỷ lệ hủy sửa lệnh tăng đột biến.",
    baseline: 65,
    profile: { interest_rate: 0.30, fx_risk: 0.55, capital_flow: 0.45, asset_price: 0.80, concentration: 0.35, liquidity: 0.40, sentiment: 1.15 },
  },
  lay_lan_khu_vuc: {
    label: "LÂY LAN KHỦNG HOẢNG KHU VỰC",
    desc: "Khủng hoảng từ thị trường lân cận lan truyền qua kênh tỷ giá, dòng vốn và tâm lý nhà đầu tư trong nước.",
    baseline: 66,
    profile: { interest_rate: 0.55, fx_risk: 0.85, capital_flow: 0.85, asset_price: 0.60, concentration: 0.40, liquidity: 0.55, sentiment: 0.80 },
  },
  khung_hoang_toan_dien: {
    label: "KHỦNG HOẢNG TOÀN DIỆN",
    desc: "Rủi ro bùng phát đồng loạt trên toàn bộ 7 nhóm, hệ thống tài chính chịu áp lực nghiêm trọng ở mọi tuyến phòng thủ.",
    baseline: 88,
    profile: { interest_rate: 0.95, fx_risk: 1.00, capital_flow: 0.95, asset_price: 1.00, concentration: 0.90, liquidity: 1.00, sentiment: 1.00 },
  },
  phuc_hoi_sau_khung_hoang: {
    label: "PHỤC HỒI SAU KHỦNG HOẢNG",
    desc: "Căng thẳng hạ nhiệt dần sau cú sốc, phần lớn chỉ báo về vùng an toàn nhưng thanh khoản và tập trung tín dụng còn dư âm.",
    baseline: 32,
    profile: { interest_rate: 0.30, fx_risk: 0.35, capital_flow: 0.30, asset_price: 0.30, concentration: 0.55, liquidity: 0.50, sentiment: 0.30 },
  },
  tang_truong_nong: {
    label: "TĂNG TRƯỞNG NÓNG, QUÁ NHIỆT",
    desc: "Dòng vốn đổ vào mạnh, giá tài sản tăng nóng và tín dụng tập trung cao dù rủi ro tức thời còn ở mức thấp, tiềm ẩn nguy cơ đảo chiều.",
    baseline: 40,
    profile: { interest_rate: 0.30, fx_risk: 0.35, capital_flow: 0.75, asset_price: 0.85, concentration: 0.80, liquidity: 0.35, sentiment: 0.50 },
  },
};
