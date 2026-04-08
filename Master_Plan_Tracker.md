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
- [ ] Cần bổ sung các hạng mục còn thiếu theo rubric: chuẩn response format cho toàn bộ controllers, đủ 6 controllers/20 endpoints, repository pattern, client-side caching, test coverage (đặc biệt AuthService), Swagger examples, CI/CD Azure chi tiết.

## Ma trận Requirement Chấm Điểm

- [ ] **F1:** Component architecture + responsive design (mục tiêu >= 15 components).
- [ ] **F2:** State management + API integration + interceptors + auth flow + client-side caching.
- [ ] **F3:** React Hook Form + validation + upload preview + UX states.
- [ ] **F4:** Routing/protected routes + search debounce + pagination/infinite + lazy/skeleton + SignalR client + client-side caching dữ liệu truy cập thường xuyên.
- [/] **B1:** Database & EF (đã có entities/relationships/migrations cơ bản; còn đủ >= 3 migrations, seed data, database diagram).
- [/] **B2:** RESTful API + DTO (đã có Auth/Posts/Users/Friends/Stories/Notifications + standardized response format cho Auth/Posts/Users/Friends/Stories/Notifications và middleware 401/403; đã đủ bộ 6 controllers, còn >= 20 endpoints, mở rộng response format cho các controller mới, và Swagger examples request/response).
- [x] **B3:** JWT auth/authz (đã có JWT + role seeding + role-based + policy-based authorization).
- [/] **B4:** Services layer theo rubric (đã dựng nền Generic Repository + Custom PostRepository + refactor `PostService` sang repository + DI + thêm `UsersService` (UserManager-based) + `FriendsService` (ConnectionRepository-based) + `StoriesService` (StoryRepository-based) + `NotificationsService` (NotificationRepository-based); đã vượt mốc >= 5 service classes, còn hạng mục Azure Blob upload service).
- [ ] **T1:** Unit/Integration testing theo ngưỡng rubric (bắt buộc test logic Authentication/Authorization của AuthService).
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
- [x] Seed role `User`, `Admin` và hoàn thiện role-based authorization cho endpoint nghiệp vụ.
- [x] Bổ sung policy-based authorization (claims/policies) cho user-specific data.

---

## Giai đoạn 3: Phát triển RESTful APIs (RESTful APIs Development)

- [/] **Posts API:** CRUD bài viết, upload ảnh, tích hợp hashtag (đã xong Step 1-5: CRUD text + upload ảnh + hashtag).
- [ ] **Comments API:** Thêm/sửa/xóa bình luận trên bài viết.
- [ ] **Likes API:** Xử lý logic Like/Unlike bài viết và bình luận.
- [/] **Friends/Connections API:** Xử lý logic follow/friend request, danh sách friends/followers/following (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `FriendsController` với `POST follow`, `GET followers`, `GET following`; còn mở rộng theo roadmap nếu cần).
- [/] **Stories API:** CRUD story (Tự động hết hạn sau 24h) (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `StoriesController` với `POST`, `GET active`, `DELETE`; còn mở rộng theo roadmap nếu cần).
- [x] **Notifications API:** Lấy danh sách thông báo, đánh dấu đã đọc (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `NotificationsController` với `GET list` và `PUT read`).
- [ ] **Reports API:** Tạo report cho bài viết.
- [/] **Users API:** Hồ sơ user, cập nhật profile, lấy thông tin user theo id/username (đã có Thin Slice 1 + Thin Slice 2: `UsersController` với `GET /api/users/{id}` và `PUT /api/users/{id}` + policy `SelfOrAdmin`; còn mở rộng endpoint theo roadmap).
- [x] Hoàn thiện đủ bộ controller bắt buộc theo đề: `AuthController`, `PostsController`, `UsersController`, `FriendsController`, `StoriesController`, `NotificationsController` (đã có đủ 6/6).
- [/] Triển khai DTOs cho toàn bộ endpoint + validation DataAnnotations (đã có Posts + Users Thin Slice 1 + Friends Thin Slice 1 + Stories Thin Slice 1 + Notifications Thin Slice 1, các module khác chưa).
- [/] Chuẩn hóa API response format thống nhất (`success`, `data`, `errors`) (đã áp dụng cho Auth + Posts + Users + Friends + Stories + Notifications + middleware 401/403, còn mở rộng toàn bộ controller).
- [ ] Cấu hình Swagger nâng cao: bật XML Comments và thêm Example Requests/Responses cho các API chính (theo yêu cầu B2).
- [ ] Đảm bảo tối thiểu **6 controllers** và **20 endpoints** theo requirement B2.
- [/] Bổ sung Repository pattern + tối thiểu 5 service classes (B4) (đã có `IGenericRepository<T>` + `GenericRepository<T>` + `IPostRepository` + `PostRepository` + `IConnectionRepository` + `ConnectionRepository` + `IStoryRepository` + `StoryRepository` + `INotificationRepository` + `NotificationRepository`, đã refactor `PostService`, thêm `UsersService` + `FriendsService` + `StoriesService` + `NotificationsService` và đăng ký DI; hiện có 6 service classes chính `AuthService`, `PostService`, `UsersService`, `FriendsService`, `StoriesService`, `NotificationsService`, còn mở rộng theo các module còn lại).
- [ ] File upload service dùng Azure Blob Storage cho ảnh (B4/D1).
- [ ] Tích hợp SignalR cho thông báo real-time.

---

## Giai đoạn 4: Cài Đặt Frontend & Kiến Trúc Giao Diện (Frontend Setup)

- [x] Khởi tạo dự án Vite (React + TS).
- [x] Tích hợp Tailwind CSS.
- [ ] Hoàn thiện kiến trúc component (mục tiêu >= 15 components), custom hooks và responsive navigation.
- [ ] Thiết lập state management global (Context API hoặc Redux Toolkit).
- [ ] Setup Axios Interceptors (Tự động thêm token Authorization).
- [ ] Tích hợp React Query (hoặc SWR) để client-side caching dữ liệu truy cập thường xuyên.
- [ ] (Optional nhưng khuyến khích) Xử lý Refresh Token mechanism trong Axios Interceptor khi gặp 401.
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
- [ ] Áp dụng caching strategy (React Query/SWR) vào Home Feed, Profile, Notification để đáp ứng F4.

---

## Giai đoạn 6: Kiểm thử & Triển khai Cloud (Cloud Deployment)

- [ ] Tạo test project (xUnit/NUnit) và viết >= 15 unit tests cho >= 3 service classes.
- [ ] Viết Unit Test bắt buộc cho logic Authentication/Authorization (`AuthService`) theo yêu cầu T1.
- [ ] Đạt >= 60% code coverage cho services + có test cases positive/negative.
- [ ] Viết integration tests cho workflow quan trọng (Auth, Posts).
- [ ] Triển khai Azure App Service + Azure SQL + Azure Blob Storage.
- [ ] Thiết lập CI/CD (GitHub Actions hoặc Azure DevOps) chạy build/test/deploy tự động.
- [ ] Cấu hình monitoring/logging (Application Insights) + tài liệu deployment.

---

## Giai đoạn 7: Hồ Sơ Nộp Bài (Submission Package)

- [ ] Hoàn thiện README (overview, setup/install, endpoint list/API docs).
- [ ] Tạo tài liệu "Component hierarchy documentation (tree structure)" nộp kèm (theo F1).
- [ ] Chuẩn bị SQL script tạo DB + migration files + seed script.
- [ ] Bổ sung screenshots tính năng chính (>= 10).
- [ ] Tổng hợp test execution results + coverage report vào tài liệu.
- [ ] Chuẩn bị deployment artifacts: live URL, pipeline YAML, Azure resource list.
- [ ] Đóng gói đúng định dạng nộp bài (repo link + tài liệu + archive theo guideline).

---

## Thanh tiến độ chi tiết hiện tại

- [/] Giai đoạn 1: Thiết Kế CSDL & EF Core: 80% (đã xong entities/relationships/migrations nền tảng; còn yêu cầu >= 3 migrations, seed data, database diagram).
- [x] Giai đoạn 2: Backend Core & Security: 100% (đã hoàn thiện Identity/JWT/CORS/Auth + role seeding + role/policy authorization theo rubric B3).
- [/] Giai đoạn 3: RESTful APIs nghiệp vụ chính: 84% (đã hoàn thành Posts Step 1-5 + chuẩn response format cho Auth/Posts/Users/Friends/Stories/Notifications + dựng nền Generic Repository + Custom PostRepository + refactor `PostService` sang repository + Users Thin Slice 1-2 + Friends Thin Slice 1-2 (repository + DTO + service + DI + controller) + Stories Thin Slice 1-2 (repository + DTO + service + DI + controller) + Notifications Thin Slice 1-2 (repository + DTO + service + DI + controller); còn mở rộng endpoint để đạt >= 20 và hoàn thiện format toàn bộ).
- [/] Giai đoạn 4: Frontend Setup: 30% (đã có Vite + React + TS + Tailwind; còn state management, kiến trúc component/hook, protected routes, lazy/skeleton).
- [ ] Giai đoạn 5: Frontend Integration: 0%.
- [ ] Giai đoạn 6: Test & Cloud Deployment: 0%.
- [ ] Giai đoạn 7: Hồ Sơ Nộp Bài: 0%.
