# Bảng Theo Dõi Tiến Độ Master (Master Plan Tracker)

**Quy ước trạng thái:**

- `[x]` DONE: Đã hoàn thành
- `[/]` IN PROGRESS: Đang tiến hành
- `[ ]` TODO: Chưa bắt đầu

## 📂 File Nhật Ký Chi Tiết (Logs)

- [📝 Nhật Ký Backend (API, DB, Auth, v.v.)](./Tracker_Backend_Logs.md)
- [📝 Nhật Ký Frontend (React, UI/UX, Vite, v.v.)](./Tracker_Frontend_Logs.md)

## Đối chiếu Assignment.pdf (07/04/2026)

- [x] Đã rà soát lại toàn bộ yêu cầu F1-F4, B1-B4, T1, D1 trực tiếp từ `assignment.pdf`.
- [x] Điều chỉnh phạm vi Posts: **upload video không phải yêu cầu bắt buộc**; assignment yêu cầu post text + image.
- [ ] Cần bổ sung các hạng mục còn thiếu theo rubric: role/policy authorization, chuẩn response format, đủ 6 controllers/20 endpoints, repository pattern, test coverage, CI/CD Azure chi tiết.

## Ma trận Requirement Chấm Điểm

- [ ] **F1:** Component architecture + responsive design (mục tiêu >= 15 components).
- [ ] **F2:** State management + API integration + interceptors + auth flow.
- [ ] **F3:** React Hook Form + validation + upload preview + UX states.
- [ ] **F4:** Routing/protected routes + search debounce + pagination/infinite + lazy/skeleton + SignalR client.
- [/] **B1:** Database & EF (đã có entities/relationships/migrations cơ bản; còn đủ >= 3 migrations, seed data, database diagram).
- [/] **B2:** RESTful API + DTO (đã có Auth/Posts; còn đủ bộ 6 controllers, >= 20 endpoints, standardized response format).
- [/] **B3:** JWT auth/authz (đã có JWT + authorize cơ bản; còn role seeding + role/policy authorization).
- [ ] **B4:** Services layer theo rubric (cần hoàn thiện >= 5 services + repository pattern + Azure Blob upload service).
- [ ] **T1:** Unit/Integration testing theo ngưỡng rubric.
- [ ] **D1:** Azure deployment + CI/CD + monitoring.

---

## Giai đoạn 1: Thiết Kế Cơ Sở Dữ Liệu & EF Core (Phase 1)

- [x] Tạo các Entities cốt lõi (ApplicationUser, Post, Comment, Like, Connection, Story, Notification, Hashtag, PostReport).
- [x] Cấu hình ApplicationDbContext (IdentityDbContext).
- [x] Định nghĩa Fluent API cho các mối quan hệ (OnModelCreating), đặc biệt xử lý cascade delete path conflicts.
- [/] Chạy Entity Framework Migrations và cập nhật DB thành công (đã có migration nền tảng, còn đạt yêu cầu >= 3 migration files).
- [ ] Seed initial data cho môi trường test.
- [ ] Hoàn thiện database diagram để nộp bài.

---

## Giai đoạn 2: Backend Core & Bảo Mật (Backend Core & Security)

- [x] Thiết lập Services Layer (Tạo Dependency Injection cho các services).
- [x] Cấu hình ASP.NET Core Identity (Mật khẩu, Lockout, User rules) + JWT Authentication cơ bản.
- [x] Tạo AuthController (Đăng nhập, Đăng ký, trả JWT).
- [x] Cấu hình CORS để cho phép Frontend React gọi API.
- [ ] Seed role `User`, `Admin` và hoàn thiện role-based authorization cho endpoint nghiệp vụ.
- [ ] Bổ sung policy-based authorization (claims/policies) cho user-specific data.

---

## Giai đoạn 3: Phát triển RESTful APIs (RESTful APIs Development)

- [/] **Posts API:** CRUD bài viết, upload ảnh, tích hợp hashtag (đã xong Step 1-5: CRUD text + upload ảnh + hashtag).
- [ ] **Comments API:** Thêm/sửa/xóa bình luận trên bài viết.
- [ ] **Likes API:** Xử lý logic Like/Unlike bài viết và bình luận.
- [ ] **Friends/Connections API:** Xử lý logic follow/friend request, danh sách friends/followers/following.
- [ ] **Stories API:** CRUD story (Tự động hết hạn sau 24h).
- [ ] **Notifications API:** Lấy danh sách thông báo, đánh dấu đã đọc.
- [ ] **Reports API:** Tạo report cho bài viết.
- [ ] **Users API:** Hồ sơ user, cập nhật profile, lấy thông tin user theo id/username.
- [ ] Hoàn thiện đủ bộ controller bắt buộc theo đề: `AuthController`, `PostsController`, `UsersController`, `FriendsController`, `StoriesController`, `NotificationsController`.
- [/] Triển khai DTOs cho toàn bộ endpoint + validation DataAnnotations (Posts đã có, các module khác chưa).
- [ ] Chuẩn hóa API response format thống nhất (`success`, `data`, `errors`).
- [ ] Đảm bảo tối thiểu **6 controllers** và **20 endpoints** theo requirement B2.
- [ ] Bổ sung Repository pattern + tối thiểu 5 service classes (B4).
- [ ] File upload service dùng Azure Blob Storage cho ảnh (B4/D1).
- [ ] Tích hợp SignalR cho thông báo real-time.

---

## Giai đoạn 4: Cài Đặt Frontend & Kiến Trúc Giao Diện (Frontend Setup)

- [x] Khởi tạo dự án Vite (React + TS).
- [x] Tích hợp Tailwind CSS.
- [ ] Hoàn thiện kiến trúc component (mục tiêu >= 15 components), custom hooks và responsive navigation.
- [ ] Thiết lập state management global (Context API hoặc Redux Toolkit).
- [ ] Setup Axios Interceptors (Tự động thêm token Authorization).
- [ ] Setup Router (React Router DOM) cho nested routes + protected routes.
- [ ] Tạo Layouts cơ sở (Navbar, Sidebar, Main Content, Footer) + lazy loading/skeleton.

---

## Giai đoạn 5: Tích hợp Giao Diện và API (Frontend Integration)

- [ ] Màn hình Authentication (Đăng nhập, Đăng ký bằng React Hook Form).
- [ ] Màn hình Home Feed (Hiển thị bài viết, stories, phân trang/scroll vô tận, search debounce).
- [ ] Tích hợp tính năng Like/Comment thời gian thực (hoặc gọi API tối ưu).
- [ ] Màn hình Profile cá nhân (Hiển thị info, chỉ số follow, danh sách bài viết).
- [ ] Màn hình Notification.
- [ ] Form validation đầy đủ (register/login/post/profile), preview upload ảnh, error/loading UX.

---

## Giai đoạn 6: Kiểm thử & Triển khai Cloud (Cloud Deployment)

- [ ] Tạo test project (xUnit/NUnit) và viết >= 15 unit tests cho >= 3 service classes.
- [ ] Đạt >= 60% code coverage cho services + có test cases positive/negative.
- [ ] Viết integration tests cho workflow quan trọng (Auth, Posts).
- [ ] Triển khai Azure App Service + Azure SQL + Azure Blob Storage.
- [ ] Thiết lập CI/CD (GitHub Actions hoặc Azure DevOps) chạy build/test/deploy tự động.
- [ ] Cấu hình monitoring/logging (Application Insights) + tài liệu deployment.

---

## Giai đoạn 7: Hồ Sơ Nộp Bài (Submission Package)

- [ ] Hoàn thiện README (overview, setup/install, endpoint list/API docs).
- [ ] Chuẩn bị SQL script tạo DB + migration files + seed script.
- [ ] Bổ sung screenshots tính năng chính (>= 10).
- [ ] Tổng hợp test execution results + coverage report vào tài liệu.
- [ ] Chuẩn bị deployment artifacts: live URL, pipeline YAML, Azure resource list.
- [ ] Đóng gói đúng định dạng nộp bài (repo link + tài liệu + archive theo guideline).

---

## Thanh tiến độ chi tiết hiện tại

- [/] Giai đoạn 1: Thiết Kế CSDL & EF Core: 80% (đã xong entities/relationships/migrations nền tảng; còn yêu cầu >= 3 migrations, seed data, database diagram).
- [/] Giai đoạn 2: Backend Core & Security: 75% (đã xong Identity/JWT/CORS/Auth cơ bản; còn role seeding + role/policy authorization theo rubric).
- [/] Giai đoạn 3: RESTful APIs nghiệp vụ chính: 35% (đã hoàn thành Posts Step 1-5; còn Users/Friends/Stories/Notifications/... + chuẩn response format + chỉ tiêu 6 controllers/20 endpoints).
- [/] Giai đoạn 4: Frontend Setup: 30% (đã có Vite + React + TS + Tailwind; còn state management, kiến trúc component/hook, protected routes, lazy/skeleton).
- [ ] Giai đoạn 5: Frontend Integration: 0%.
- [ ] Giai đoạn 6: Test & Cloud Deployment: 0%.
- [ ] Giai đoạn 7: Hồ Sơ Nộp Bài: 0%.
