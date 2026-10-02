# 🏋️‍♂️ Lịch Tập & Dinh Dưỡng Dành Cho Lập Trình Viên (Gym Tracker)

Dự án này là một tài liệu tương tác (Interactive Web Document) và giáo án luyện tập thể hình được thiết kế chuyên biệt cho **Lập Trình Viên (IT)**, đặc biệt là những người có quỹ thời gian eo hẹp, ngồi nhiều, có các vấn đề về cột sống (gù lưng, cổ rùa) và muốn tăng cân nạc khoa học.

## 🌟 Tính Năng Nổi Bật Của Ứng Dụng (Web App)

1. **Giao Diện Đẹp Mắt (UI/UX):** 
   - Chủ đề Dark Mode thân thiện với mắt coder (Lấy cảm hứng từ các editor như VSCode, JetBrains).
   - Thiết kế dạng thẻ (Card-based design) với hiệu ứng Glassmorphism.
   - Bố cục Responsive hoàn hảo trên Desktop, Tablet và Mobile.
2. **Lịch Tập Cụ Thể (5 Ngày/Tuần):** 
   - Tối ưu hóa nguyên tắc **Hypertrophy** (Phát triển cơ bắp) với cấu trúc Upper / Lower.
   - Rõ ràng từng bài tập, số hiệp (Sets), số lần lặp (Reps), và ngưỡng RIR (Reps in Reserve).
3. **Thư Viện Ảnh 3D Sinh Trắc Học:**
   - Ảnh minh họa cho các bài tập cốt lõi (Bench Press, Lat Pulldown, RDL).
   - Tích hợp Modal xem ảnh phóng to.
4. **Widget Bộ Đếm Thời Gian (Rest Timer):**
   - Nổi (Floating) trên màn hình để canh thời gian nghỉ giữa hiệp (60s, 75s, 90s).
   - Có âm thanh (Beep) báo hiệu khi hết giờ.
5. **Chiến Lược Dinh Dưỡng (Caloric Surplus):**
   - Hướng dẫn thực đơn mẫu 5 bữa/ngày đáp ứng lượng 2,350 kcal cho người cần tăng cân (Từ 51kg lên 58kg).

## 🚀 Hướng Dẫn Triển Khai Lên VPS (Xem Online)

Đây là ứng dụng Web tĩnh (Static Web App gồm HTML/CSS/JS thuần), không cần Node.js runtime hay cơ sở dữ liệu phức tạp. Bạn có thể chọn 1 trong các cách sau:

### Cách 1: Chạy Bằng Nginx (Truyền Thống)

**1. Copy file lên VPS:**
```bash
# Đứng tại thư mục dự án trên máy tính:
scp -r ./index.html ./images/ user@your-vps-ip:/var/www/gym/
```

**2. Cấu hình Virtual Host Nginx (`/etc/nginx/sites-available/gym`):**
```nginx
server {
    listen 80;
    server_name gym.yourdomain.com; # Hoặc dùng IP VPS nếu chưa trỏ domain
    root /var/www/gym;
    index index.html;

    location / {
        try_files $uri $uri/ =404;
    }
}
```

```bash
# Kích hoạt và reload Nginx:
sudo ln -s /etc/nginx/sites-available/gym /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

**3. Cấp SSL miễn phí với Certbot (Khuyên dùng):**
```bash
sudo certbot --nginx -d gym.yourdomain.com
```

---

### Cách 2: Chạy Bằng Docker (1 Dòng Lệnh Cực Nhanh)

Nếu VPS của bạn đã cài sẵn Docker:
```bash
# Copy thư mục dự án lên VPS rồi cd vào thư mục đó:
docker run -d \
  --name gym-tracker \
  --restart unless-stopped \
  -p 8080:80 \
  -v $(pwd):/usr/share/nginx/html:ro \
  nginx:alpine
```
*Truy cập ngay qua: `http://your-vps-ip:8080`*

---

### Cách 3: Chạy Bằng Caddy (Tự Động Cấp HTTPS)
```bash
# Cài Caddy và chạy trực tiếp:
caddy file-server --domain gym.yourdomain.com --root /var/www/gym
```

---

## 📱 Mẹo Sử Dụng Tiện Lợi Tại Phòng Gym (Add to Home Screen)
Để không phải mở trình duyệt và gõ link mỗi khi đến phòng tập:
- **Trên iPhone (Safari):** Mở link web -> Bấm nút **Share** (biểu tượng hình vuông có mũi tên lên) -> Chọn **"Thêm vào Màn hình chính" (Add to Home Screen)**.
- **Trên Android (Chrome):** Mở link web -> Bấm menu 3 chấm góc phải -> Chọn **"Thêm vào màn hình chính" (Install app / Add to Home screen)**.
- Giao diện đã được tối ưu toàn màn hình (Full-screen App Mode), hiển thị như một ứng dụng Native đích thực, thao tác bấm bộ đếm thời gian (Rest Timer) và xem ảnh bài tập mượt mà ngay trên sàn tập.

## 📱 Khả Năng Tương Thích (Responsive)
- **Desktop (1024px+):** Hiển thị toàn bộ bảng biểu, lưới thông tin dạng cột, thoải mái đọc.
- **Tablet (768px - 1024px):** Bố cục tự động chia 2 cột cho các thông số, bảng biểu cho phép cuộn ngang (scroll) mượt mà.
- **Mobile (< 768px):** Menu dạng thẻ tự động cuộn ngang, lưới thông tin tự động chuyển thành 1 cột (Stacking), cỡ chữ và các nút bấm được làm to lên để dễ chạm (Touch-friendly).

## ⚠️ Lưu Ý Y Khoa Thể Thao
- Giáo án không chứa các lời hứa hẹn phóng đại (Ví dụ: "an toàn 100%", "trị dứt điểm"). 
- Người tập cần tuân thủ đúng mức **RIR (Reps in Reserve)** được ghi chú để tránh vắt kiệt hệ thần kinh trung ương (CNS) và gây quá tải cho khớp.

---
*Phát triển bởi AI Assistant - Dành riêng cho kỹ sư phần mềm.*
