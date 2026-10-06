# 🏋️‍♂️ Gym Tracker — Hệ Thống Theo Dõi Tập Luyện & Thể Hình Full-Stack (Web PWA & Native Android)

Ứng dụng Full-Stack hiện đại theo dõi quá trình tập luyện thể hình, bấm giờ buổi tập real-time, phản hồi xúc giác (Haptic Feedback), lưu trữ lịch sử trên MariaDB, và phân tích biểu đồ tăng cơ (Progressive Overload) tối ưu dành riêng cho **Lập Trình Viên (IT)**.

Hỗ trợ đa nền tảng: **Web Browser**, **PWA (iOS/Safari & Desktop)**, và **Native Android App (Capacitor APK)**.

* **🌐 Production Domain:** [https://fit.odinbi.app](https://fit.odinbi.app)
* **🐳 Docker Hub:** [odbadmin/fit](https://hub.docker.com/r/odbadmin/fit)
* **📱 Native Platform:** Android (Capacitor Live URL Shell) + iOS (PWA)

---

## 🌟 Tính Năng Nổi Bật

1. **⏱️ Workout Session Tracking (Start / Stop Timer):**
   - Chọn ngày tập trong tuần (hoặc tự động phát hiện theo thứ hiện tại).
   - Bấm **▶️ BẮT ĐẦU TẬP** để bắt đầu bấm giờ đếm xuôi real-time kèm hiệu ứng đèn trạng thái và rung xúc giác nhẹ.
   - Đánh dấu hoàn thành từng bài tập với checkbox lớn ✅ kèm **Haptic Feedback** rung xác nhận tức thì.
   - Ghi nhận số hiệp thực tế, số reps và **mức tạ (kg)** nâng được (tự động đồng bộ lên Database).
   - Nút **⏹️ KẾT THÚC BUỔI TẬP** tính toán chính xác tổng thời gian (phút), rung ăn mừng và bắn pháo hoa Confetti 🎉.

2. **🤖 AI Computer Vision Coach (MoveNet Lightning & TensorFlow.js):**
   - Phân tích video camera trực tiếp on-device qua WebGL (không cần GPU server, bảo mật 100%).
   - **Đếm Reps Tự Động:** Thuật toán State Machine nhận diện chu kỳ chuyển động kèm bộ lọc Hysteresis chống rung giật.
   - **Chấm Điểm & Sửa Form Thời Gian Thực:** Đánh giá góc gập khớp gối, khớp hông, cùi chỏ cho Squat, Bicep Curl, Shoulder Press, Push-up.
   - **HUD Trực Quan & Phản Hồi Xúc Giác:** Khung xương Skeleton vẽ trên Canvas, hiển thị góc khớp real-time, rung Haptic và âm thanh khi hoàn thành rep.
   - **Lưu Trữ Buổi Tập:** Tự động tổng kết số reps chuẩn, điểm form trung bình và lưu vào Database.

3. **📱 Native Android Experience (Capacitor):**
   - **Tactile Haptic Feedback:** Tích hợp rung xúc giác chuẩn phần cứng khi hoàn thành hiệp tập, chuyển bài, đổi ngày tập và điều hướng menu.
   - **Immersive Dark Status Bar:** Thanh trạng thái hệ thống đồng bộ giao diện Dark Theme (`#0a0a0f`).
   - **Hardware Back Button:** Phím Back vật lý trên điện thoại điều hướng lùi trang mượt mà hoặc thoát ứng dụng an toàn.
   - **Safe Area Padding:** Tự động căn chỉnh màn hình tai thỏ, nốt ruồi và thanh cử chỉ Android.

3. **📊 Dashboard & Biểu Đồ Thống Kê Phân Tích (Charts):**
   - **4 Thẻ Chỉ Số Cốt Lõi:** Tổng buổi tập, Tổng thời gian (phút), Chuỗi ngày liên tiếp (Streak 🔥), Tỷ lệ hoàn thành (%).
   - **Weekly Bar Chart:** Biểu đồ cột theo dõi tần suất số buổi tập qua từng tuần.
   - **Duration Line Chart:** Biểu đồ đường cong thời lượng phút tập hàng tuần.
   - **Completion Donut Chart:** Tỷ lệ phần trăm hoàn thành giáo án so với buổi bỏ lỡ.
   - **Calendar Heatmap:** Ma trận chuyên cần 45 ngày phong cách GitHub contribution graph.

4. **📈 Progressive Overload Analytics:**
   - Theo dõi sự tăng tiến của mức tạ nâng được (kg) theo từng bài tập trụ cột (Flat DB Press, Squat, RDL, Seated Row...) qua từng tuần.

5. **📅 Giáo Án Thể Hình 5 Ngày Chi Tiết:**
   - Thứ 2: Thân Trên A (Ngực Ngang, Lưng Xô, Tay Sau)
   - Thứ 3: Thân Dưới A (Đùi Trước, Bắp Chuối & Cơ Lõi)
   - Thứ 4: Active Recovery & Mobility (Đi bộ dốc máy chạy bộ, giãn cơ linh hoạt, treo xà)
   - Thứ 5: Thân Trên B (Ngực Trên, Lưng Dày, Vai & Tay)
   - Thứ 6: Thân Dưới B (Chuỗi Cơ Mặt Sau & Sức Mạnh)
   - Tích hợp video minh họa kỹ thuật chuẩn từ YouTube.

6. **🖼️ Thư Viện Cơ Sinh Học 3D:**
   - Mô phỏng góc khớp giải phẫu cho RDL, Lat Pulldown, Bench Press giúp tránh chấn thương chóp xoay vai và đốt sống thắt lưng.

7. **🥗 Dinh Dưỡng Thặng Dư Calo (Caloric Surplus):**
   - Bộ tính toán Macro (Đạm, Tinh bột, Chất béo) tự động cá nhân hóa theo cân nặng người dùng.
   - Lịch ăn mẫu 5 bữa chuẩn cho dân văn phòng công sở.

8. **👥 Quản Lý Thành Viên Nội Bộ (Admin Only):**
   - Vô hiệu hóa tự do đăng ký công khai; tài khoản chỉ do Admin khởi tạo.
   - Menu Quản Lý User trực quan: xem danh sách, tạo tài khoản mới, phân quyền (ADMIN / MEMBER), đặt lại mật khẩu và xóa người dùng.

9. **🔐 Hybrid Authentication (Web + Mobile):**
   - Hỗ trợ song song **HTTP-only Cookie** (Web/Safari PWA) và **Bearer Token** (`Authorization: Bearer <token>` cho Mobile / Capacitor / API Client).

---

## 🛠️ Tech Stack & Kiến Trúc

| Lớp | Công Nghệ |
|:---|:---|
| **Framework** | Next.js 15 (App Router, Server Components + API Routes) |
| **Mobile Native** | Capacitor 8 (Android Platform, Haptics, Status Bar, App State) |
| **Database** | MariaDB 11.2 (Docker container) |
| **ORM** | Prisma 6 (Type-safe query & migrations) |
| **Authentication** | Hybrid Auth: JWT Bearer Token + HTTP-only Cookie |
| **Charts** | Chart.js & React-Chartjs-2 |
| **Icons & UI** | Lucide React & Vanilla CSS Glassmorphism Design System |
| **CI/CD Build APK**| GitHub Actions (`build-apk.yml`) |
| **Containerization**| Docker multi-stage build (node:20-alpine, standalone output) |
| **Reverse Proxy** | Nginx (internal) → Shared Reverse Proxy (proxy-net) |
| **Registry** | Docker Hub (`odbadmin/fit`) |

---

## 📡 Kiến Trúc API & Versioning

Ứng dụng hỗ trợ cả endpoint chuẩn và endpoint có tiền tố version `/api/v1/` thông qua Next.js Rewrite Rules mà không làm vỡ các URL cũ:

* `/api/v1/*` ➡️ Tự động định tuyến đến `/api/*`
* Cho phép Mobile App (Capacitor/React Native/Flutter) và các tích hợp tương lai gọi API ổn định mà không bị ảnh hưởng khi có nâng cấp lớn (v2).

### 1. Hybrid Auth Flow

* **Web Browser / WebView:** Đăng nhập nhận `gym_auth_token` qua HTTP-only Cookie tự động.
* **Mobile / API Client:**
  1. Gửi request đăng nhập kèm header: `X-Client-Type: mobile`
  2. Phản hồi nhận token trong JSON body: `{ success: true, token: "...", user: {...} }`
  3. Các request sau gửi kèm header: `Authorization: Bearer <token>`

### 2. Danh Sách Endpoint Chính

| Method | Endpoint | Mô Tả | Auth Header / Cookie |
|:---|:---|:---|:---|
| `POST` | `/api/v1/auth/login` | Đăng nhập hệ thống (trả về cả cookie & token body) | Public |
| `POST` | `/api/v1/auth/logout` | Đăng xuất | Cookie |
| `GET` | `/api/v1/auth/me` | Lấy thông tin user hiện tại | Bearer Token hoặc Cookie |
| `GET` | `/api/v1/exercises` | Danh sách giáo án và bài tập | Bearer Token hoặc Cookie |
| `GET` | `/api/v1/sessions/active` | Kiểm tra buổi tập đang diễn ra | Bearer Token hoặc Cookie |
| `POST` | `/api/v1/sessions` | Bắt đầu buổi tập mới | Bearer Token hoặc Cookie |
| `PATCH`| `/api/v1/sessions/[id]` | Kết thúc / cập nhật buổi tập | Bearer Token hoặc Cookie |
| `POST` | `/api/v1/sessions/[id]/exercises` | Cập nhật hoàn thành / mức tạ bài tập | Bearer Token hoặc Cookie |
| `GET` | `/api/v1/stats` | Dữ liệu thống kê & biểu đồ | Bearer Token hoặc Cookie |
| `GET` | `/api/v1/users` | Danh sách thành viên (Admin) | Bearer Token hoặc Cookie |
| `GET` | `/api/v1/ai-coach/sessions` | Lịch sử các buổi tập với AI Coach | Bearer Token hoặc Cookie |
| `POST` | `/api/v1/ai-coach/sessions` | Lưu kết quả buổi tập AI Coach (reps, form score) | Bearer Token hoặc Cookie |

---

## 📱 Hướng Dẫn Build & Xuất Android APK

Dự án hỗ trợ 3 cách build file APK linh hoạt:

### Cách 1: Tự Động Qua GitHub Actions (Khuyên Dùng ⭐)
Không cần cài đặt Java hay Android SDK trên máy tính:
1. Đẩy code lên GitHub (`git push origin main`).
2. Vào tab **Actions** trên GitHub repository: chọn workflow **Build Android APK**.
3. Sau ~2 phút build thành công, tải file **`GymTracker-Debug-APK.zip`** trong mục Artifacts.
4. Giải nén và copy file `app-debug.apk` vào điện thoại để cài đặt.

### Cách 2: Mở Bằng Android Studio
Nếu máy tính của bạn đã có Android Studio:
```bash
# Mở trực tiếp thư mục android/ trong Android Studio
npm run cap:open
```
Trong giao diện Android Studio:
* Chọn menu **Build** ➡️ **Build Bundle(s) / APK(s)** ➡️ **Build APK(s)**.
* Khi build xong, bấm liên kết **locate** để lấy file APK.

### Cách 3: Build Cục Bộ Bằng Dòng Lệnh (CLI)
Yêu cầu môi trường đã cài:
* OpenJDK 17 (`sudo apt install -y openjdk-17-jdk`)
* Android SDK (`$ANDROID_HOME`)

Chạy script tự động:
```bash
./scripts/build-apk.sh
# Hoặc: npm run cap:build
```
File APK xuất ra tại:
```text
android/app/build/outputs/apk/debug/app-debug.apk
```

Cài đặt nhanh vào điện thoại kết nối USB (bật USB Debugging):
```bash
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🚀 Triển Khai Với Docker (Production VPS)

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
./start.sh common db:seed    # Nạp giáo án 5 ngày mẫu & tài khoản admin
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
./start.sh build 1.0.3
```

Image sẽ được push dưới dạng `odbadmin/fit:<tag>` và `odbadmin/fit:latest`.

---

## 💻 Phát Triển Cục Bộ (Local Development)

```bash
# 1. Cài đặt dependencies
npm install

# 2. Sinh Prisma Client
npx prisma generate

# 3. Đồng bộ Capacitor plugins (nếu có thay đổi)
npm run cap:sync

# 4. Khởi chạy dev server
npm run dev
```

Mở trình duyệt truy cập: `http://localhost:3000`

---

## 📂 Cấu Trúc Thư Mục

```text
gym_tracker/
├── .github/
│   └── workflows/
│       └── build-apk.yml          # GitHub Actions tự động build Android APK
├── android/                       # Native Android Project (Capacitor)
│   ├── app/src/main/
│   │   ├── AndroidManifest.xml    # Quyền Camera, Vibrate, Network
│   │   └── res/values/colors.xml  # Android Dark Theme Palette
│   └── gradlew                    # Gradle Wrapper build APK
├── scripts/
│   └── build-apk.sh               # Shell script build APK cục bộ
├── capacitor.config.ts            # Cấu hình Capacitor Live URL & Plugins
├── compose.yml                    # Base services: db + app
├── common.yml                     # Override: join proxy-net + internal nginx
├── prod.yml                       # Override: standalone (expose port)
├── start.sh                       # CLI quản lý Docker (build/common/prod)
├── Dockerfile                     # Multi-stage build (Alpine, standalone)
├── prisma/
│   ├── schema.prisma              # Schema MariaDB/MySQL
│   └── seed.ts                    # Dữ liệu mẫu giáo án & tài khoản admin
├── public/                        # Assets: icon PWA, ảnh 3D, manifest, SW
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout, NativeAppInitializer
│   │   ├── globals.css            # Design System + Native App Styles (.is-native-app)
│   │   ├── page.tsx               # Dashboard: stats, charts, heatmap
│   │   ├── workout/page.tsx       # Bấm giờ, Haptic feedback, ghi tạ/reps
│   │   ├── schedule/page.tsx      # Giáo án 5 ngày, video hướng dẫn
│   │   ├── history/page.tsx       # Lịch sử tập chi tiết
│   │   ├── analytics/page.tsx     # Biểu đồ Progressive Overload
│   │   ├── gallery/page.tsx       # Thư viện mô phỏng 3D góc khớp
│   │   ├── nutrition/page.tsx     # Bộ tính macro & thực đơn 5 bữa
│   │   ├── login/page.tsx         # Đăng nhập
│   │   ├── users/page.tsx         # Quản lý người dùng (Admin)
│   │   └── api/                   # RESTful API routes (hỗ trợ /api/v1/...)
│   ├── components/
│   │   ├── NativeAppInitializer.tsx # Tự khởi động Status bar, Back button
│   │   ├── layout/                # Header, BottomNav (haptics), MobileDrawer
│   │   └── workout/               # Modals, timer widget
│   ├── lib/
│   │   ├── auth.ts                # Hybrid Auth: Bearer Token + Cookie
│   │   ├── native-bridge.ts       # Bridge Haptics, Status Bar, Back Button
│   │   ├── api-response.ts        # Format ApiResponse<T> chuẩn
│   │   └── prisma.ts              # Prisma Client
│   └── types/                     # TypeScript interfaces
├── next.config.mjs                # Standalone output & /api/v1 rewrites
└── package.json                   # Scripts & dependencies
```

---

## 📝 NPM Scripts Reference

| Script | Mô Tả |
|:---|:---|
| `npm run dev` | Khởi chạy Next.js development server |
| `npm run build` | Build production Next.js bundle |
| `npm run cap:sync` | Đồng bộ cấu hình web và plugins sang native Android |
| `npm run cap:open` | Mở project native trong Android Studio |
| `npm run cap:build` | Đồng bộ và build Android Debug APK qua Gradle |
| `./scripts/build-apk.sh`| Script bash kiểm tra môi trường và build APK |
