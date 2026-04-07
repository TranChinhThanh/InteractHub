# Bảng Theo Dõi Tiến Độ Master (Master Plan Tracker)

**Quy ước trạng thái:**

- `[x]` DONE: Đã hoàn thành
- `[/]` IN PROGRESS: Đang tiến hành
- `[ ]` TODO: Chưa bắt đầu

---

## Giai đoạn 1: Thiết Kế Cơ Sở Dữ Liệu & EF Core (Phase 1)

- [x] Tạo các Entities cốt lõi (ApplicationUser, Post, Comment, Like, Connection, Story, Notification, Hashtag, PostReport).
- [x] Cấu hình ApplicationDbContext (IdentityDbContext).
- [x] Định nghĩa Fluent API cho các mối quan hệ (OnModelCreating), đặc biệt xử lý cascade delete path conflicts.
- [x] Chạy Entity Framework Migrations và cập nhật DB thành công.

---

## Giai đoạn 2: Backend Core & Bảo Mật (Backend Core & Security)

- [ ] Thiết lập Services Layer (Tạo Dependency Injection cho các services).
- [ ] Cấu hình ASP.NET Core Identity (Mật khẩu, Lockout, User rules).
- [ ] Triển khai JWT Authentication (Tạo token, xác thực token).
- [ ] Tạo AuthController (Đăng nhập, Đăng ký, Quản lý Token).
- [ ] Cấu hình CORS để cho phép Frontend React gọi API.

---

## Giai đoạn 3: Phát triển RESTful APIs (RESTful APIs Development)

- [ ] **Posts API:** CRUD bài viết, xử lý upload ảnh/video, tích hợp hashtag.
- [ ] **Comments API:** Thêm/sửa/xóa bình luận trên bài viết.
- [ ] **Likes API:** Xử lý logic Like/Unlike bài viết và bình luận.
- [ ] **Connections API:** Xử lý logic Follow/Unfollow, lấy danh sách Followers/Following.
- [ ] **Stories API:** CRUD story (Tự động hết hạn sau 24h).
- [ ] **Notifications API:** Lấy danh sách thông báo, đánh dấu đã đọc.
- [ ] **Reports API:** Tạo report cho bài viết.
- [ ] Triển khai DTOs linh hoạt cho toàn bộ các endpoints trên.

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

## Cập nhật thực hiện gần nhất (07/04/2026)

### Việc đã làm xong

- [x] Rà soát toàn bộ Entities trong `Backend/Models` để xác định các quan hệ dễ gây lỗi `Multiple cascade paths` (đặc biệt: `Comment`, `Like`, `PostReport`, `Post`, `Connection`, `Story`, `Notification`).
- [x] Cập nhật `OnModelCreating` trong `Backend/Data/ApplicationDbContext.cs` để override rõ ràng DeleteBehavior cho các FK nhạy cảm.
- [x] Thiết lập `DeleteBehavior.NoAction` hoặc `DeleteBehavior.Restrict` cho các quan hệ có nguy cơ tạo vòng lặp cascade.
- [x] Kiểm tra lại file sau chỉnh sửa, không phát sinh lỗi biên dịch tại `ApplicationDbContext.cs`.

### Chi tiết kỹ thuật đã áp dụng

- [x] `Connection.FollowerId` -> `ApplicationUser` = `Restrict`.
- [x] `Connection.FolloweeId` -> `ApplicationUser` = `Restrict`.
- [x] `Post.UserId` -> `ApplicationUser` = `NoAction`.
- [x] `Comment.PostId` -> `Post` = `NoAction`.
- [x] `Comment.UserId` -> `ApplicationUser` = `NoAction`.
- [x] `Like.PostId` -> `Post` = `NoAction`.
- [x] `Like.CommentId` -> `Comment` = `NoAction`.
- [x] `Like.UserId` -> `ApplicationUser` = `NoAction`.
- [x] `PostReport.ReporterId` -> `ApplicationUser` = `NoAction`.
- [x] `PostReport.PostId` -> `Post` = `NoAction`.
- [x] `Story.UserId` -> `ApplicationUser` = `NoAction`.
- [x] `Notification.UserId` -> `ApplicationUser` = `NoAction`.

### Thanh tiến độ chi tiết hiện tại

- [x] Giai đoạn 1: Thiết Kế CSDL & EF Core: 100%.
- [/] Giai đoạn 2: Backend Core & Security: 35% (đã có AuthController + JWT cơ bản + Identity cấu hình; còn thiếu services layer chuẩn 3 lớp, hoàn thiện rule/password-lockout, CORS chặt và hardening auth).
- [ ] Giai đoạn 3: RESTful APIs nghiệp vụ chính: 5% (mới ở mức khởi tạo nền tảng dữ liệu, chưa triển khai đầy đủ các API Posts/Comments/Likes/Connections/Stories/Notifications/Reports).
- [/] Giai đoạn 4: Frontend Setup: 40% (đã có Vite + React + TS + Tailwind; còn thiếu router private/public hoàn chỉnh, interceptor chuẩn token và base layout).
- [ ] Giai đoạn 5: Frontend Integration: 0%.
- [ ] Giai đoạn 6: Test & Cloud Deployment: 0%.
