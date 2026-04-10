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
- [ ] Cần bổ sung các hạng mục còn thiếu theo rubric: chuẩn response format cho toàn bộ controllers, repository pattern, client-side caching, test coverage (đặc biệt AuthService), Swagger examples, CI/CD Azure chi tiết.

## Ma trận Requirement Chấm Điểm

- [/] **F1:** Component architecture + responsive design (mục tiêu >= 15 components; đã bắt đầu scaffold cấu trúc `components/layouts/pages/services/contexts/types` và layout nền, đã refactor Home Feed theo hướng component tái sử dụng `PostCard`, đã thêm custom hook `useDebounce<T>` cho luồng search).
- [/] **F2:** State management + API integration + interceptors + auth flow + client-side caching (đã hoàn thành thin slice login + logout + 401 handling với React Context + Axios client/interceptors + service layer + route guard; đã thêm thin slice React Query cache cho Home Feed posts + mutation delete/like với invalidate query và bổ sung error handling rõ ràng cho 2 action; đã tích hợp thêm query/mutation cho comment theo từng post; đã tích hợp query/mutation hồ sơ người dùng cho profile edit; đã tích hợp query/mutation cho notification list + mark-as-read; đã tích hợp query/mutation follow/unfollow và danh sách followers/following trên Profile; đã tích hợp mutation report bài viết; còn mở rộng flow).
- [/] **F3:** React Hook Form + validation + upload preview + UX states (đã hoàn thành RHF + validation cho login/register và thin slice Create Post Form gồm content validation + upload ảnh + preview + mutation loading state; đã thêm Comment Form với validation required + max 500 ký tự; đã thêm Profile Edit Form với validation bio max 500 + avatar URL; còn mở rộng cho các form nghiệp vụ khác).
- [/] **F4:** Routing/protected routes + search debounce + pagination/infinite + lazy/skeleton + SignalR client + client-side caching dữ liệu truy cập thường xuyên (đã setup protected routes `/` + `/login` + `/register` + `/profile/:userId` + `/notifications` + `/search`, đã tích hợp search debounce 500ms ở Navbar + điều hướng query param `?q=...`, đã hoàn thiện search API call thật với React Query (`['search', query]` -> `GET /users/search`), đã tích hợp Home Feed pagination kiểu load-more bằng `useInfiniteQuery`, đã áp dụng route-level lazy loading bằng `React.lazy` + `Suspense` fallback, có cache posts + profile + notifications qua React Query; còn thiếu dynamic features nâng cao).
- [/] **B1:** Database & EF (đã có entities/relationships/migrations cơ bản; còn đủ >= 3 migrations, seed data, database diagram).
- [x] **B2:** RESTful API + DTO (đã có Auth/Posts/Users/Friends/Stories/Notifications + Comments Thin Slice 1-2 (repository + DTO + service + DI + controller) + Likes Thin Slice 1-2 (repository + DTO + service + DI + controller) + Reports Thin Slice 1-2 (repository + DTO + service + DI + controller `POST /api/reports/post/{postId:int}`), chuẩn hóa response format cho Auth/Posts/Users/Friends/Stories/Notifications/Comments/Likes/Reports + middleware 401/403; đã vượt mốc endpoint tối thiểu với 28 endpoints qua Swagger runtime check).
- [x] **B3:** JWT auth/authz (đã có JWT + role seeding + role-based + policy-based authorization).
- [/] **B4:** Services layer theo rubric (đã dựng nền Generic Repository + Custom PostRepository + refactor `PostService` sang repository + DI + thêm `UsersService` (UserManager-based) + `FriendsService` (ConnectionRepository-based) + `StoriesService` (StoryRepository-based) + `NotificationsService` (NotificationRepository-based) + `CommentsService` (CommentRepository-based) + `LikesService` (LikeRepository-based) + `ReportsService` (ReportRepository-based); đã bổ sung luồng xóa post an toàn theo thứ tự dọn dữ liệu liên quan khi dùng `DeleteBehavior.NoAction`; đã vượt mốc >= 5 service classes, hạng mục Azure Blob upload service được dời sang Giai đoạn 6 theo quyết định phạm vi).
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

- [x] **Posts API:** CRUD bài viết, upload ảnh, tích hợp hashtag (đã xong Step 1-5: CRUD text + upload ảnh + hashtag).
- [x] **Comments API:** Thêm/sửa/xóa bình luận trên bài viết (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `CommentsController` với `POST post/{postId}`, `GET post/{postId}` (allow anonymous), `DELETE {id}`).
- [x] **Likes API:** Xử lý logic Like/Unlike bài viết và bình luận (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `LikesController` với `POST post/{postId}` và `POST comment/{commentId}`).
- [x] **Friends/Connections API:** Xử lý logic follow/friend request, hủy theo dõi, danh sách friends/followers/following (đã xong Thin Slice 1 + Thin Slice 2 + Unfollow Slice: repository + DTO + service + DI + `FriendsController` với `POST follow`, `DELETE unfollow`, `GET followers`, `GET following`; phạm vi assignment hiện tại đã hoàn tất).
- [x] **Stories API:** CRUD story (Tự động hết hạn sau 24h) (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `StoriesController` với `POST`, `GET active`, `DELETE`; phạm vi assignment hiện tại đã hoàn tất).
- [x] **Notifications API:** Lấy danh sách thông báo, đánh dấu đã đọc (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `NotificationsController` với `GET list` và `PUT read`).
- [x] **Reports API:** Tạo report cho bài viết (đã xong Thin Slice 1 + Thin Slice 2: repository + DTO + service + DI + `ReportsController` với `POST /api/reports/post/{postId:int}`).
- [x] **Users API:** Hồ sơ user, cập nhật profile, lấy thông tin user theo id/username, search user theo query (đã có Thin Slice 1 + Thin Slice 2 + Search Slice: `UsersController` với `GET /api/users/{id}`, `PUT /api/users/{id}` + policy `SelfOrAdmin`, `GET /api/users/search?q=...`; phạm vi assignment hiện tại đã hoàn tất).
- [x] Hoàn thiện đủ bộ controller bắt buộc theo đề: `AuthController`, `PostsController`, `UsersController`, `FriendsController`, `StoriesController`, `NotificationsController` (đã có đủ 6/6; hiện tại đã mở rộng thêm `CommentsController`, `LikesController`).
- [x] Triển khai DTOs cho toàn bộ endpoint + validation DataAnnotations (đã có Posts + Users + Friends + Stories + Notifications + Comments + Likes + Reports và các DTO response/request tương ứng).
- [x] Chuẩn hóa API response format thống nhất (`success`, `data`, `errors`) (đã áp dụng cho Auth + Posts + Users + Friends + Stories + Notifications + Comments + Likes + Reports + middleware 401/403).
- [x] Đảm bảo tối thiểu **6 controllers** và **20 endpoints** theo requirement B2 (đã có >= 9 controllers và 28 endpoints theo Swagger runtime check).
- [x] Bổ sung Repository pattern + tối thiểu 5 service classes (B4) (đã có `IGenericRepository<T>` + `GenericRepository<T>` + `IPostRepository` + `PostRepository` + `IConnectionRepository` + `ConnectionRepository` + `IStoryRepository` + `StoryRepository` + `INotificationRepository` + `NotificationRepository` + `ICommentRepository` + `CommentRepository` + `ILikeRepository` + `LikeRepository` + `IReportRepository` + `ReportRepository`, đã refactor `PostService`, thêm `UsersService` + `FriendsService` + `StoriesService` + `NotificationsService` + `CommentsService` + `LikesService` + `ReportsService` và đăng ký DI; hiện có 9 service classes chính `AuthService`, `PostService`, `UsersService`, `FriendsService`, `StoriesService`, `NotificationsService`, `CommentsService`, `LikesService`, `ReportsService`).

---

## Giai đoạn 4: Cài Đặt Frontend & Kiến Trúc Giao Diện (Frontend Setup)

- [x] Khởi tạo dự án Vite (React + TS).
- [x] Tích hợp Tailwind CSS.
- [/] Hoàn thiện kiến trúc component (mục tiêu >= 15 components), custom hooks và responsive navigation (đã dựng scaffold thư mục + các khối nền ban đầu, đã bổ sung custom hook `useDebounce<T>` cho search flow).
- [/] Thiết lập state management global (Context API hoặc Redux Toolkit) (đã có `AuthContext` quản lý user/token, login/logout, khởi tạo state từ localStorage).
- [/] Setup Axios Interceptors (Tự động thêm token Authorization) (đã có `axiosClient` + request/response interceptors + xử lý global `401` để clear localStorage và ép về `/login`, đồng thời loại trừ `/auth/login`/`/auth/register` để không reset form khi sai mật khẩu).
- [x] Tích hợp React Query (hoặc SWR) để client-side caching dữ liệu truy cập thường xuyên (đã setup `QueryClientProvider`, `useQuery` cho Home Feed posts và cache theo queryKey).
- [ ] (Optional nhưng khuyến khích) Xử lý Refresh Token mechanism trong Axios Interceptor khi gặp 401.
- [/] Setup Router (React Router DOM) cho nested routes + protected routes (đã có routes `/`, `/login`, `/register`, `/profile/:userId`, `/notifications`, `/search` + `ProtectedRoute` cho các trang cần auth).
- [/] Tạo Layouts cơ sở (Navbar, Sidebar, Main Content, Footer) + lazy loading/skeleton (đã có `MainLayout` 3 cột + `Navbar`, đã thêm `PageLoader` và bọc `Routes` bằng `Suspense` để lazy-load route pages).

---

## Giai đoạn 5: Tích hợp Giao Diện và API (Frontend Integration)

- [/] Màn hình Authentication (Đăng nhập, Đăng ký bằng React Hook Form) (đã hoàn thành thin slice login + logout + register: gọi API auth, xử lý lỗi backend, lưu token/user vào localStorage, điều hướng route auth, lifecycle token hết hạn qua interceptor; còn thiếu polish UI/UX và các case nâng cao).
- [/] Màn hình Home Feed (đã có thin slice hiển thị danh sách bài viết từ API + loading/error/empty states + Create Post Form upload/preview ảnh ở đầu feed + `PostCard` tái sử dụng cho render item, đã tích hợp StoriesBar (Tin 24h) với create/view/delete story, đã tích hợp toggle CommentSection trong PostCard, đã tích hợp phân trang load-more bằng `useInfiniteQuery`, đã tích hợp báo cáo bài viết cho user không phải chủ bài viết; còn tối ưu UX nâng cao).
- [/] Màn hình Search (đã hoàn thành full-stack slice SearchPage + query param `q` + điều hướng từ Navbar bằng debounce 500ms + gọi API thật `GET /users/search?q=...` qua React Query, hiển thị loading/error/empty/result states và điều hướng profile từ kết quả search; còn tối ưu UX nâng cao).
- [/] Tích hợp tính năng Like/Comment thời gian thực (hoặc gọi API tối ưu) (đã có toggle like cho post qua mutation + invalidate cache, đã sửa lỗi hiển thị count để phản ánh đúng dữ liệu backend; đã có comment CRUD cơ bản theo post (list/create/delete) và đồng bộ lại commentCount qua invalidate cache; còn comment realtime/tối ưu API).
- [/] Màn hình Profile cá nhân (đã hoàn thành thin slice Profile View + Edit Profile: hiển thị avatar/userName/email/dateJoined/role/bio, cho phép chính chủ cập nhật bio/avatarUrl, đồng bộ cache `['profile', userId]` và `['posts']`; đã tích hợp Friends UI gồm toggle button follow/unfollow + follower/following counts + cache revalidate cho cả profile đang xem và user hiện tại; còn danh sách bài viết theo user).
- [/] Màn hình Notification (đã hoàn thành thin slice danh sách thông báo + đánh dấu đã đọc qua mutation + invalidate cache + route riêng + navbar link; còn mở rộng realtime/sắp xếp nâng cao).
- [/] Form validation đầy đủ (register/login/post/profile), preview upload ảnh, error/loading UX (đã có validation cho login + register + create post (content required/maxLength, image preview/remove, submit pending state, invalidate posts cache) + create comment (required/maxLength 500) + edit profile (bio maxLength 500, avatar URL format); còn thiếu UX states nâng cao).
- [/] Áp dụng caching strategy (React Query/SWR) vào Home Feed, Profile, Notification để đáp ứng F4 (đã áp dụng cho Home Feed posts dạng infinite query + Profile + Notification; còn tối ưu sâu cho dynamic features).

---

## Giai đoạn 6: Kiểm thử & Triển khai Cloud (Cloud Deployment)

- [ ] Tạo test project (xUnit/NUnit) và viết >= 15 unit tests cho >= 3 service classes.
- [ ] Viết Unit Test bắt buộc cho logic Authentication/Authorization (`AuthService`) theo yêu cầu T1.
- [ ] Đạt >= 60% code coverage cho services + có test cases positive/negative.
- [ ] Viết integration tests cho workflow quan trọng (Auth, Posts).
- [ ] Triển khai Azure App Service + Azure SQL + Azure Blob Storage.
- [ ] Hoàn thiện File upload service dùng Azure Blob Storage cho ảnh (B4/D1).
- [ ] Tích hợp SignalR cho thông báo real-time.
- [ ] Thiết lập CI/CD (GitHub Actions hoặc Azure DevOps) chạy build/test/deploy tự động.
- [ ] Cấu hình monitoring/logging (Application Insights) + tài liệu deployment.

---

## Giai đoạn 7: Hồ Sơ Nộp Bài (Submission Package)

- [ ] Hoàn thiện README (overview, setup/install, endpoint list/API docs).
- [ ] Cấu hình Swagger nâng cao: bật XML Comments và thêm Example Requests/Responses cho các API chính (chuyển sang package tài liệu nộp).
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
- [x] Giai đoạn 3: RESTful APIs nghiệp vụ chính: 100% (đã hoàn thành Posts Step 1-5 + chuẩn response format cho Auth/Posts/Users/Friends/Stories/Notifications/Comments/Likes/Reports + dựng nền Generic Repository + Custom PostRepository + refactor `PostService` sang repository + Users Thin Slice 1-2 + Friends Thin Slice 1-2 + Unfollow Slice (repository + DTO + service + DI + controller) + Stories Thin Slice 1-2 (repository + DTO + service + DI + controller) + Notifications Thin Slice 1-2 (repository + DTO + service + DI + controller) + Comments Thin Slice 1-2 (repository + DTO + service + DI + controller) + Likes Thin Slice 1-2 (repository + DTO + service + DI + controller) + Reports Thin Slice 1-2 (repository + DTO + service + DI + controller); đã đạt mốc >= 20 endpoint (28 qua Swagger). Các hạng mục SignalR/Azure Blob được chuyển sang Giai đoạn 6 theo quyết định phạm vi).
- [/] Giai đoạn 4: Frontend Setup: 85% (đã có Vite + React + TS + Tailwind + scaffold + `MainLayout`/`Navbar` + protected routing + Context API auth + axios client/interceptors + global `401` handling + React Query provider + route-level lazy loading (`React.lazy` + `Suspense` + `PageLoader`) + custom hook `useDebounce<T>`; còn refresh token, skeleton nâng cao và mở rộng kiến trúc component).
- [x] Giai đoạn 5: Frontend Integration: 100% (đã hoàn thành module auth frontend, Home Feed (React Query cache posts/infinite load-more + Create Post Form RHF upload/preview + StoriesBar Tin 24h create/view/delete), refactor `PostCard` với delete/like/comment/report, Profile thin slice (view/edit + follow/unfollow), Notification thin slice (list/mark-as-read), Search full-stack slice (debounce navbar + route `/search` + API `GET /users/search`) theo phạm vi assignment hiện tại).
- [ ] Giai đoạn 6: Test & Cloud Deployment: 0%.
- [ ] Giai đoạn 7: Hồ Sơ Nộp Bài: 0%.
