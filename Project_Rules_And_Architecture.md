# Quy Tắc Dự Án & Kiến Trúc Hệ Thống (Project Rules & Architecture)

## 1. Công Nghệ Sử Dụng (Tech Stack)
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
- **Kiến trúc 3 lớp (3-layer Architecture):** Luôn tuân thủ luồng dữ liệu: `Controllers` -> `Services` -> `DbContext` (hoặc `Repositories`).
- **Data Transfer Objects (DTOs):** **BẮT BUỘC** sử dụng DTOs cho các request và response. KHÔNG bao giờ trả về trực tiếp Entity (Model) của cơ sở dữ liệu qua API.
- **Không có Business Logic trong Controllers:** Controllers chỉ có nhiệm vụ nhận HTTP Request, gọi xử lý từ Services, và trả về HTTP Response (Ok, BadRequest, NotFound,...).
- **Bảo mật (Security):** Phải triển khai JWT Authentication đầy đủ. Phân quyền và bảo vệ các API endpoint nhạy cảm bằng thuộc tính `[Authorize]`. Cấu hình CORS chặt chẽ.

---

## 3. Quy Tắc Lập Trình Frontend (Strict Frontend Rules)
- **Typescript Strict Mode:** Đảm bảo code type-safe, không dùng `any` bừa bãi.
- **Cấu trúc Component:** Khuyến khích chia nhỏ components có thể tái sử dụng.
- **Xử lý gọi API:** Tập trung các lệnh gọi API tại thư mục `services/` (ví dụ: `api.ts`), cấu hình sẵn Axios interceptors để tự động gắn Bearer Token vào header với mỗi request và xử lý logic khi token hết hạn (refresh token/logout).
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
