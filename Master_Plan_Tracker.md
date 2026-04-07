# Bảng Theo Dõi Tiến Độ Master (Master Plan Tracker)

**Quy ước trạng thái:**

- `[x]` DONE: Đã hoàn thành
- `[/]` IN PROGRESS: Đang tiến hành
- `[ ]` TODO: Chưa bắt đầu

## 📂 File Nhật Ký Chi Tiết (Logs)

- [📝 Nhật Ký Backend (API, DB, Auth, v.v.)](./Tracker_Backend_Logs.md)
- [📝 Nhật Ký Frontend (React, UI/UX, Vite, v.v.)](./Tracker_Frontend_Logs.md)

---

## Giai đoạn 1: Thiết Kế Cơ Sở Dữ Liệu & EF Core (Phase 1)

- [x] Tạo các Entities cốt lõi (ApplicationUser, Post, Comment, Like, Connection, Story, Notification, Hashtag, PostReport).
- [x] Cấu hình ApplicationDbContext (IdentityDbContext).
- [x] Định nghĩa Fluent API cho các mối quan hệ (OnModelCreating), đặc biệt xử lý cascade delete path conflicts.
- [x] Chạy Entity Framework Migrations và cập nhật DB thành công.

---

## Giai đoạn 2: Backend Core & Bảo Mật (Backend Core & Security)

- [x] Thiết lập Services Layer (Tạo Dependency Injection cho các services).
- [x] Cấu hình ASP.NET Core Identity (Mật khẩu, Lockout, User rules).
- [x] Triển khai JWT Authentication (Tạo token, xác thực token).
- [x] Tạo AuthController (Đăng nhập, Đăng ký, Quản lý Token).
- [x] Cấu hình CORS để cho phép Frontend React gọi API.

---

## Giai đoạn 3: Phát triển RESTful APIs (RESTful APIs Development)

- [/] **Posts API:** CRUD bài viết, xử lý upload ảnh/video, tích hợp hashtag (đã xong Step 1-4: CRUD text + upload ảnh đã verify 401/201 + static URL 200; chưa xử lý hashtag).
- [ ] **Comments API:** Thêm/sửa/xóa bình luận trên bài viết.
- [ ] **Likes API:** Xử lý logic Like/Unlike bài viết và bình luận.
- [ ] **Connections API:** Xử lý logic Follow/Unfollow, lấy danh sách Followers/Following.
- [ ] **Stories API:** CRUD story (Tự động hết hạn sau 24h).
- [ ] **Notifications API:** Lấy danh sách thông báo, đánh dấu đã đọc.
- [ ] **Reports API:** Tạo report cho bài viết.
- [/] Triển khai DTOs linh hoạt cho toàn bộ các endpoints trên (đã khởi tạo Step 1 cho module Posts và sẵn contract cho service Step 2).

---

## Giai đoạn 4: Cài Đặt Frontend & Kiến Trúc Giao Diện (Frontend Setup)

- [x] Khởi tạo dự án Vite (React + TS).
- [x] Tích hợp Tailwind CSS.
- [ ] Setup Axios Interceptors (Tự động thêm token Authorization).
- [ ] Setup Router (React Router DOM) cho các trang public / private.
- [ ] Tạo Layouts cơ sở (Navbar, Sidebar, Main Content, Footer).

---

## Giai đoạn 5: Tích hợp Giao Diện và API (Frontend Integration)

- [ ] Màn hình Authentication (Đăng nhập, Đăng ký bằng React Hook Form).
- [ ] Màn hình Home Feed (Hiển thị bài viết, stories, phân trang/scroll vô tận).
- [ ] Tích hợp tính năng Like/Comment thời gian thực (hoặc gọi API tối ưu).
- [ ] Màn hình Profile cá nhân (Hiển thị info, chỉ số follow, danh sách bài viết).
- [ ] Màn hình Notification.

---

## Giai đoạn 6: Kiểm thử & Triển khai Cloud (Cloud Deployment)

- [ ] Kiểm thử luồng hệ thống End-to-End.
- [ ] Xử lý các edge cases và lỗi UI/UX.
- [ ] Publish tập tin Backend release.
- [ ] Build Frontend Vite (`npm run build`).
- [ ] Triển khai Database (VD: Azure SQL, AWS RDS).
- [ ] Triển khai Backend (VD: Azure App Service, Render, AWS Hecoruku).
- [ ] Triển khai Frontend (VD: Vercel, Netlify).

---

## Thanh tiến độ chi tiết hiện tại

- [x] Giai đoạn 1: Thiết Kế CSDL & EF Core: 100%.
- [x] Giai đoạn 2: Backend Core & Security: 100% (đã hoàn thiện Services Layer cho Auth, JWT token service, AuthService, AuthController, Identity, CORS và Swagger Bearer Authorize button; đã sẵn sàng test endpoint có bảo vệ).
- [/] Giai đoạn 3: RESTful APIs nghiệp vụ chính: 36% (đã hoàn thành Step 1-4 cho Posts: DTOs, `IPostService`, `PostService`, `PostsController`, upload ảnh đã test thực tế; còn hashtag và các module khác).
- [/] Giai đoạn 4: Frontend Setup: 40% (đã có Vite + React + TS + Tailwind; còn thiếu router private/public hoàn chỉnh, interceptor chuẩn token và base layout).
- [ ] Giai đoạn 5: Frontend Integration: 0%.
- [ ] Giai đoạn 6: Test & Cloud Deployment: 0%.
