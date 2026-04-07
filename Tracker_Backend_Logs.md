# Nhật Ký Phát Triển Backend

[⬅ Quay lại Master Plan](./Master_Plan_Tracker.md)

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

---

## Nhật ký chạy Migration & Update DB (07/04/2026)

### Việc đã thực thi

- [x] Tạo migration mới tên `FixMultipleCascadePaths` từ cấu hình Fluent API trong `ApplicationDbContext`.
- [x] Build backend thành công trong quá trình tạo migration.
- [x] Kiểm tra migration file đã sinh đúng các thao tác `DropForeignKey` + `AddForeignKey` cho các quan hệ liên quan.
- [x] Chạy `dotnet ef database update` thành công.
- [x] Migration `20260407141819_FixMultipleCascadePaths` đã được apply vào bảng lịch sử migrations.

### Kết quả

- [x] Lỗi hướng `Multiple cascade paths` được xử lý bằng cấu hình delete behavior explicit.
- [x] Database đã đồng bộ với model hiện tại.

---

## Nhật ký cấu hình Program.cs chuẩn (07/04/2026)

### Việc đã thực thi

- [x] Chuẩn hóa đăng ký `ApplicationDbContext` với SQL Server trong `Backend/Program.cs`.
- [x] Cấu hình lại `IdentityCore<ApplicationUser>` với các rule mật khẩu và unique email.
- [x] Bổ sung CORS policy `FrontendCors` cho React Frontend.
- [x] Kết nối middleware `app.UseCors(FrontendCorsPolicy)` đúng thứ tự pipeline.
- [x] Dọn endpoint mẫu `weatherforecast` để Program.cs gọn cho API thực tế.
- [x] Xác nhận chạy thực tế: `dotnet build` thành công, `dotnet run` thành công và truy cập được Swagger tại `http://localhost:5035/swagger`.

### Kết quả

- [x] Program.cs đã sẵn nền tảng backend chuẩn cho DB + Identity + CORS theo .NET 8.
- [x] Ứng dụng backend khởi động ổn định ở môi trường Development.

---

## Nhật ký hoàn thiện luồng Auth 3 lớp (07/04/2026)

### Việc đã thực thi

- [x] Tạo bộ DTO mới trong `Backend/DTOs/Auth`: `RegisterDto`, `LoginDto`, `AuthResponseDto`.
- [x] Tạo `ITokenService` và `TokenService` để sinh JWT từ `ApplicationUser`.
- [x] Tạo `IAuthService` và `AuthService` để xử lý nghiệp vụ Register/Login bằng `UserManager` + `ITokenService`.
- [x] Refactor `AuthController` theo đúng kiến trúc 3 lớp: Controller chỉ nhận request/response, business logic nằm ở service.
- [x] Cập nhật `Program.cs` đăng ký DI `AddScoped` cho `IAuthService` và `ITokenService`.
- [x] Củng cố cấu hình `AddAuthentication().AddJwtBearer(...)` với validate signing key/lifetime.

### Kết quả

- [x] Luồng Authentication chuẩn hóa theo kiến trúc `Controllers -> Services -> Identity/UserManager`.
- [x] Endpoint test sẵn sàng trên Swagger: `POST /api/auth/register`, `POST /api/auth/login`.
- [x] Đã xác minh runtime: build thành công và Swagger JSON hiển thị đúng path `/api/auth/register` + `/api/auth/login`.

---

## Nhật ký cấu hình Swagger Authorize Bearer (07/04/2026)

### Việc đã thực thi

- [x] Cập nhật `Backend/Program.cs` để thêm Swagger Security Definition cho `Bearer` JWT.
- [x] Hoàn thiện cấu hình hiển thị nút `Authorize` trong Swagger UI cho Bearer token.
- [x] Bổ sung `Swagger Security Requirement` toàn cục để Swagger thật sự đính kèm header `Authorization: Bearer <token>` khi gọi endpoint cần bảo vệ.

### Kết quả

- [x] Swagger UI đã sẵn sàng cho flow test token `Bearer`.
- [x] Đã xác minh swagger.json có `securitySchemes -> Bearer` với `scheme: bearer`.
- [x] Đã xác minh swagger.json có phần `security` tham chiếu `Bearer`, khắc phục lỗi đã Authorize nhưng request vẫn 401 do thiếu header.

---

## Nhật ký test endpoint bảo vệ token (07/04/2026)

### Việc đã thực thi

- [x] Thêm endpoint `GET /api/test/protected` trong `AuthController`.
- [x] Gắn thẻ `[Authorize]` để buộc xác thực JWT trước khi truy cập.

### Kết quả đã xác minh thực tế

- [x] Chưa truyền token: trả về `401 Unauthorized`.
- [x] Truyền token hợp lệ sau khi login: trả về `200 OK`.
- [x] Response endpoint protected trả về username từ token đã xác thực.
- [x] Xác nhận thủ công từ test thực tế: `GET http://localhost:5035/api/test/protected` trả về `200 OK` với `username: admin`.

---

## Step 1 - Posts DTO + IPostService (07/04/2026)

### Việc đã thực thi

- [x] Phân tích entity `Post` hiện tại để chốt field DTO theo schema thật.
- [x] Tạo thư mục `Backend/DTOs/Posts` và bộ DTO: `CreatePostDto`, `UpdatePostDto`, `PostAuthorDto`, `PostResponseDto`, `PostListResponseDto`.
- [x] Tạo `Backend/Services/Interfaces/IPostService.cs` với các method CRUD cơ bản và get-all phân trang.

### Ghi chú phạm vi

- [x] Chỉ tạo DTO + Interface cho Step 1.
- [x] Chưa tạo Service Implementation.
- [x] Chưa tạo Controller Posts.

---

## Step 2 - Posts Service Implementation (07/04/2026)

### Việc đã thực thi

- [x] Tạo `Backend/Services/PostService.cs` triển khai `IPostService`.
- [x] Hoàn thiện các method service: `CreateAsync`, `GetByIdAsync`, `GetAllAsync` (phân trang), `UpdateAsync`, `DeleteAsync`.
- [x] Mapping dữ liệu từ `Post` + `ApplicationUser` sang `PostResponseDto`/`PostAuthorDto`.
- [x] Cập nhật DI trong `Backend/Program.cs`: `AddScoped<IPostService, PostService>()`.

### Ghi chú phạm vi

- [x] Chỉ làm service layer theo Step 2.
- [x] Chưa tạo `PostsController`.
- [x] Chưa xử lý upload ảnh và hashtag (để bước sau).

---

## Step 3 - Posts Controller + Swagger Test Ready (07/04/2026)

### Việc đã thực thi

- [x] Tạo `Backend/Controllers/PostsController.cs` theo RESTful routes `api/posts`.
- [x] Kết nối controller với `IPostService` (không chứa business logic).
- [x] Hoàn thiện endpoint: `GET all`, `GET by id`, `POST`, `PUT`, `DELETE`.
- [x] Gắn `[Authorize]` cho endpoint thay đổi dữ liệu (`POST/PUT/DELETE`), giữ `GET` công khai.

### Ghi chú phạm vi

- [x] Chỉ làm CRUD text cho Posts.
- [x] Chưa xử lý upload ảnh.
- [x] Chưa xử lý hashtag.

---

## Step 4 - Upload ảnh cho Posts (07/04/2026)

### Việc đã thực thi

- [x] Tạo DTO `CreatePostWithImageDto` nhận `Content` + file `Image`.
- [x] Mở rộng `IPostService` với `CreateWithImageAsync(...)`.
- [x] Cài đặt lưu ảnh trong `PostService`: validate định dạng (`.jpg/.jpeg/.png/.webp`), giới hạn 5MB, lưu vào `wwwroot/uploads/posts`.
- [x] Thêm endpoint `POST /api/posts/with-image` (Authorize, multipart/form-data) trong `PostsController`.
- [x] Bật `app.UseStaticFiles()` trong `Program.cs` để có thể truy cập ảnh theo URL.
- [x] Sửa lỗi startup webroot trong `Program.cs` bằng `WebApplicationOptions { WebRootPath = "wwwroot" }` (tránh lỗi `System.NotSupportedException` khi đổi webroot sau `CreateBuilder`).
- [x] Test thực tế endpoint upload:
  - Không token -> `401 Unauthorized`.
  - Có token hợp lệ -> `201 Created`, response có `imageUrl`.
  - Truy cập `imageUrl` trả về -> `200 OK` (ảnh đã serve được qua static files).

### Ghi chú phạm vi

- [x] Mới xử lý upload ảnh cơ bản cho thao tác tạo post.
- [x] Upload video **không nằm trong yêu cầu bắt buộc hiện tại của assignment** (scope chính là text + image).
- [x] Chưa xử lý hashtag (để bước sau).

---

## Step 5 - Tích hợp Hashtag cho Posts (07/04/2026)

### Việc đã thực thi

- [x] Bổ sung dữ liệu hashtag vào response DTO của post (`PostResponseDto.Hashtags`).
- [x] Mở rộng `PostService` để parse hashtag từ `Content` bằng regex, normalize về lowercase, loại trùng và gán vào quan hệ nhiều-nhiều `Post <-> Hashtag`.
- [x] Áp dụng logic hashtag cho cả `CreateAsync`, `CreateWithImageAsync` và `UpdateAsync`.
- [x] Bổ sung validate giới hạn tối đa 20 hashtag mỗi post.
- [x] Cập nhật `PostsController` để trả `400 BadRequest` với message rõ ràng khi vi phạm rule hashtag.

### Kết quả test thực tế

- [x] `POST /api/posts` với nội dung chứa hashtag lặp (`#DotNet`, `#dotnet`) -> response đã de-duplicate và normalize (`#dotnet`).
- [x] `PUT /api/posts/{id}` đổi nội dung hashtag -> response `GET/PUT` phản ánh hashtag mới chính xác.
- [x] Gửi quá 20 hashtag -> `400 BadRequest` với message: `A post supports up to 20 hashtags.`

### Ghi chú phạm vi

- [x] Hoàn thành tích hợp hashtag cho module Posts theo scope Step 5.
- [x] Không bắt buộc làm upload video theo requirement PDF hiện tại; giữ ở mức optional enhancement.

---

## Audit đối chiếu assignment.pdf -> plan (07/04/2026)

### Kết luận rà soát

- [x] Đã xác nhận requirement chính của Posts là post text + image, không có tiêu chí bắt buộc chấm điểm cho upload video.
- [x] Đã cập nhật lại Master Plan để bỏ các mô tả khiến hiểu nhầm video là requirement bắt buộc.
- [x] Ghi nhận các hạng mục còn thiếu theo rubric cần bổ sung trong roadmap: role/policy authorization, chuẩn response format, 6 controllers/20 endpoints, repository pattern, testing coverage, Azure CI/CD.
