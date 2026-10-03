# 🏋️‍♂️ Gym Tracker — Hệ Thống Theo Dõi Tập Luyện & Thể Hình Full-Stack

Ứng dụng Full-Stack hiện đại theo dõi quá trình tập luyện thể hình, bấm giờ buổi tập real-time, lưu trữ lịch sử trên MariaDB, và phân tích biểu đồ tăng cơ (Progressive Overload) tối ưu dành riêng cho **Lập Trình Viên (IT)**.

**🌐 Domain:** [https://fit.odinbi.app](https://fit.odinbi.app)
**🐳 Docker Hub:** [odbadmin/fit](https://hub.docker.com/r/odbadmin/fit)

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

10. **☰ Mobile Navigation Drawer:**
    - Hamburger menu trượt ra mượt mà trên di động (< 900px), hiển thị toàn bộ điều hướng, thông tin người dùng và các thao tác nhanh.

---

## 🛠️ Tech Stack & Kiến Trúc

| Lớp | Công Nghệ |
|:---|:---|
| **Framework** | Next.js 15 (App Router, Server Components + API Routes) |
| **Database** | MariaDB 11.2 (Docker container) |
| **ORM** | Prisma 6 (Type-safe query & migrations) |
| **Authentication** | JWT HTTP-only Cookies & Bcrypt password hashing |
| **Charts** | Chart.js & React-Chartjs-2 |
| **Icons & UI** | Lucide React & Vanilla CSS Glassmorphism Design System |
| **Containerization** | Docker multi-stage build (node:20-alpine, standalone output) |
| **Reverse Proxy** | Nginx (internal) → Shared Reverse Proxy (proxy-net) |
| **Registry** | Docker Hub (`odbadmin/fit`) |

---

## 🚀 Triển Khai Với Docker (Production)

### Yêu Cầu
- Docker & Docker Compose v2
- Mạng Docker `proxy-net` đã tồn tại (từ hệ thống reverse-proxy chung)

### Bước 1: Cấu Hình Biến Môi Trường
```bash
cp .env.production.example .env
nano .env
# → Đổi DB_PASSWORD, DB_ROOT_PASSWORD, JWT_SECRET bằng giá trị bảo mật thực
```

### Bước 2: Khởi Chạy (Reverse Proxy Mode)
```bash
./start.sh common up -d
```

### Bước 3: Đồng Bộ Database Schema & Seed Dữ Liệu
```bash
./start.sh common db:push
./start.sh common db:seed    # (Tùy chọn) Nạp giáo án 5 ngày mẫu
```

### Kiểm Tra & Quản Lý
```bash
./start.sh common ps         # Xem trạng thái containers
./start.sh common logs -f    # Theo dõi logs real-time
./start.sh common down       # Dừng tất cả services
```

---

## 🔨 Build & Push Image Lên Docker Hub

```bash
# Build và push với tag từ .env (FIT_IMAGE_TAG)
./start.sh build

# Hoặc chỉ định tag cụ thể
./start.sh build 1.0.2
```

Image sẽ được push dưới dạng `odbadmin/fit:<tag>` và `odbadmin/fit:latest`.

---

## 💻 Phát Triển Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Sinh Prisma Client
npx prisma generate

# 3. Khởi chạy dev server
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

---

## 🐳 Kiến Trúc Docker & Reverse Proxy

```text
Internet
  │
  ▼
┌─────────────────────────────────────────┐
│  Reverse Proxy (nginx:alpine)           │
│  Port 443 SSL: fit.odinbi.app           │
│  Cert: /etc/letsencrypt/live/odinbi.app │
│  proxy_pass → gym-tracker-nginx:80      │
└────────────────┬────────────────────────┘
                 │  proxy-net (external)
┌────────────────▼────────────────────────┐
│  gym-tracker-nginx (nginx:alpine)       │
│  Internal reverse proxy                 │
│  proxy_pass → app:3000                  │
└────────────────┬────────────────────────┘
                 │  default (internal)
┌────────────────▼────────────────────────┐
│  gym-tracker-app (odbadmin/fit:latest)  │
│  Next.js 15 Standalone (node server.js) │
│  PORT 3000                              │
└────────────────┬────────────────────────┘
                 │
┌────────────────▼────────────────────────┐
│  gym-tracker-db (mariadb:11.2)          │
│  Database: gym_tracker                  │
│  Volume: mariadb_data                   │
└─────────────────────────────────────────┘
```

---

## 📂 Cấu Trúc Thư Mục

```text
gym_tracker/
├── compose.yml                    # Base services: db + app
├── common.yml                     # Override: join proxy-net + internal nginx
├── prod.yml                       # Override: standalone (expose port)
├── start.sh                       # CLI quản lý Docker (build/common/prod)
├── Dockerfile                     # Multi-stage build (Alpine, standalone)
├── .dockerignore
├── .env.example                   # Template biến môi trường
├── .env.production.example        # Mẫu cấu hình VPS production
├── server/
│   └── nginx/conf.d/
│       └── nginx.common.conf      # Internal nginx → app:3000
├── prisma/
│   ├── schema.prisma              # Schema MariaDB/MySQL
│   └── seed.ts                    # Dữ liệu mẫu giáo án 5 ngày & tài khoản
├── public/                        # Assets: icon PWA, ảnh 3D, manifest, SW
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout, PWA meta, theme provider
│   │   ├── page.tsx               # Dashboard: stats, charts, heatmap
│   │   ├── globals.css            # Dark Mode Glassmorphism Design System
│   │   ├── workout/page.tsx       # ⭐ Bấm giờ, ghi tạ/reps, confetti
│   │   ├── schedule/page.tsx      # Giáo án 5 ngày, video hướng dẫn
│   │   ├── history/page.tsx       # Lịch sử tập chi tiết
│   │   ├── analytics/page.tsx     # Biểu đồ Progressive Overload
│   │   ├── gallery/page.tsx       # Thư viện mô phỏng 3D góc khớp
│   │   ├── nutrition/page.tsx     # Bộ tính macro & thực đơn 5 bữa
│   │   ├── login/page.tsx         # Đăng nhập
│   │   ├── register/page.tsx      # Đăng ký (Admin-only)
│   │   ├── users/page.tsx         # Quản lý người dùng (Admin)
│   │   └── api/                   # RESTful API routes
│   ├── components/
│   │   └── layout/
│   │       ├── Header.tsx         # Header + hamburger menu
│   │       ├── MobileDrawer.tsx   # Slide-out navigation drawer
│   │       └── BottomNav.tsx      # Mobile bottom navigation
│   ├── lib/                       # Prisma Client, JWT auth, date utils
│   ├── services/                  # Clean Architecture Service Layer
│   └── types/                     # TypeScript interfaces
├── next.config.mjs                # output: 'standalone'
├── tsconfig.json
└── package.json
```

---

## 📝 start.sh CLI Reference

| Lệnh | Mô tả |
|:---|:---|
| `./start.sh common up -d` | Khởi chạy qua reverse proxy chung |
| `./start.sh common down` | Dừng tất cả containers |
| `./start.sh common logs -f` | Xem live logs |
| `./start.sh common ps` | Trạng thái containers |
| `./start.sh common db:push` | Đồng bộ Prisma schema vào MariaDB |
| `./start.sh common db:seed` | Nạp dữ liệu giáo án mẫu |
| `./start.sh prod up -d` | Chạy standalone (expose port 3000) |
| `./start.sh build` | Build & push image lên Docker Hub |
| `./start.sh build 1.0.2` | Build & push với tag cụ thể |
| `./start.sh help` | Hiển thị hướng dẫn đầy đủ |
