# 🏋️ Gym Tracker — API Walkthrough Chi Tiết

> **Base URL:** `https://fit.odinbi.app`  
> **API Version:** `v1` (prefix: `/api/v1/`)  
> **Content-Type:** `application/json`

---

## 📋 Mục Lục

1. [Tổng Quan Kiến Trúc](#-tổng-quan-kiến-trúc)
2. [Xác Thực (Authentication)](#-xác-thực-authentication)
3. [Quy Ước Response](#-quy-ước-response)
4. [API Endpoints](#-api-endpoints)
   - [Auth — Đăng Nhập / Đăng Xuất](#1-auth--đăng-nhập--đăng-xuất)
   - [Exercises — Giáo Án & Bài Tập](#2-exercises--giáo-án--bài-tập)
   - [Schedule — Quản Lý Lịch Tập](#3-schedule--quản-lý-lịch-tập)
   - [Sessions — Buổi Tập Workout](#4-sessions--buổi-tập-workout)
   - [Stats — Thống Kê & Biểu Đồ](#5-stats--thống-kê--biểu-đồ)
   - [Users — Quản Lý Thành Viên (Admin)](#6-users--quản-lý-thành-viên-admin)
   - [AI Coach — Phân Tích Tập Luyện AI](#7-ai-coach--phân-tích-tập-luyện-ai)
5. [Luồng Sử Dụng End-to-End](#-luồng-sử-dụng-end-to-end)
6. [Mã Lỗi HTTP](#-mã-lỗi-http)

---

## 🏛️ Tổng Quan Kiến Trúc

```
┌─────────────────────────────────────────────────────────┐
│                    CLIENT LAYER                         │
│                                                         │
│  ┌──────────┐  ┌───────────────┐  ┌──────────────────┐  │
│  │ Web/PWA  │  │ Android APK   │  │ API Client (cURL)│  │
│  │ (Cookie) │  │ (Bearer Token)│  │ (Bearer Token)   │  │
│  └────┬─────┘  └──────┬────────┘  └────────┬─────────┘  │
│       │               │                    │            │
└───────┼───────────────┼────────────────────┼────────────┘
        │               │                    │
        ▼               ▼                    ▼
┌─────────────────────────────────────────────────────────┐
│              NEXT.JS API ROUTES (App Router)            │
│                                                         │
│  /api/v1/*  ──── rewrite ────►  /api/*                 │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Hybrid Auth Middleware                            │   │
│  │ 1. Bearer Token (Authorization header)           │   │
│  │ 2. HTTP-only Cookie (gym_auth_token)              │   │
│  └──────────────────────────────────────────────────┘   │
│                         │                                │
│                         ▼                                │
│  ┌──────────────────────────────────────────────────┐   │
│  │ Service Layer (Prisma ORM)                        │   │
│  │ SessionService / ScheduleService / StatsService   │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
               ┌──────────────────┐
               │  MariaDB 11.2    │
               │  (Docker)        │
               └──────────────────┘
```

### API Versioning

| URL Pattern | Routing |
|:---|:---|
| `/api/v1/auth/login` | ➡️ rewrite tới `/api/auth/login` |
| `/api/v1/sessions` | ➡️ rewrite tới `/api/sessions` |
| `/api/auth/login` | ✅ Vẫn hoạt động trực tiếp |

> Cả hai pattern đều hợp lệ. Khuyến nghị dùng `/api/v1/` cho Mobile App và API Client bên ngoài.

---

## 🔐 Xác Thực (Authentication)

Hệ thống hỗ trợ **Hybrid Auth** — song song 2 cơ chế:

### Cơ chế 1: HTTP-only Cookie (Web Browser / PWA)

Sau khi đăng nhập thành công, server tự động set cookie `gym_auth_token`:

```http
Set-Cookie: gym_auth_token=eyJhbGciOiJIUzI1NiJ9...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
```

Trình duyệt tự động gửi cookie theo mỗi request — không cần xử lý gì thêm.

### Cơ chế 2: Bearer Token (Mobile App / API Client)

Gửi header `Authorization` kèm theo token nhận từ response đăng nhập:

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbH...
```

### JWT Payload

```json
{
  "userId": "clx1abc2d0001...",
  "email": "user@example.com",
  "name": "Duy Nguyễn",
  "role": "ADMIN",
  "iat": 1728172800,
  "exp": 1730764800
}
```

| Field | Mô Tả |
|:---|:---|
| `userId` | CUID định danh user |
| `email` | Email đăng nhập |
| `name` | Tên hiển thị |
| `role` | `ADMIN` hoặc `MEMBER` |
| `exp` | Hết hạn sau **30 ngày** |

---

## 📦 Quy Ước Response

### Thành công (Success)

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "timestamp": "2026-10-06T03:41:00.000Z"
  }
}
```

> **Lưu ý:** Một số endpoint lịch sử trả về trực tiếp `{ success: true, sessions: [...] }` thay vì bọc trong `data`. Cả hai format đều được hỗ trợ.

### Lỗi (Error)

```json
{
  "success": false,
  "error": "Mô tả lỗi bằng tiếng Việt",
  "meta": {
    "timestamp": "2026-10-06T03:41:00.000Z"
  }
}
```

---

## 📡 API Endpoints

### 1. Auth — Đăng Nhập / Đăng Xuất

---

#### `POST /api/v1/auth/login` — Đăng nhập

Đăng nhập hệ thống. Trả về cả Cookie (cho Web) và Token body (cho Mobile).

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "duyrnt09@gmail.com",
    "password": "your_password_here"
  }'
```

**Response — 200 OK:**

```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9.eyJ1c2VySWQiOiJjbHgxYWJjMmQwMDAxIiwiZW1haWwiOiJkdXlybnQwOUBnbWFpbC5jb20iLCJuYW1lIjoiRHV5IE5ndXnhu4VuIChBZG1pbikiLCJyb2xlIjoiQURNSU4iLCJpYXQiOjE3MjgxNzI4MDAsImV4cCI6MTczMDc2NDgwMH0.xxxx",
  "user": {
    "id": "clx1abc2d0001...",
    "email": "duyrnt09@gmail.com",
    "name": "Duy Nguyễn (Admin)",
    "role": "ADMIN"
  }
}
```

Kèm theo response header:
```http
Set-Cookie: gym_auth_token=eyJhbG...; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=2592000
```

**Response — 400 Bad Request:**
```json
{ "error": "Vui lòng nhập email và mật khẩu" }
```

**Response — 401 Unauthorized:**
```json
{ "error": "Email hoặc mật khẩu không chính xác" }
```

---

#### `POST /api/v1/auth/logout` — Đăng xuất

Xóa cookie `gym_auth_token` ở phía server.

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/auth/logout \
  -H "Cookie: gym_auth_token=eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "message": "Đăng xuất thành công"
}
```

---

#### `GET /api/v1/auth/me` — Thông tin user hiện tại

Kiểm tra trạng thái đăng nhập và lấy thông tin profile.

**Request:**

```bash
# Bằng Bearer Token:
curl https://fit.odinbi.app/api/v1/auth/me \
  -H "Authorization: Bearer eyJhbG..."

# Bằng Cookie:
curl https://fit.odinbi.app/api/v1/auth/me \
  -H "Cookie: gym_auth_token=eyJhbG..."
```

**Response — 200 OK (Đã đăng nhập):**

```json
{
  "authenticated": true,
  "user": {
    "id": "clx1abc2d0001...",
    "email": "duyrnt09@gmail.com",
    "name": "Duy Nguyễn (Admin)",
    "role": "ADMIN",
    "avatarUrl": null
  }
}
```

**Response — 401 Unauthorized:**

```json
{
  "authenticated": false,
  "user": null
}
```

---

#### `POST /api/v1/auth/change-password` — Đổi mật khẩu

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/auth/change-password \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "old_password",
    "newPassword": "new_password_min_6_chars"
  }'
```

**Response — 200 OK:**

```json
{
  "success": true,
  "message": "Đổi mật khẩu thành công!"
}
```

**Response — 400 Bad Request:**

```json
{ "error": "Mật khẩu mới phải có ít nhất 6 ký tự" }
```
hoặc
```json
{ "error": "Mật khẩu hiện tại không chính xác" }
```

---

#### `POST /api/v1/auth/register` — Đăng ký (Đã vô hiệu hóa)

Endpoint này luôn trả về lỗi 403 do chính sách nội bộ.

**Response — 403 Forbidden:**

```json
{
  "error": "Tính năng tự động đăng ký đã bị vô hiệu hóa. Tài khoản thành viên chỉ được khởi tạo bởi Quản Trị Viên (Admin)."
}
```

---

### 2. Exercises — Giáo Án & Bài Tập

---

#### `GET /api/v1/exercises` — Danh sách giáo án theo ngày

Trả về lịch tập 5 ngày với danh sách bài tập chi tiết (bao gồm video hướng dẫn).

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/exercises \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "days": [
    {
      "id": "day_monday_001",
      "userId": "clx1abc2d0001...",
      "dayOfWeek": 1,
      "name": "Thân Trên A (Upper A)",
      "focus": "Ngực Ngang, Lưng Xô, Tay Sau",
      "dayType": "TRAINING",
      "durationMin": 45,
      "exercises": [
        {
          "id": "ex_flat_db_press",
          "workoutDayId": "day_monday_001",
          "orderIndex": 0,
          "nameVi": "Flat Dumbbell Press",
          "nameEn": "Flat Dumbbell Press",
          "equipment": "Tạ đơn (Dumbbell)",
          "sets": 4,
          "repsMin": 8,
          "repsMax": 12,
          "rir": "1–2",
          "techniqueNote": "Hạ tạ đến ngang ngực, giữ khuỷu tay 45°...",
          "videoUrl": "https://youtube.com/watch?v=...",
          "isArchived": false
        }
      ]
    }
  ]
}
```

---

### 3. Schedule — Quản Lý Lịch Tập

Nhóm endpoint cho phép tùy biến giáo án cá nhân: thêm/sửa/xóa/đổi vị trí bài tập, reset về mặc định.

---

#### `GET /api/v1/schedule` — Xem lịch tập + Activity Logs

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/schedule \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "days": [ ... ],
  "logs": [
    {
      "id": "log_001",
      "userId": "clx1abc2d0001...",
      "action": "ADD",
      "details": "Thêm bài tập 'Cable Fly' vào Thứ 2",
      "createdAt": "2026-10-05T08:30:00.000Z"
    }
  ]
}
```

---

#### `POST /api/v1/schedule/exercises` — Thêm bài tập mới

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/schedule/exercises \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "dayId": "day_monday_001",
    "nameVi": "Cable Fly",
    "nameEn": "Cable Fly",
    "equipment": "Cáp (Cable)",
    "sets": 3,
    "repsMin": 12,
    "repsMax": 15,
    "rir": "0–1",
    "techniqueNote": "Giữ khuỷu tay hơi gập...",
    "videoUrl": "https://youtube.com/watch?v=..."
  }'
```

---

#### `PUT /api/v1/schedule/exercises` — Sửa bài tập

**Request:**

```bash
curl -X PUT https://fit.odinbi.app/api/v1/schedule/exercises \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "ex_cable_fly_001",
    "nameVi": "Cable Fly (Incline)",
    "sets": 4,
    "repsMin": 10,
    "repsMax": 12
  }'
```

---

#### `DELETE /api/v1/schedule/exercises` — Xóa bài tập

**Request:**

```bash
curl -X DELETE "https://fit.odinbi.app/api/v1/schedule/exercises?exerciseId=ex_cable_fly_001" \
  -H "Authorization: Bearer eyJhbG..."
```

---

#### `POST /api/v1/schedule/move` — Di chuyển bài tập sang ngày khác

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/schedule/move \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "ex_cable_fly_001",
    "targetDayId": "day_thursday_004",
    "targetOrderIndex": 2
  }'
```

---

#### `POST /api/v1/schedule/reorder` — Sắp xếp lại thứ tự bài tập trong ngày

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/schedule/reorder \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "dayId": "day_monday_001",
    "orderedExerciseIds": ["ex_003", "ex_001", "ex_002", "ex_004"]
  }'
```

---

#### `POST /api/v1/schedule/reset` — Reset giáo án về mặc định

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/schedule/reset \
  -H "Authorization: Bearer eyJhbG..."
```

---

#### `GET /api/v1/schedule/logs` — Xem 50 logs hoạt động gần nhất

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/schedule/logs \
  -H "Authorization: Bearer eyJhbG..."
```

---

### 4. Sessions — Buổi Tập Workout

---

#### `GET /api/v1/sessions` — Lịch sử tất cả buổi tập

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/sessions \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "sessions": [
    {
      "id": "sess_001",
      "userId": "clx1abc2d0001...",
      "workoutDayId": "day_monday_001",
      "date": "2026-10-05T07:30:00.000Z",
      "startedAt": "2026-10-05T07:30:00.000Z",
      "endedAt": "2026-10-05T08:15:00.000Z",
      "durationMin": 45,
      "status": "COMPLETED",
      "notes": null,
      "workoutDay": {
        "name": "Thân Trên A (Upper A)",
        "dayOfWeek": 1
      },
      "exercises": [
        {
          "id": "se_001",
          "exerciseId": "ex_flat_db_press",
          "completed": true,
          "actualSets": 4,
          "actualReps": "10,10,8,8",
          "actualWeightKg": 22.5,
          "notes": null
        }
      ]
    }
  ]
}
```

---

#### `GET /api/v1/sessions/active` — Buổi tập đang diễn ra

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/sessions/active \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK (Có buổi tập active):**

```json
{
  "success": true,
  "session": {
    "id": "sess_002",
    "status": "IN_PROGRESS",
    "startedAt": "2026-10-06T03:30:00.000Z",
    "workoutDay": {
      "name": "Thân Trên A (Upper A)",
      "exercises": [ ... ]
    }
  }
}
```

---

#### `POST /api/v1/sessions` — Bắt đầu buổi tập mới

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/sessions \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "workoutDayId": "day_monday_001"
  }'
```

---

#### `POST /api/v1/sessions/:id/exercises` — Ghi nhận kết quả bài tập

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/sessions/sess_003/exercises \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseId": "ex_flat_db_press",
    "completed": true,
    "actualSets": 4,
    "actualReps": "10,10,8,8",
    "actualWeightKg": 22.5,
    "notes": "Tăng 2.5kg so với tuần trước"
  }'
```

---

#### `PATCH /api/v1/sessions/:id` — Kết thúc buổi tập

**Request:**

```bash
curl -X PATCH https://fit.odinbi.app/api/v1/sessions/sess_003 \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "notes": "Cảm giác tốt, hoàn thành đầy đủ bài tập"
  }'
```

---

#### `PUT /api/v1/sessions/:id` — Cập nhật buổi tập

**Request:**

```bash
curl -X PUT https://fit.odinbi.app/api/v1/sessions/sess_003 \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{ "notes": "Cập nhật lại ghi chú buổi tập" }'
```

---

#### `DELETE /api/v1/sessions/:id` — Xóa buổi tập

**Request:**

```bash
curl -X DELETE https://fit.odinbi.app/api/v1/sessions/sess_003 \
  -H "Authorization: Bearer eyJhbG..."
```

---

#### `POST /api/v1/sessions/reset` — Reset toàn bộ lịch sử tập luyện

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/sessions/reset \
  -H "Authorization: Bearer eyJhbG..."
```

---

### 5. Stats — Thống Kê & Biểu Đồ

---

#### `GET /api/v1/stats` — Dữ liệu Dashboard

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/stats \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "stats": {
    "totalSessions": 42,
    "totalMinutes": 1890,
    "currentStreak": 5,
    "completionRate": 87.5,
    "weeklyData": [
      { "week": "2026-W38", "sessions": 4, "totalMinutes": 180 },
      { "week": "2026-W39", "sessions": 5, "totalMinutes": 225 }
    ],
    "heatmapData": [
      { "date": "2026-10-01", "count": 1 },
      { "date": "2026-10-02", "count": 1 }
    ]
  }
}
```

---

### 6. Users — Quản Lý Thành Viên (Admin)

> 🔒 Yêu cầu quyền `ADMIN`.

---

#### `GET /api/v1/users` — Danh sách người dùng

**Request:**

```bash
curl https://fit.odinbi.app/api/v1/users \
  -H "Authorization: Bearer eyJhbG..."
```

---

#### `POST /api/v1/users` — Tạo người dùng mới

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/users \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Nguyễn Văn B",
    "email": "newmember@example.com",
    "password": "securePassword123",
    "role": "MEMBER"
  }'
```

---

### 7. AI Coach — Phân Tích Tập Luyện AI

Module AI Vision Coach sử dụng TensorFlow.js + MoveNet SinglePose Lightning để đếm reps tự động và phân tích form trực tiếp qua camera on-device. Hỗ trợ kèm **Voice Coach** phát âm tiếng Việt.

---

#### `GET /api/v1/ai-coach/sessions` — Lịch sử & Thống Kê AI

Lấy danh sách các buổi tập AI kèm các chỉ số tổng hợp (aggregated stats) cho trang Dashboard/Analytics.

**Query Parameters:**
* `limit`: Số buổi tối đa cần lấy (mặc định 50, tối đa 100).
* `exerciseType`: Lọc theo bài tập (`all`, `squat`, `bicep_curl`, `shoulder_press`, `pushup`, `deadlift`, `lunge`).

**Request:**

```bash
curl "https://fit.odinbi.app/api/v1/ai-coach/sessions?limit=50&exerciseType=all" \
  -H "Authorization: Bearer eyJhbG..."
```

**Response — 200 OK:**

```json
{
  "success": true,
  "data": {
    "sessions": [
      {
        "id": "ai_sess_001",
        "userId": "clx1abc2d0001...",
        "exerciseType": "squat",
        "exerciseName": "Squat (Gánh Đùi)",
        "totalReps": 15,
        "goodReps": 12,
        "avgFormScore": 82.5,
        "durationSec": 180,
        "feedbackSummary": "Form tốt. Cần chú ý gập gối sâu hơn ở 3 rep cuối.",
        "createdAt": "2026-10-05T08:00:00.000Z"
      }
    ],
    "stats": {
      "totalSessions": 15,
      "totalReps": 180,
      "totalGoodReps": 152,
      "goodRepsRate": 84.4,
      "overallAvgFormScore": 81.2,
      "totalDurationSec": 2400,
      "exerciseBreakdown": [
        {
          "exerciseType": "squat",
          "sessionCount": 6,
          "totalReps": 75,
          "goodReps": 65,
          "avgScore": 83.5,
          "bestScore": 92
        }
      ]
    }
  },
  "meta": {
    "timestamp": "2026-10-06T03:41:00.000Z"
  }
}
```

---

#### `POST /api/v1/ai-coach/sessions` — Lưu kết quả buổi tập AI

**Request:**

```bash
curl -X POST https://fit.odinbi.app/api/v1/ai-coach/sessions \
  -H "Authorization: Bearer eyJhbG..." \
  -H "Content-Type: application/json" \
  -d '{
    "exerciseType": "deadlift",
    "exerciseName": "Deadlift (Kéo Tạ Đất)",
    "totalReps": 10,
    "goodReps": 9,
    "avgFormScore": 86.0,
    "durationSec": 120,
    "feedbackSummary": "Form rất tốt! Lưng giữ thẳng, bản lề hông chuẩn."
  }'
```

**Response — 201 Created:**

```json
{
  "success": true,
  "data": {
    "session": {
      "id": "ai_sess_new_001",
      "exerciseType": "deadlift",
      "exerciseName": "Deadlift (Kéo Tạ Đất)",
      "totalReps": 10,
      "goodReps": 9,
      "avgFormScore": 86.0,
      "durationSec": 120,
      "feedbackSummary": "Form rất tốt! Lưng giữ thẳng, bản lề hông chuẩn.",
      "createdAt": "2026-10-06T03:41:00.000Z"
    }
  },
  "meta": {
    "timestamp": "2026-10-06T03:41:00.000Z"
  }
}
```

**Danh Sách 6 Bài Tập Hỗ Trợ (`exerciseType`):**

| Mã Bài Tập | Tên Tiếng Việt | Khớp Phân Tích Chính |
|:---|:---|:---|
| `squat` | Squat (Gánh Đùi) | Khớp gối, khớp hông, cân bằng 2 chân |
| `bicep_curl` | Bicep Curl (Cuốn Tay Trước) | Khớp khuỷu tay (co bóp & duỗi) |
| `shoulder_press` | Shoulder Press (Đẩy Vai) | Khớp vai, khuỷu tay, khóa tay đỉnh |
| `pushup` | Push-up (Hít Đất) | Khuỷu tay hạ ngực, đường thẳng cột sống |
| `deadlift` | Deadlift (Kéo Tạ Đất) | Bản lề hông (Hip hinge), độ thẳng lưng |
| `lunge` | Lunge (Bước Chùng Chân) | Góc gối trước 90°, gối sau hạ sát sàn |

---

## 🔄 Luồng Sử Dụng End-to-End

```
Mobile App                        API Server                       Database
    │                                 │                                │
    │  1. POST /api/v1/auth/login     │                                │
    │  { email, password }            │                                │
    │ ───────────────────────────────► │                                │
    │                                 │  Verify password (bcrypt)      │
    │                                 │ ─────────────────────────────► │
    │  ◄─── 200 { token, user }       │                                │
    │                                 │                                │
    │  2. GET /api/v1/exercises       │                                │
    │  Authorization: Bearer <token>  │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { days: [...] }       │                                │
    │                                 │                                │
    │  3. GET /api/v1/sessions/active │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { session: null }     │                                │
    │                                 │                                │
    │  4. POST /api/v1/sessions       │                                │
    │  { workoutDayId }               │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { session: {...} }    │  Status: IN_PROGRESS          │
    │                                 │                                │
    │  5. POST /sessions/:id/exercises│                                │
    │  { exerciseId, completed, ... } │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { exercise: {...} }   │                                │
    │                                 │                                │
    │  6. PATCH /api/v1/sessions/:id  │                                │
    │  { notes }                      │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { session }           │  Status: COMPLETED 🎉         │
    │                                 │                                │
    │  7. GET /api/v1/stats           │                                │
    │ ───────────────────────────────► │                                │
    │  ◄─── 200 { stats: {...} }      │  Updated Dashboard            │
```

---

## ❌ Mã Lỗi HTTP

| Code | Ý Nghĩa | Tình Huống Gặp Phải |
|:---|:---|:---|
| `200` | OK | Thành công |
| `201` | Created | Tạo mới thành công (AI Session) |
| `400` | Bad Request | Dữ liệu gửi lên thiếu hoặc không hợp lệ |
| `401` | Unauthorized | Sai mật khẩu / Token thiếu / Hết hạn |
| `403` | Forbidden | Không đủ quyền (Cần quyền ADMIN) |
| `404` | Not Found | Bản ghi không tồn tại |
| `500` | Server Error | Lỗi server hoặc cơ sở dữ liệu |
