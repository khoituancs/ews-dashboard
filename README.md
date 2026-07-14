# VIFC EWS Dashboard

Bảng điều khiển minh họa cho hệ thống cảnh báo sớm rủi ro thị trường tại VIFC, phong cách Bloomberg Terminal.
Toàn bộ tính toán chạy trong trình duyệt, không cần backend, không cần cài Node.js.

## Cấu trúc file

```
vifc-dashboard/
├── index.html          # Giao diện chính
├── style.css           # Theme Bloomberg (nền đen, cam, monospace)
├── data.js             # 7 nhóm, 28 chỉ báo, ngưỡng, trọng số
├── calculations.js     # Công thức chuẩn hóa, MSI, FCI, VIFC-EWI
├── charts.js           # Vẽ biểu đồ Plotly (ma trận, radar, heatmap)
├── app.js              # Đồng hồ, ticker, mô phỏng live, bảng dữ liệu
└── README.md
```

## Cách 1: Chạy nhanh nhất, không cần cài gì

Mở file `index.html` bằng cách nhấp đúp chuột. Dashboard chạy ngay trong trình duyệt.

Lưu ý: một số trình duyệt (Chrome) có thể chặn việc các file JS load lẫn nhau khi mở trực tiếp bằng `file://`. Nếu gặp màn hình trắng, dùng Cách 2 bên dưới.

## Cách 2: Dùng VS Code và Live Server (khuyến nghị khi phát triển)

1. Mở thư mục `vifc-dashboard` bằng VS Code.
2. Cài extension "Live Server" của Ritwick Dey (mục Extensions, tìm "Live Server").
3. Nhấp chuột phải vào `index.html`, chọn "Open with Live Server".
4. Trình duyệt tự mở tại địa chỉ dạng `http://127.0.0.1:5500`, tự tải lại khi bạn sửa code.

## Cách 3: Dùng Python có sẵn (nếu không muốn cài extension)

Mở terminal tại thư mục dự án:

```bash
# Python 3
python3 -m http.server 8000
```

Sau đó mở trình duyệt tại `http://localhost:8000`.

## Đưa lên GitHub và chạy online miễn phí bằng GitHub Pages

```bash
cd vifc-dashboard
git init
git add .
git commit -m "Khoi tao dashboard canh bao som VIFC"
```

Vào github.com, tạo repository mới tên `vifc-ews-dashboard`, để công khai (Public), không tick khởi tạo README vì đã có sẵn.

```bash
git remote add origin https://github.com/<ten-tai-khoan>/vifc-ews-dashboard.git
git branch -M main
git push -u origin main
```

Vào repository trên GitHub, chọn **Settings**, chọn mục **Pages** ở thanh bên trái, ở phần Source chọn nhánh `main` và thư mục gốc `/ (root)`, bấm **Save**. Sau khoảng một phút, GitHub trả về địa chỉ dạng:

```
https://<ten-tai-khoan>.github.io/vifc-ews-dashboard/
```

Đây là link công khai, ổn định, miễn phí vĩnh viễn, dùng để chèn vào báo cáo Word hoặc trình chiếu trực tiếp trước hội đồng.

## Cách dùng dashboard

- **Chọn kịch bản**: 4 kịch bản dựng sẵn (Bình thường, Sốc tỷ giá, Khủng hoảng thanh khoản, Khủng hoảng toàn diện), mỗi kịch bản kích hoạt các nhóm rủi ro tương ứng tăng cao.
- **Cường độ tùy chỉnh**: kéo thanh trượt để tự chỉnh mức độ nghiêm trọng, độc lập với kịch bản đã chọn.
- **Cập nhật ngay**: áp lại kịch bản và cường độ hiện tại, sinh dữ liệu mô phỏng mới.
- **Tạm dừng LIVE**: dashboard mặc định tự dao động nhẹ mỗi 3 giây để mô phỏng cảm giác dữ liệu thời gian thực giống Bloomberg Terminal thật; bấm nút này để tạm dừng khi cần chụp ảnh màn hình ổn định.
- **Bảng chi tiết 28 chỉ báo**: cuộn trong bảng để xem toàn bộ, có hiệu ứng chớp xanh/đỏ khi giá trị thay đổi, giống bảng giá của Bloomberg thật.

## Tùy chỉnh cho đúng dữ liệu thật sau này

Khi VIFC có dữ liệu vận hành thực tế, chỉ cần sửa hàm `generateRawValues` trong `calculations.js` thành hàm đọc dữ liệu từ API hoặc file CSV thực tế, giữ nguyên toàn bộ phần tính toán và giao diện.

Trọng số nhóm cho MSI, FCI và tham số alpha, beta, gamma của VIFC-EWI nằm trong `data.js`, chỉnh trực tiếp tại đó khi cần hiệu chỉnh lại theo Phần 4 của báo cáo.

## Đưa vào báo cáo Word

Chụp ảnh 2 đến 3 trạng thái tiêu biểu (Bình thường và Khủng hoảng toàn diện, nhớ bấm Tạm dừng LIVE trước khi chụp để số liệu không đổi giữa chừng), chèn vào Phụ lục E của báo cáo, kèm chú thích đường link GitHub Pages để hội đồng có thể tự mở và tương tác thử.
