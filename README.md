# VIFC EWS Dashboard

Bảng điều khiển minh họa cho **Hệ thống cảnh báo sớm rủi ro thị trường (Early Warning System)** của VIFC — theo dõi 28 chỉ báo thuộc 7 nhóm rủi ro, tổng hợp thành hai chỉ số MSI/FCI và chỉ số cảnh báo tổng hợp VIFC-EWI, với dữ liệu mô phỏng theo thời gian thực.

## Tính năng

- **28 chỉ báo / 7 nhóm rủi ro**: lãi suất, tỷ giá, dòng vốn, giá tài sản, tập trung tín dụng, thanh khoản, tâm lý nhà đầu tư.
- **Chỉ số tổng hợp**: MSI (căng thẳng tức thời), FCI (điều kiện nền), VIFC-EWI (cảnh báo tổng hợp 0–100).
- **12 kịch bản mô phỏng** dựng sẵn (bình thường, sốc lãi suất, sốc tỷ giá, rút vốn ngoại, bong bóng tài sản, khủng hoảng thanh khoản, khủng hoảng toàn diện...) và một thanh trượt để tự chỉnh cường độ.
- **Chế độ LIVE**: dữ liệu tự dao động nhẹ mỗi 3 giây để mô phỏng cảm giác thời gian thực.
- **Click để xem định nghĩa & công thức**: nhấn vào EWI, MSI, FCI, tên nhóm rủi ro, hoặc bất kỳ chỉ báo nào (trong bảng, heatmap, biểu đồ xu hướng) để mở hộp thoại giải thích định nghĩa, công thức chuẩn hoá, ngưỡng cảnh báo và diễn biến theo thời gian của chỉ báo đó.
- **Biểu đồ trực quan**: ma trận MSI/FCI, biểu đồ xu hướng 7 nhóm rủi ro theo thời gian, heatmap nhanh 28 chỉ báo, bảng chi tiết có hiệu ứng chớp khi giá trị thay đổi.

## Cấu trúc thư mục

```
vifc-dasboard-1/
├── index.html          # Cấu trúc giao diện + modal định nghĩa/công thức
├── style.css           # Theme Bloomberg (nền đen, cam, monospace)
├── data.js             # 7 nhóm, 28 chỉ báo, ngưỡng, trọng số, kịch bản mô phỏng
├── calculations.js     # Công thức chuẩn hóa chỉ báo, tính MSI, FCI, VIFC-EWI
├── charts.js           # Vẽ biểu đồ Plotly (ma trận, xu hướng theo thời gian, heatmap)
├── app.js              # Đồng hồ, ticker, mô phỏng live, lịch sử điểm số, bảng dữ liệu
├── info.js             # Nội dung và logic cho hộp thoại định nghĩa/công thức
└── README.md
```

Không có bước build hay phụ thuộc ngoài (dependency) nào cần cài đặt — toàn bộ là HTML/CSS/JavaScript thuần, chỉ dùng [Plotly.js](https://plotly.com/javascript/) tải qua CDN trong `index.html`.

## Cách dùng dashboard

- **Chọn kịch bản**: chọn 1 trong 12 kịch bản dựng sẵn; mỗi kịch bản có một hồ sơ cường độ riêng cho 7 nhóm rủi ro.
- **Cường độ tùy chỉnh**: kéo thanh trượt để tự chỉnh mức độ nghiêm trọng tổng thể, áp lên hồ sơ của kịch bản đang chọn.
- **Cập nhật ngay**: áp lại kịch bản và cường độ hiện tại, sinh dữ liệu mô phỏng mới.
- **Tạm dừng LIVE**: dừng dao động tự động mỗi 3 giây, hữu ích khi cần giữ số liệu ổn định để chụp ảnh màn hình.
- **Nhấn vào một chỉ số**: EWI, MSI, FCI, tên nhóm, dòng trong bảng 28 chỉ báo, ô trong heatmap, hoặc đường trong biểu đồ xu hướng — để xem định nghĩa, công thức và diễn biến theo thời gian.

## Tùy chỉnh cho dữ liệu thật

Khi có dữ liệu vận hành thực tế, thay hàm `generateRawValues` trong `calculations.js` bằng hàm đọc dữ liệu từ API hoặc file thực tế, giữ nguyên phần tính toán và giao diện.

Trọng số nhóm cho MSI, FCI và tham số alpha, beta, gamma của VIFC-EWI nằm trong `data.js` (`MSI_WEIGHTS`, `FCI_WEIGHTS`, `EWI_PARAMS`); ngưỡng và định nghĩa từng chỉ báo cũng khai báo tại đó (`RISK_GROUPS`).
