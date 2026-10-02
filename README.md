# 🏋️‍♂️ Gym Tracker PRO - Hệ Thống Theo Dõi Tập Luyện & Thể Hình Full-Stack

Ứng dụng Full-Stack hiện đại theo dõi quá trình tập luyện thể hình, bấm giờ buổi tập real-time, lưu trữ lịch sử trên MariaDB/MySQL, và phân tích biểu đồ tăng cơ (Progressive Overload) tối ưu dành riêng cho **Lập Trình Viên (IT)**.

---

## 🌟 Tính Năng Nổi Bật

1. **⏱️ Workout Session Tracking (Start / Stop Timer):**
   - Chọn ngày tập trong tuần (hoặc tự động phát hiện theo thứ hiện tại).
   - Bấm **▶️ BẮT ĐẦU TẬP** để bắt đầu bấm giờ đếm xuôi real-time với đèn pulsing đỏ ghi hình.
   - Đánh dấu hoàn thành từng bài tập với checkbox lớn ✅.
   - Ghi nhận số hiệp thực tế, số reps và **mức tạ (kg)** nâng được (tự động đồng bộ lên Database).
   - Nút **⏹️ KẾT THÚC BUỔI TẬP** tính toán chính xác tổng thời gian (phút) và bắn pháo hoa ăn mừng (Confetti 🎉).

2. **📊 Dashboard & Biểu Đồ Thống Kê Phân Tích (Charts):**
   - **4 Thẻ Chỉ Số Cốt Lõi:** Tổng buổi tập, Tổng thời gian (phút), Chuỗi ngày liên tiếp (Streak 🔥), Tỷ lệ hoàn thành (%).
   - **Weekly Bar Chart:** Biểu đồ cột theo dõi tần suất số buổi tập qua từng tuần.
   - **Duration Line Chart:** Biểu đồ đường cong thời lượng phút tập hàng tuần.
   - **Completion Donut Chart:** Tỷ lệ phần trăm hoàn thành giáo án so với buổi bỏ lỡ.
   - **Calendar Heatmap:** Ma trận chuyên cần 45 ngày phong cách GitHub contribution graph.

3. **📈 Progressive Overload Analytics:**
   - Theo dõi sự tăng tiến của mức tạ nâng được (kg) theo từng bài tập trụ cột (Flat DB Press, Squat, RDL, Seated Row...) qua từng tuần.

4. **📅 Giáo Án Thể Hình 5 Ngày Chi Tiết:**
   - Thứ 2: Thân Trên A (Ngực Ngang, Lưng Xô, Tay Sau)
   - Thứ 3: Thân Dưới A (Đùi Trước, Bắp Chuối & Cơ Lõi)
   - Thứ 4: Active Recovery & Mobility (Đi bộ dốc máy chạy bộ, giãn cơ linh hoạt, treo xà)
   - Thứ 5: Thân Trên B (Ngực Trên, Lưng Dày, Vai & Tay)
   - Thứ 6: Thân Dưới B (Chuỗi Cơ Mặt Sau & Sức Mạnh)
   - Tích hợp video minh họa kỹ thuật chuẩn từ YouTube.

5. **🖼️ Thư Viện Cơ Sinh Học 3D:**
   - Mô phỏng góc khớp giải phẫu cho RDL, Lat Pulldown, Bench Press giúp tránh chấn thương chóp xoay vai và đốt sống thắt lưng.

6. **🥗 Dinh Dưỡng Thặng Dư Calo (Caloric Surplus):**
   - Bộ tính toán Macro (Đạm, Tinh bột, Chất béo) tự động cá nhân hóa theo cân nặng người dùng.
   - Lịch ăn mẫu 5 bữa chuẩn cho dân văn phòng công sở.

7. **📱 PWA & Offline-ready:**
   - Cài đặt trực tiếp lên màn hình điện thoại iOS/Android như app Native.
   - Service Worker cache tài nguyên tĩnh.

8. **👥 Quản Lý Thành Viên Nội Bộ (Admin Only):**
   - Vô hiệu hóa tự do đăng ký công khai; tài khoản chỉ do Admin khởi tạo.
   - Menu Quản Lý User trực quan: xem danh sách, tạo tài khoản mới, phân quyền (ADMIN / MEMBER), đặt lại mật khẩu và quản lý xóa người dùng.

9. **🔐 Đổi Mật Khẩu Cá Nhân:**
   - Thành viên có toàn quyền tự đổi mật khẩu tài khoản của mình bất kỳ lúc nào qua nút Đổi Mật Khẩu trên thanh điều hướng.

---

## 🛠️ Tech Stack & Kiến Trúc (Clean Architecture)

- **Framework:** Next.js 15 (App Router, Server Components + API Routes)
- **Database:** MariaDB / MySQL (Production trên aaPanel) & SQLite (Local Development)
- **ORM:** Prisma Client (Type-safe query & migrations)
- **Design Pattern:** Service Layer Pattern (`src/services/session.service.ts`, `src/services/stats.service.ts`)
- **Authentication:** JWT HTTP-only Cookies & Bcrypt password hashing
- **Charts:** Chart.js & React-Chartjs-2
- **Icons & UI:** Lucide React & Vanilla CSS Glassmorphism Design System

---

## 🚀 Hướng Dẫn Cài Đặt & Phát Triển Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Sinh Prisma Client và đồng bộ DB cục bộ (SQLite)
npm run db:local

# 3. Khởi chạy dev server
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

Tài khoản Quản Trị Viên mặc định (Default Admin):
- **Email:** `duyrnt09@gmail.com`
- **Mật khẩu:** `Odinbi@123#`
- **Vai trò:** `ADMIN` (Có quyền truy cập Menu Quản Lý User và khởi tạo thành viên)

---

## 🌐 Hướng Dẫn Triển Khai Trên VPS Qua aaPanel (fit.odinbi.app)

### Bước 1: Tạo Database MariaDB trên aaPanel
1. Mở aaPanel → Menu **Database** → Bấm **Add Database**.
2. Điền thông tin:
   - **Database Name:** `gym_tracker`
   - **Username:** `gym_user`
   - **Password:** (Tạo mật khẩu mạnh của bạn)
   - **Character Set:** `utf8mb4`

### Bước 2: Thiết Lập Biến Môi Trường (`.env`) Trên VPS
Tại thư mục dự án trên VPS:
```bash
# .env
DATABASE_URL="mysql://gym_user:MẬT_KHẨU_CỦA_BẠN@localhost:3306/gym_tracker?charset=utf8mb4"
JWT_SECRET="mot_chuoi_bi_mat_ngau_nhien_dai_32_ky_tu_odinbi_app"
NEXTAUTH_SECRET="mot_chuoi_bi_mat_ngau_nhien_dai_32_ky_tu_odinbi_app"
NEXTAUTH_URL="https://fit.odinbi.app"
NODE_ENV="production"
PORT=3000
```

### Bước 3: Đồng Bộ Schema MariaDB và Seed Giáo Án Mẫu
```bash
# Đẩy schema lên MariaDB
npx prisma db push --schema=prisma/schema.prisma

# Nạp giáo án 5 ngày và tài khoản mẫu
npx tsx prisma/seed.ts

# Build phiên bản production
npm run build
```

### Bước 4: Tạo Node.js Project Trên aaPanel
1. aaPanel → Menu **Website** → Chọn tab **Node project** → Bấm **Add Node Project**.
2. Cấu hình:
   - **Project Name:** `gym-tracker`
   - **Project Path:** `/www/wwwroot/gym-tracker` (hoặc thư mục bạn đặt mã nguồn)
   - **Run Opt:** `npm run start` (hoặc lệnh `node_modules/.bin/next start -p 3000`)
   - **Node Version:** Chọn `v20.x` hoặc `v18.x`
   - **Port:** `3000`
3. Bấm **Submit** để aaPanel khởi chạy PM2 background process.

### Bước 5: Cấu Hình Tên Miền & Nginx Reverse Proxy
1. Trong danh sách Website trên aaPanel, bấm vào dự án Node vừa tạo.
2. Tại tab **Domain Manager**, thêm tên miền: `fit.odinbi.app`.
3. Bật **SSL** (chọn Let's Encrypt, tích chọn domain và bấm Apply).
4. aaPanel sẽ tự động tạo Nginx Reverse Proxy trỏ cổng `80/443` về port `3000`.

---

## 📂 Cấu Trúc Thư Mục

```text
Gym/
├── prisma/
│   ├── schema.prisma          # Schema chuẩn MariaDB/MySQL cho VPS aaPanel
│   ├── schema.sqlite.prisma   # Schema cho SQLite khi code cục bộ
│   └── seed.ts                # Dữ liệu mẫu giáo án 5 ngày & tài khoản
├── public/                    # Assets ảnh mô phỏng 3D, icon PWA, manifest, service worker
├── src/
│   ├── app/
│   │   ├── layout.tsx         # Root layout, PWA meta, theme provider
│   │   ├── page.tsx           # Dashboard tổng quan, thẻ stats, charts, heatmap
│   │   ├── globals.css        # Hệ thống giao diện Dark Mode Glassmorphism
│   │   ├── workout/page.tsx   # ⭐ Bấm giờ Start/Stop, ghi tạ/reps, pháo hoa hoàn thành
│   │   ├── schedule/page.tsx  # Lịch tập 5 ngày, video hướng dẫn, lưu ý gù lưng IT
│   │   ├── history/page.tsx   # Lịch sử tập chi tiết, bộ lọc trạng thái
│   │   ├── analytics/page.tsx # Biểu đồ Progressive Overload tăng dần mức tạ
│   │   ├── gallery/page.tsx   # Thư viện mô phỏng 3D góc khớp
│   │   ├── nutrition/page.tsx # Bộ tính macro theo cân nặng & thực đơn 5 bữa
│   │   ├── login/page.tsx     # Đăng nhập & nút đăng nhập demo nhanh
│   │   ├── register/page.tsx  # Đăng ký tài khoản mới
│   │   └── api/               # RESTful API routes (auth, sessions, stats, exercises)
│   ├── components/            # UI components (Header, BottomNav, Charts, RestTimer, Modals)
│   ├── lib/                   # Prisma Client, JWT auth helper, date utils
│   ├── services/              # Clean Architecture Service Layer
│   └── types/                 # TypeScript interfaces
├── .env.example
├── next.config.mjs
├── tsconfig.json
└── package.json
```
