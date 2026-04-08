# Quy Tắc Dự Án & Kiến Trúc Hệ Thống (Project Rules & Architecture)

## 1. Công Nghệ Sử Dụng (Tech Stack)

<!-- admin/admin123 (không xóa phần này cái này tôi để nhớ, không sợ rò rỉ thông tin) -->

### Backend

- **Framework:** .NET 8 / .NET 10 (ASP.NET Core Web API)
- **ORM:** Entity Framework Core (EF Core)
- **Database:** SQL Server (hoặc Database tương ứng cấu hình)
- **Authentication/Authorization:** ASP.NET Core Identity & JWT (JSON Web Token)

### Frontend

- **Framework:** React 18+ (khởi tạo bằng Vite)
- **Ngôn ngữ:** TypeScript (chế độ Strict Mode)
- **Styling:** Tailwind CSS
- **Quản lý form:** React Hook Form
- **Giao tiếp API:** Axios (sử dụng Interceptors để xử lý token)

---

## 2. Quy Tắc Lập Trình Backend (Strict Backend Rules)

- **Kiến trúc nhiều lớp (Assignment-aligned):** Tuân thủ luồng dữ liệu: `Controllers` -> `Services` -> `Repositories` -> `DbContext`.
- **Data Transfer Objects (DTOs):** **BẮT BUỘC** sử dụng DTOs cho các request và response. KHÔNG bao giờ trả về trực tiếp Entity (Model) của cơ sở dữ liệu qua API.
- **Không có Business Logic trong Controllers:** Controllers chỉ có nhiệm vụ nhận HTTP Request, gọi xử lý từ Services, và trả về HTTP Response (Ok, BadRequest, NotFound,...).
- **Bảo mật (Security):** Phải triển khai JWT Authentication đầy đủ. Phân quyền và bảo vệ các API endpoint nhạy cảm bằng thuộc tính `[Authorize]`, đồng thời hỗ trợ role-based và policy-based authorization theo assignment. Cấu hình CORS chặt chẽ.
- **Chuẩn response API:** Ưu tiên chuẩn hóa response format thống nhất toàn hệ thống (ví dụ: `success`, `data`, `errors`) để dễ tích hợp frontend và test.
- **Quy mô API tối thiểu theo đề:** Đảm bảo tối thiểu 6 API controllers và 20 endpoints JSON có DTO + validation.
- **Services theo đề:** Tối thiểu 5 service classes có interface, DI đầy đủ, hỗ trợ unit-test.

---

## 3. Quy Tắc Lập Trình Frontend (Strict Frontend Rules)

- **Typescript Strict Mode:** Đảm bảo code type-safe, không dùng `any` bừa bãi.
- **Cấu trúc Component:** Khuyến khích chia nhỏ components có thể tái sử dụng.
- **Xử lý gọi API & Caching:** Sử dụng Axios kết hợp với thư viện caching như React Query (hoặc SWR) để gọi API và cache dữ liệu client-side. Cấu hình Axios interceptors để tự động gắn Bearer Token và xử lý Refresh Token khi gặp `401`.
- **Quản lý Form & Validation:** Sử dụng React Hook Form kết hợp với thư viện validation (như Yup hoặc Zod) để kiểm tra tính hợp lệ của dữ liệu trước khi submit.

---

## 4. Lược Đồ Cơ Sở Dữ Liệu Hiện Tại (Current Database Schema)

Hiện tại, phase thiết kế cơ sở dữ liệu (Phase 1) đã hoàn tất. **BẮT BUỘC KHÔNG ĐƯỢC AI TỰ Ý "HALLUCINATE" HOẶC TẠO THÊM BẢNG MỚI.** Hãy chỉ sử dụng các Entities thuộc thư mục `/Models` hiện diện (đã fix EF Core và Migration):

- `ApplicationUser` (Kế thừa từ IdentityUser)
- `Comment`
- `Connection` (Bảng Follower - Followee)
- `Hashtag`
- `Like` (Áp dụng cho cả Post và Comment)
- `Notification`
- `Post`
- `PostReport`
- `Story`
- Có thực thể Join vô danh cho quan hệ n-n giữa `Post` và `Hashtag` (`PostHashtags` table).

Yêu cầu kèm theo từ assignment cho phần DB:

- Có ít nhất 3 migration files.
- Có seed data phục vụ test.
- Có database diagram trong tài liệu nộp bài.

---

## 5. Phạm Vi Assignment Cần Bám Sát

- Scope bắt buộc cho Posts theo assignment hiện tại: **text + image + hashtag**.
- Upload video cho Posts: **không phải yêu cầu bắt buộc chấm điểm**, chỉ xem như optional enhancement khi còn thời gian.

---

## 6. Checklist Bắt Buộc Khi Hoàn Thành Đồ Án

- Frontend: đáp ứng đầy đủ F1-F4 (component architecture, state management, forms/validation, routing/protected routes + dynamic features).
- Backend: đáp ứng đầy đủ B1-B4 (DB/EF, REST API + DTO, JWT authz/authn, services + repository).
- Testing: có test project, ít nhất 15 unit tests, test cho >= 3 services, coverage services >= 60%.
- Deployment: có Azure App Service + Azure SQL + Azure Blob Storage + CI/CD + monitoring.
- Submission: đủ source, migration + seed/sql script, tài liệu, screenshots, test reports, deployment docs theo mục 4 của assignment.
