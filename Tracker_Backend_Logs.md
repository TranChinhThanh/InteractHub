# Nhật Ký Phát Triển Backend

[⬅ Quay lại Master Plan](./Master_Plan_Tracker.md)

---

## Cập nhật bổ sung (19/04/2026) - Hoàn tất T1 với 15 Unit Tests / 3 Services

### Việc đã thực thi

- [x] Tạo file `Backend/InteractHub.Tests/Services/CommentsServiceTests.cs` với 5 test cases:
  - `CreateCommentAsync_ShouldReturnSuccess_WhenPostExists`
  - `CreateCommentAsync_ShouldThrowInvalidOperation_WhenPostDoesNotExist`
  - `DeleteCommentAsync_ShouldDelete_WhenUserIsOwner`
  - `DeleteCommentAsync_ShouldDelete_WhenUserIsAdmin`
  - `DeleteCommentAsync_ShouldThrowUnauthorized_WhenUserIsNotOwnerOrAdmin`
- [x] Tạo file `Backend/InteractHub.Tests/Services/LikesServiceTests.cs` với 5 test cases:
  - `TogglePostLikeAsync_ShouldAddLike_WhenNotLikedYet`
  - `TogglePostLikeAsync_ShouldRemoveLike_WhenAlreadyLiked`
  - `TogglePostLikeAsync_ShouldThrowInvalidOperation_WhenPostDoesNotExist`
  - `ToggleCommentLikeAsync_ShouldAddLike_WhenNotLikedYet`
  - `ToggleCommentLikeAsync_ShouldRemoveLike_WhenAlreadyLiked`
- [x] Bổ sung mock đầy đủ theo dependency thực tế của service: repositories + `UserManager<ApplicationUser>` + `IHubContext<NotificationHub>`.
- [x] Hoàn tất mốc tối thiểu T1: tổng cộng **15 unit tests** cho **3 service classes** (`AuthService`, `CommentsService`, `LikesService`).

### Kết quả xác minh

- [x] Chạy `dotnet test InteractHub.Tests` thành công.
- [x] Kết quả: **Total 15, Passed 15, Failed 0, Skipped 0**.
- [x] Trạng thái requirement T1 trong tracker tổng: **DONE** (tạm bỏ qua metric coverage 60% theo scope hiện tại).

---

## Cập nhật thực hiện gần nhất (19/04/2026) - T1 Unit Testing AuthService

### Việc đã thực thi

- [x] Tạo test project `Backend/InteractHub.Tests` bằng lệnh `dotnet new xunit -n InteractHub.Tests`.
- [x] Thêm reference từ test project sang API project bằng `dotnet add InteractHub.Tests reference InteractHub.Api.csproj`.
- [x] Cài package mock framework `Moq` cho test project.
- [x] Thêm test project vào solution tổng `InteractHub.slnx` để quản lý đồng bộ trong workspace.
- [x] Tạo thư mục `Services` trong test project và thêm file `AuthServiceTests.cs`.
- [x] Dựng mock `UserManager<ApplicationUser>` (qua `IUserStore<ApplicationUser>`) và mock `ITokenService` cho unit tests của `AuthService`.
- [x] Viết đủ 5 test cases theo yêu cầu:
  - `RegisterAsync_ShouldReturnSuccess_WhenDataIsValid`
  - `RegisterAsync_ShouldReturnError_WhenUsernameAlreadyExists`
  - `LoginAsync_ShouldReturnToken_WhenCredentialsAreValid`
  - `LoginAsync_ShouldReturnError_WhenUserNotFound`
  - `LoginAsync_ShouldReturnError_WhenPasswordIsInvalid`
- [x] Dọn file mẫu `UnitTest1.cs` mặc định để tránh nhiễu và giữ test suite rõ mục tiêu.

### Kết quả xác minh

- [x] Chạy `dotnet test InteractHub.Tests` thành công, toàn bộ test `AuthService` pass.
- [x] Bộ test phản ánh đầy đủ cả nhánh positive và negative của luồng Register/Login trong `AuthService`.

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

---

## B3 - Hoàn thiện Role Seeding + Role/Policy Authorization (08/04/2026)

### Việc đã thực thi

- [x] Tạo constants tập trung cho quyền/policy tại `Backend/Security/AppAuthorization.cs` (`User`, `Admin`, `SelfOrAdmin`).
- [x] Cập nhật `Backend/Program.cs`:
  - Seed role `User` và `Admin` khi startup.
  - Thêm policy `SelfOrAdmin` (Admin hoặc `route userId == claim userId`).
- [x] Cập nhật `Backend/Services/AuthService.cs` để gán role mặc định `User` ngay sau đăng ký thành công.
- [x] Mở rộng `Backend/Controllers/AuthController.cs` với endpoint test role/policy:
  - `GET /api/test/user-role` (`[Authorize(Roles = "User")]`)
  - `GET /api/test/self/{userId}` (`[Authorize(Policy = "SelfOrAdmin")]`)

### Kết quả test thực tế

- [x] Build backend thành công sau thay đổi bảo mật.
- [x] Không truyền token vào endpoint role-protected -> `401 Unauthorized`.
- [x] User mới đăng ký/login có token chứa role `User` (xác nhận qua endpoint protected).
- [x] Gọi endpoint `[Authorize(Roles = "User")]` với token hợp lệ -> `200 OK`.
- [x] Gọi policy endpoint với đúng `userId` -> `200 OK`.
- [x] Gọi policy endpoint với `userId` khác -> `403 Forbidden`.

### Trạng thái

- [x] Mục B3 (role seeding + role-based + policy-based authorization) đã hoàn thành theo phạm vi bắt buộc.

---

## B2 - Chuẩn hóa API Response Format (`success/data/errors`) cho Auth + Posts (08/04/2026)

### Việc đã thực thi

- [x] Tạo DTO dùng chung `Backend/DTOs/Common/ApiResponse.cs` cho response thống nhất.
- [x] Cấu hình global `InvalidModelStateResponseFactory` trong `Backend/Program.cs` để lỗi validation trả đúng format chuẩn.
- [x] Refactor `Backend/Controllers/AuthController.cs` sang response envelope chuẩn cho success/error.
- [x] Refactor `Backend/Controllers/PostsController.cs` sang response envelope chuẩn cho success/error và giữ status code đúng chuẩn.

### Kết quả test thực tế

- [x] Build backend thành công sau refactor.
- [x] `POST /api/auth/register` thành công -> `200` + body chuẩn `success=true,data,errors=[]`.
- [x] `POST /api/auth/register` dữ liệu sai -> `400` + body chuẩn `success=false,data=null,errors=[...]`.
- [x] `POST /api/auth/login` sai mật khẩu -> `401` + body chuẩn lỗi.
- [x] `GET /api/posts/{id}` không tồn tại -> `404` + body chuẩn lỗi.
- [x] `POST /api/posts` vượt limit hashtag -> `400` + body chuẩn lỗi.
- [x] `POST /api/posts` hợp lệ -> `201` + body chuẩn success.
- [x] `DELETE /api/posts/{id}` hợp lệ -> `200` + body chuẩn success (message xác nhận).

### Trạng thái

- [x] Hoàn thành chuẩn hóa response cho 2 controller hiện có (`Auth`, `Posts`).
- [ ] Còn mở rộng cùng chuẩn cho các controller sẽ bổ sung sau (Users/Friends/Stories/Notifications).

---

## Re-test Audit cho Mục 1 + Mục 2 (08/04/2026)

### Mục tiêu re-test

- [x] Kiểm tra lại toàn bộ thay đổi của Mục 1 (B3: role/policy authorization).
- [x] Kiểm tra lại toàn bộ thay đổi của Mục 2 (B2: standardized response format).
- [x] Đối chiếu với rules backend: bảo mật đúng chuẩn + response format thống nhất.

### Phát hiện trong quá trình re-test

- [x] Ban đầu phát hiện lệch casing ở response middleware (`401/403` trả `Success/Data/Errors`) so với controller (`success/data/errors`).
- [x] Đã sửa tại `Backend/Program.cs` bằng cách dùng `WriteAsJsonAsync(...)` trong `JwtBearerEvents` (`OnChallenge`, `OnForbidden`) để đồng bộ JSON policy camelCase.

### Kết quả re-test sau khi fix

- [x] `POST /api/auth/register` hợp lệ -> `200`, body chuẩn envelope.
- [x] `POST /api/auth/register` sai dữ liệu -> `400`, body chuẩn envelope + danh sách lỗi validation.
- [x] `POST /api/auth/login` sai mật khẩu -> `401`, body chuẩn envelope.
- [x] `GET /api/test/user-role` không token -> `401`, body chuẩn envelope (`Authentication required.`).
- [x] `GET /api/test/user-role` có token user -> `200`, body chuẩn envelope.
- [x] `GET /api/test/self/{userId}` đúng userId -> `200`, body chuẩn envelope.
- [x] `GET /api/test/self/{userId}` khác userId -> `403`, body chuẩn envelope (`You do not have permission...`).
- [x] `POST /api/posts` hợp lệ -> `201`, body chuẩn envelope.
- [x] `GET /api/posts/{id}` không tồn tại -> `404`, body chuẩn envelope.
- [x] `POST /api/posts` dữ liệu vi phạm rule hashtag -> `400`, body chuẩn envelope.

### Kết luận audit

- [x] Mục 1 (B3) đạt yêu cầu bắt buộc theo rules và assignment.
- [x] Mục 2 đã đạt chuẩn response format thống nhất cho phạm vi đã triển khai (`Auth`, `Posts`, middleware 401/403).
- [ ] Còn việc mở rộng chuẩn format này cho các controller mới sẽ làm ở các bước tiếp theo.

---

## B4 - Repository Pattern Step 1 & 2 (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo thư mục `Backend/Repositories` và `Backend/Repositories/Interfaces`.
- [x] Tạo `Backend/Repositories/Interfaces/IGenericRepository.cs` với các hàm:
  - `Task<T?> GetByIdAsync(object id);`
  - `Task<IEnumerable<T>> GetAllAsync();`
  - `Task AddAsync(T entity);`
  - `void Update(T entity);`
  - `void Delete(T entity);`
  - `Task<int> SaveChangesAsync();`
- [x] Tạo `Backend/Repositories/GenericRepository.cs` implement `IGenericRepository<T>`.
- [x] Inject `ApplicationDbContext` và dùng `_dbSet = context.Set<T>();` đúng yêu cầu.

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Chưa refactor `PostService`.
- [x] Chưa chỉnh `Program.cs` để đăng ký DI repository.
- [x] Chưa tạo thêm repository chuyên biệt cho từng entity.

### Kết quả xác minh

- [x] Build backend thành công sau khi thêm 2 file repository generic.
- [x] Chưa phát sinh lỗi compile ở phạm vi thay đổi.

---

## B4 - Repository Pattern Step 3 (Custom Post Repository) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/IPostRepository.cs` kế thừa `IGenericRepository<Post>`.
- [x] Khai báo hàm chuyên biệt trong interface:
  - `Task<IEnumerable<Post>> GetAllPostsWithDetailsAsync();`
  - `Task<Post?> GetPostWithDetailsByIdAsync(int id);`
- [x] Tạo `Backend/Repositories/PostRepository.cs` kế thừa `GenericRepository<Post>` và implement `IPostRepository`.
- [x] Cài đặt eager loading cho cả danh sách và chi tiết post:
  - `Include(p => p.User)`
  - `Include(p => p.Hashtags)`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Chưa refactor `PostService` sang repository.
- [x] Chưa chỉnh DI trong `Program.cs` cho `IPostRepository`.
- [x] Chưa thay đổi logic nghiệp vụ/controller ở bước này.

---

## Hotfix Delete Post 500 + Like Count Sync (09/04/2026)

### Vấn đề phát hiện

- [x] Xóa post bị `500 Internal Server Error` khi post có dữ liệu liên quan (`Like`, `Comment`, `PostReport`) do hệ thống đang dùng `DeleteBehavior.NoAction` để tránh multiple cascade paths.
- [x] Feed trả về post chưa có trường đếm (`likeCount`, `commentCount`) và thông tin user phẳng cho frontend, gây cảm giác thao tác like không có thay đổi.

### Việc đã thực thi

- [x] Mở rộng DTO `PostResponseDto` thêm `UserId`, `UserName`, `UserAvatarUrl`, `LikeCount`, `CommentCount`.
- [x] Cập nhật `PostRepository` để eager-load `Comments` và `Likes` cùng `User` + `Hashtags`.
- [x] Cập nhật `PostService.ToPostResponse(...)` để map đủ dữ liệu mới và đồng bộ với contract frontend.
- [x] Bổ sung method dọn dữ liệu theo post ở repository:
  - `ICommentRepository`/`CommentRepository`: `GetCommentIdsByPostIdAsync`, `DeleteByPostIdAsync`.
  - `ILikeRepository`/`LikeRepository`: `DeleteByPostIdAsync`, `DeleteByCommentIdsAsync`.
  - `IReportRepository`/`ReportRepository`: `DeleteByPostIdAsync`.
- [x] Cập nhật `PostService.DeleteAsync(...)` theo thứ tự an toàn:
  1. Lấy danh sách `commentIds` của post.
  2. Xóa likes của post.
  3. Xóa likes của comments thuộc post.
  4. Xóa reports của post.
  5. Xóa comments của post.
  6. Xóa post.
  7. `SaveChangesAsync()` một lần.

### Kết quả kiểm thử

- [x] `dotnet build` backend: thành công.
- [x] E2E API test tự động (Node script):
  - Đăng ký + login user test.
  - Tạo 3 post mới.
  - Like post + tạo comment + like comment.
  - Kiểm tra feed trả `likeCount/commentCount` đúng.
  - Xóa toàn bộ 3 post vừa tạo.
  - Verify `GET /api/posts/{id}` sau xóa trả `404`.
- [x] Kết quả script: `E2E_DELETE_LIKE_TEST: PASS` (IDs: `18, 19, 20`).

### Ghi chú kỹ thuật quan trọng

- [x] Schema hiện tại dùng `Post.Id` kiểu `int`, nên contract method dùng `int id` để đồng bộ model thực tế (không dùng `Guid`).

### Kết quả xác minh

- [x] Build backend thành công sau khi thêm `IPostRepository` + `PostRepository`.
- [x] Không phát sinh lỗi compile trong phạm vi Step 3.

---

## B4 - Repository Pattern Step 4 (Refactor PostService + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Cập nhật `Backend/Program.cs` để đăng ký DI repository:
  - `builder.Services.AddScoped(typeof(IGenericRepository<>), typeof(GenericRepository<>));`
  - `builder.Services.AddScoped<IPostRepository, PostRepository>();`
- [x] Refactor `Backend/Services/PostService.cs`:
  - Xóa phụ thuộc `ApplicationDbContext` khỏi constructor.
  - Inject `IPostRepository` và `IGenericRepository<Hashtag>`.
  - Chuyển toàn bộ thao tác data access (`Add`, `Update`, `Delete`, `SaveChanges`) sang repository.
  - Dùng `GetAllPostsWithDetailsAsync()` và `GetPostWithDetailsByIdAsync()` cho các truy vấn đọc post.
  - Query hashtag qua `_hashtagRepository.GetAllAsync()` kết hợp LINQ và giữ nguyên business logic hashtag cũ.

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi `PostsController`.
- [x] Không thay đổi contract DTO/public API của module Posts.

### Kết quả xác minh

- [x] Build backend thành công sau refactor PostService và cập nhật DI repository.
- [x] Không còn tham chiếu `_dbContext`/`ApplicationDbContext` trong `PostService`.

---

## Users Module - Thin Slice 1 (DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo thư mục `Backend/DTOs/Users` và tạo DTO:
  - `UserProfileResponseDto` (`Id`, `UserName`, `Email`, `Bio`, `AvatarUrl`, `DateJoined`, `Role`)
  - `UpdateProfileDto` (`Bio`, `AvatarUrl`)
- [x] Tạo `Backend/Services/Interfaces/IUsersService.cs` với 2 hàm:
  - `GetUserProfileAsync(string userId)`
  - `UpdateProfileAsync(string userId, UpdateProfileDto dto)`
- [x] Tạo `Backend/Services/UsersService.cs` implement `IUsersService`.
- [x] `UsersService` inject `UserManager<ApplicationUser>` và **không** dùng trực tiếp `ApplicationDbContext`.
- [x] Mapping DTO được xử lý thủ công (không dùng AutoMapper).
- [x] Cập nhật DI trong `Backend/Program.cs`: `AddScoped<IUsersService, UsersService>()`.

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Chưa tạo `UsersController`.
- [x] Không tạo thêm endpoint mới trong bước này.
- [x] Không tạo thêm bảng/entity mới.

### Kết quả xác minh

- [x] Build backend thành công sau khi thêm Users thin slice 1.
- [x] Không phát sinh lỗi compile trong phạm vi thay đổi.

---

## Users Module - Thin Slice 2 (UsersController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/UsersController.cs` với:
  - `[ApiController]`
  - `[Route("api/users")]`
  - `[Authorize]`
- [x] Inject `IUsersService`.
- [x] Tạo endpoint `GET /api/users/{id}` (route parameter đặt tên `userId` để tương thích policy, URL thực tế không đổi) cho user đã login.
- [x] Tạo endpoint `PUT /api/users/{id}` nhận `UpdateProfileDto`.
- [x] Bảo mật endpoint PUT bằng `[Authorize(Policy = "SelfOrAdmin")]`.
- [x] Chuẩn hóa response format toàn bộ endpoint bằng `ApiResponse.Success/Failure` (`success/data/errors`).

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thêm business logic vào controller.
- [x] Không thay đổi `UsersService` contract.
- [x] Không tạo thêm endpoint ngoài 2 endpoint yêu cầu.

### Kết quả test thực tế

- [x] `GET /api/users/{id}` không token -> `401` + body chuẩn `success=false,data=null,errors=["Authentication required."]`.
- [x] `GET /api/users/{id}` với token hợp lệ và id tồn tại -> `200` + body chuẩn `success=true,data,errors=[]`.
- [x] `GET /api/users/{id}` với id không tồn tại -> `404` + body chuẩn `errors=["User not found"]`.
- [x] `PUT /api/users/{id}` self update với token hợp lệ -> `200` + body chuẩn `success=true,data,errors=[]`.
- [x] `PUT /api/users/{id}` không phải chủ sở hữu -> `403` + body chuẩn `You do not have permission...`.
- [x] `PUT /api/users/{id}` payload JSON lỗi cú pháp -> `400` + body chuẩn `success=false,data=null,errors=[...]`.

### Kết quả xác minh

- [x] Build backend thành công sau khi thêm `UsersController`.
- [x] Runtime test đạt đủ các case B2/B3 cho 2 endpoint Users thin slice 2.

---

## Auth QoL - Login trả kèm `userId` + Re-test Users flow (08/04/2026)

### Phạm vi thực hiện

- [x] Cập nhật `Backend/DTOs/Auth/AuthResponseDto.cs` để thêm trường `UserId` trong data trả về login.
- [x] Cập nhật `Backend/Services/TokenService.cs` để map `UserId = user.Id` khi generate token response.

### Kết quả re-test thực tế (sau thay đổi)

- [x] `POST /api/auth/login` trả `200` và data có đủ `token`, `userId`, `username`, `expiresAtUtc`.
- [x] `GET /api/users/{id}` không token -> `401` với response envelope chuẩn.
- [x] `GET /api/users/{id}` với token + id từ login response -> `200`.
- [x] `GET /api/users/{id}` id không tồn tại -> `404` với `errors=["User not found"]`.
- [x] `PUT /api/users/{id}` self update -> `200`.
- [x] `PUT /api/users/{id}` không phải chủ sở hữu -> `403` (policy `SelfOrAdmin`).
- [x] `PUT /api/users/{id}` JSON lỗi cú pháp -> `400` với response envelope chuẩn.

### Kết quả xác minh

- [x] Build backend thành công sau cập nhật login response.
- [x] Không có regression ở luồng Users đã triển khai (Thin Slice 1-2).

---

## Friends Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/IConnectionRepository.cs` kế thừa `IGenericRepository<Connection>`.
- [x] Khai báo methods chuyên biệt:
  - `Task<IEnumerable<Connection>> GetUserConnectionsAsync(string userId);`
  - `Task<Connection?> GetConnectionAsync(string followerId, string followeeId);`
- [x] Tạo `Backend/Repositories/ConnectionRepository.cs` kế thừa `GenericRepository<Connection>` và implement `IConnectionRepository`.
- [x] Áp dụng eager loading với `Include(c => c.Follower)` và `Include(c => c.Followee)` cho truy vấn connection.
- [x] Tạo DTO `Backend/DTOs/Friends/FriendResponseDto.cs` với các field: `UserId`, `UserName`, `AvatarUrl`, `Bio`.
- [x] Tạo `Backend/Services/Interfaces/IFriendsService.cs` với 3 methods:
  - `SendFriendRequestAsync(string followerId, string followeeId)`
  - `GetFollowersAsync(string userId)`
  - `GetFollowingAsync(string userId)`
- [x] Tạo `Backend/Services/FriendsService.cs` implement `IFriendsService`.
- [x] `FriendsService` inject `IConnectionRepository` + `UserManager<ApplicationUser>`.
- [x] Hoàn thiện logic an toàn cho gửi follow/friend request:
  - Không cho phép tự follow chính mình.
  - Kiểm tra follower/followee có tồn tại.
  - Kiểm tra connection đã tồn tại trước khi thêm mới.
  - Bắt `DbUpdateException` và throw thông báo nghiệp vụ rõ ràng.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<IConnectionRepository, ConnectionRepository>()`
  - `AddScoped<IFriendsService, FriendsService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `FriendsController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity hoặc tạo thêm bảng.

### Kết quả xác minh

- [x] Build backend thành công sau khi thêm Friends Thin Slice 1 (`dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false`).
- [x] Có warning lock file output do backend process đang chạy (`InteractHub.Api`), nhưng compile pass và không phát sinh lỗi code trong phạm vi thay đổi.

---

## Friends Module - Thin Slice 2 (FriendsController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/FriendsController.cs` với:
  - `[ApiController]`
  - `[Route("api/friends")]`
  - `[Authorize]`
- [x] Inject `IFriendsService` vào controller.
- [x] Tạo endpoint `POST /api/friends/{followeeId}`:
  - Lấy `followerId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `SendFriendRequestAsync(followerId, followeeId)`.
- [x] Tạo endpoint `GET /api/friends/{userId}/followers`.
- [x] Tạo endpoint `GET /api/friends/{userId}/following`.
- [x] Chuẩn hóa response cho toàn bộ endpoint bằng `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Bổ sung `try-catch` cho `ArgumentException`, `InvalidOperationException` và `Exception` để trả `BadRequest` với thông báo lỗi phù hợp.

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi business logic trong `FriendsService`.
- [x] Không thay đổi schema/entity/migration.
- [x] Không thêm controller ngoài `FriendsController`.

### Kết quả xác minh

- [x] Kiểm tra diagnostics: không có lỗi ở `FriendsController.cs`.
- [x] Build backend thành công sau khi thêm controller (`dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false`).

### Kết quả test runtime thực tế (self-test)

- [x] Chạy backend local trên `http://localhost:5049` để test E2E Friends module.
- [x] Đăng ký 2 user test mới và login lấy JWT + `userId` thành công (`200`).
- [x] `POST /api/friends/{followeeId}` với token hợp lệ -> `200` + envelope success + message xác nhận.
- [x] `GET /api/friends/{userId}/followers` -> `200` + trả đúng user follower trong `data[]`.
- [x] `GET /api/friends/{userId}/following` -> `200` + trả đúng user followee trong `data[]`.
- [x] Case tự follow chính mình -> `400` + envelope lỗi `You cannot follow yourself.`.
- [x] Case follow trùng -> `400` + envelope lỗi `Connection already exists.`.
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

---

## Stories Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/IStoryRepository.cs` kế thừa `IGenericRepository<Story>`.
- [x] Khai báo method chuyên biệt `Task<IEnumerable<Story>> GetActiveStoriesAsync();`.
- [x] Tạo `Backend/Repositories/StoryRepository.cs` implement `IStoryRepository`.
- [x] Cài đặt query active stories đúng rule `ExpiresAt > DateTime.UtcNow`, đồng thời dùng:
  - `Include(s => s.User)` để eager loading user.
  - `.AsNoTracking()` để tối ưu đọc.
- [x] Tạo DTO trong `Backend/DTOs/Stories`:
  - `CreateStoryDto` (`Content`, `ImageUrl`).
  - `StoryResponseDto` (`Id`, `UserId`, `UserName`, `UserAvatarUrl`, `Content`, `ImageUrl`, `CreatedAt`, `ExpiresAt`).
- [x] Tạo `Backend/Services/Interfaces/IStoriesService.cs` với 3 hàm:
  - `CreateStoryAsync(string userId, CreateStoryDto dto)`
  - `GetActiveStoriesAsync()`
  - `DeleteStoryAsync(int storyId, string userId)`
- [x] Tạo `Backend/Services/StoriesService.cs` implement `IStoriesService`.
- [x] `StoriesService` inject `IStoryRepository` + `UserManager<ApplicationUser>`.
- [x] Hoàn thiện logic create story:
  - Set `CreatedAt = DateTime.UtcNow`.
  - Set `ExpiresAt = DateTime.UtcNow.AddHours(24)`.
- [x] Hoàn thiện logic delete story:
  - Chỉ cho phép Admin hoặc đúng owner (`Story.UserId`) được xóa.
  - Sai quyền -> throw `UnauthorizedAccessException`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<IStoryRepository, StoryRepository>()`
  - `AddScoped<IStoriesService, StoriesService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `StoriesController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity/migration.

### Kết quả xác minh

- [x] Diagnostics các file Stories mới/sửa: không phát sinh lỗi.
- [x] Build backend xác minh compile thành công với output tạm để tránh lock file:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_story1/`

---

## Stories Module - Thin Slice 2 (StoriesController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/StoriesController.cs` với:
  - `[ApiController]`
  - `[Route("api/stories")]`
  - `[Authorize]`
- [x] Inject `IStoriesService`.
- [x] Tạo endpoint `POST /api/stories`:
  - Nhận `CreateStoryDto` từ body.
  - Lấy `userId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `CreateStoryAsync(userId, dto)`.
  - Trả `201 Created`.
- [x] Tạo endpoint `GET /api/stories` gọi `GetActiveStoriesAsync()` và trả `200 OK`.
- [x] Tạo endpoint `DELETE /api/stories/{id}`:
  - Lấy `userId` từ token.
  - Gọi `DeleteStoryAsync(id, userId)`.
  - Trả `200 OK` + message xóa thành công.
- [x] Chuẩn hóa response toàn bộ endpoint bằng `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Áp dụng `try-catch` đúng mapping yêu cầu:
  - `UnauthorizedAccessException` -> `403` + `ApiResponse.Failure("You do not have permission...")`
  - `ArgumentException`, `InvalidOperationException` -> `400` + `ApiResponse.Failure(ex.Message)`
  - `Exception` -> `500` + `ApiResponse.Failure("An error occurred while processing the request.")`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi business logic trong `StoriesService`.
- [x] Không thay đổi schema/entity/migration.
- [x] Chỉ thêm `StoriesController` cho Thin Slice 2.

### Kết quả xác minh

- [x] Diagnostics: không có lỗi ở `StoriesController.cs`.
- [x] Build backend thành công với output tạm:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_story2/`

### Kết quả test runtime thực tế (self-test)

- [x] Chạy API từ build output tạm tại `http://localhost:5051` để tránh lock file apphost mặc định.
- [x] Đăng ký 2 user test và login thành công (`200`).
- [x] `POST /api/stories` với token hợp lệ -> `201` + envelope success + trả đầy đủ story data.
- [x] `GET /api/stories` -> `200` + trả danh sách active stories.
- [x] `DELETE /api/stories/{id}` bằng user không phải owner -> `403` + envelope lỗi `You do not have permission...`.
- [x] `DELETE /api/stories/{id}` bằng đúng owner -> `200` + envelope success (`Story deleted successfully.`).
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

---

## Notifications Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/INotificationRepository.cs` kế thừa `IGenericRepository<Notification>`.
- [x] Khai báo method chuyên biệt `Task<IEnumerable<Notification>> GetUserNotificationsAsync(string userId);`.
- [x] Tạo `Backend/Repositories/NotificationRepository.cs` implement `INotificationRepository`.
- [x] Cài đặt `GetUserNotificationsAsync(...)` theo đúng rule:
  - Lọc theo `notification.UserId == userId`.
  - Sắp xếp `CreatedAt` giảm dần (mới nhất lên đầu).
  - Dùng `.AsNoTracking()` để tối ưu đọc.
- [x] Tạo DTO `Backend/DTOs/Notifications/NotificationResponseDto.cs` gồm:
  - `Id`, `UserId`, `Type`, `Content`, `IsRead`, `RelatedEntityId`, `CreatedAt`.
- [x] Tạo `Backend/Services/Interfaces/INotificationsService.cs` với 2 hàm:
  - `GetUserNotificationsAsync(string userId)`
  - `MarkAsReadAsync(int notificationId, string userId)`
- [x] Tạo `Backend/Services/NotificationsService.cs` implement `INotificationsService` và inject `INotificationRepository`.
- [x] Hoàn thiện logic `MarkAsReadAsync(...)` đúng yêu cầu:
  - `GetByIdAsync(notificationId)` -> null thì throw `InvalidOperationException("Notification not found.")`.
  - Kiểm tra quyền `notification.UserId != userId` -> throw `UnauthorizedAccessException("You do not have permission to modify this notification.")`.
  - Hợp lệ thì set `notification.IsRead = true`, gọi `Update(...)` và `SaveChangesAsync()`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<INotificationRepository, NotificationRepository>()`
  - `AddScoped<INotificationsService, NotificationsService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `NotificationsController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity/migration.

### Kết quả xác minh

- [x] Diagnostics các file Notifications mới/sửa: không phát sinh lỗi.
- [x] Build backend xác minh compile thành công với output tạm để tránh lock file:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_notifications1/`

---

## Notifications Module - Thin Slice 2 (NotificationsController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/NotificationsController.cs` với:
  - `[ApiController]`
  - `[Route("api/notifications")]`
  - `[Authorize]`
- [x] Inject `INotificationsService`.
- [x] Tạo endpoint `GET /api/notifications`:
  - Lấy `userId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `GetUserNotificationsAsync(userId)`.
  - Trả `200 OK`.
- [x] Tạo endpoint `PUT /api/notifications/{id}/read`:
  - Lấy `userId` từ token.
  - Gọi `MarkAsReadAsync(id, userId)`.
  - Trả `200 OK` + message xác nhận.
- [x] Chuẩn hóa response theo `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Áp dụng `try-catch` đúng mapping yêu cầu:
  - `UnauthorizedAccessException` -> `403` + `ApiResponse.Failure(ex.Message)`
  - `ArgumentException`, `InvalidOperationException` -> `400` + `ApiResponse.Failure(ex.Message)`
  - `Exception` -> `500` + `ApiResponse.Failure("An error occurred while processing the request.")`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi business logic trong `NotificationsService`.
- [x] Không thay đổi schema/entity/migration.
- [x] Chỉ thêm `NotificationsController` cho Thin Slice 2.

### Kết quả xác minh

- [x] Diagnostics: không có lỗi ở `NotificationsController.cs`.
- [x] Build backend thành công với output tạm:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_notifications2/`

### Kết quả test runtime thực tế (self-test)

- [x] Chạy API từ build output tạm tại `http://localhost:5053` để test endpoint Notifications.
- [x] Đăng ký 2 user test và login thành công (`200`).
- [x] Seed 1 notification test cho user bằng `sqlcmd` vào bảng `Notifications`.
- [x] `GET /api/notifications` với token owner -> `200` + trả danh sách notifications của user.
- [x] `PUT /api/notifications/{id}/read` với token owner -> `200` + message `Notification marked as read successfully.`.
- [x] `PUT /api/notifications/{id}/read` với token user khác -> `403` + lỗi `You do not have permission to modify this notification.`.
- [x] `PUT /api/notifications/999999/read` -> `400` + lỗi `Notification not found.`.
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

---

## Comments Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/ICommentRepository.cs` kế thừa `IGenericRepository<Comment>`.
- [x] Khai báo method chuyên biệt `Task<IEnumerable<Comment>> GetCommentsByPostIdAsync(int postId);`.
- [x] Tạo `Backend/Repositories/CommentRepository.cs` implement `ICommentRepository`.
- [x] Cài đặt `GetCommentsByPostIdAsync(...)` theo đúng rule:
  - Lọc theo `PostId`.
  - `Include(comment => comment.User)` để lấy thông tin user.
  - Sắp xếp `CreatedAt` giảm dần (mới nhất lên đầu).
  - Dùng `.AsNoTracking()` để tối ưu truy vấn đọc.
- [x] Tạo DTOs trong `Backend/DTOs/Comments`:
  - `CreateCommentDto` (`Content`: `Required`, `MaxLength(500)`).
  - `CommentResponseDto` (`Id`, `PostId`, `UserId`, `UserName`, `UserAvatarUrl`, `Content`, `CreatedAt`).
- [x] Tạo `Backend/Services/Interfaces/ICommentsService.cs` với 3 hàm:
  - `CreateCommentAsync(int postId, string userId, CreateCommentDto dto)`
  - `GetCommentsByPostIdAsync(int postId)`
  - `DeleteCommentAsync(int commentId, string userId)`
- [x] Tạo `Backend/Services/CommentsService.cs` implement `ICommentsService` và inject:
  - `ICommentRepository`
  - `IPostRepository`
  - `UserManager<ApplicationUser>`
- [x] Hoàn thiện logic `CreateCommentAsync(...)` đúng yêu cầu:
  - Dùng `_postRepository.GetByIdAsync(postId)` kiểm tra post tồn tại.
  - Không tồn tại -> throw `InvalidOperationException("Post not found.")`.
  - Gán `CreatedAt = DateTime.UtcNow` khi tạo comment.
- [x] Hoàn thiện logic `DeleteCommentAsync(...)` đúng yêu cầu:
  - Chỉ cho phép xóa khi user là `Admin` hoặc là chủ comment (`comment.UserId == userId`).
  - Sai quyền -> throw `UnauthorizedAccessException("You do not have permission to delete this comment.")`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<ICommentRepository, CommentRepository>()`
  - `AddScoped<ICommentsService, CommentsService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `CommentsController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity/migration.

### Kết quả xác minh

- [x] Diagnostics các file Comments mới/sửa: không phát sinh lỗi.
- [x] Build backend xác minh compile thành công với output tạm để tránh lock file:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_comments1/`
- [x] Runtime smoke-test DI/startup thành công:
  - Chạy API từ thư mục output tạm tại `http://localhost:5055`.
  - Truy cập `GET /swagger/v1/swagger.json` trả `200`.
  - Dừng process backend sau khi test để tránh lock file build.

---

## Comments Module - Thin Slice 2 (CommentsController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/CommentsController.cs` với:
  - `[ApiController]`
  - `[Route("api/comments")]`
  - `[Authorize]`
- [x] Inject `ICommentsService`.
- [x] Tạo endpoint `POST /api/comments/post/{postId:int}`:
  - Nhận `CreateCommentDto` từ body.
  - Lấy `userId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `CreateCommentAsync(postId, userId, dto)`.
  - Trả `201 Created` với `ApiResponse.Success(...)`.
- [x] Tạo endpoint `GET /api/comments/post/{postId:int}`:
  - Mở `[AllowAnonymous]` để user chưa đăng nhập cũng xem được comment.
  - Gọi `GetCommentsByPostIdAsync(postId)`.
  - Trả `200 OK` với `ApiResponse.Success(...)`.
- [x] Tạo endpoint `DELETE /api/comments/{id:int}`:
  - Lấy `userId` từ token.
  - Gọi `DeleteCommentAsync(id, userId)`.
  - Trả `200 OK` + message `Comment deleted successfully.`.
- [x] Chuẩn hóa response toàn bộ endpoint bằng `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Bọc `try-catch` đúng mapping yêu cầu:
  - `UnauthorizedAccessException` -> `403` + `ApiResponse.Failure(ex.Message)`
  - `ArgumentException`, `InvalidOperationException` -> `400` + `ApiResponse.Failure(ex.Message)`
  - `Exception` -> `500` + `ApiResponse.Failure("An error occurred while processing the request.")`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi business logic trong `CommentsService`.
- [x] Không thay đổi schema/entity/migration.
- [x] Chỉ thêm `CommentsController` cho Thin Slice 2.

### Kết quả xác minh

- [x] Diagnostics: không có lỗi ở `CommentsController.cs`.
- [x] Build backend thành công với output tạm:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_comments2/`

### Kết quả test runtime thực tế (self-test)

- [x] Chạy API từ thư mục output tạm tại `http://localhost:5057`.
- [x] Đăng ký 2 user test + login thành công (`200`) bằng contract hiện tại (`register` cần `fullName`, `login` dùng `username`).
- [x] Tạo post test (`POST /api/posts`) -> `201`.
- [x] `POST /api/comments/post/{postId}` với owner token -> `201`.
- [x] `GET /api/comments/post/{postId}` không token (`AllowAnonymous`) -> `200`.
- [x] `DELETE /api/comments/{id}` với user không phải owner -> `403` + lỗi `You do not have permission to delete this comment.`.
- [x] `DELETE /api/comments/{id}` với owner token -> `200` + message success.
- [x] `POST /api/comments/post/99999999` -> `400` + lỗi `Post not found.`.
- [x] Check Swagger runtime operation count -> `24 endpoints` (đạt mốc >= 21 endpoint).
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

---

## Likes Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/ILikeRepository.cs` kế thừa `IGenericRepository<Like>`.
- [x] Khai báo 2 methods chuyên biệt:
  - `Task<Like?> GetPostLikeAsync(int postId, string userId);`
  - `Task<Like?> GetCommentLikeAsync(int commentId, string userId);`
- [x] Tạo `Backend/Repositories/LikeRepository.cs` implement `ILikeRepository`.
- [x] Cài đặt truy vấn GET với `.AsNoTracking()` đúng yêu cầu:
  - `GetPostLikeAsync(...)` truy vấn like theo `PostId` + `UserId`.
  - `GetCommentLikeAsync(...)` truy vấn like theo `CommentId` + `UserId`.
- [x] Tạo thư mục `Backend/DTOs/Likes` và record `ToggleLikeResponseDto` với 1 property `bool IsLiked`.
- [x] Tạo `Backend/Services/Interfaces/ILikesService.cs` với 2 hàm:
  - `TogglePostLikeAsync(int postId, string userId)`
  - `ToggleCommentLikeAsync(int commentId, string userId)`
- [x] Tạo `Backend/Services/LikesService.cs` implement `ILikesService`, inject:
  - `ILikeRepository`
  - `IPostRepository`
  - `ICommentRepository`
- [x] Hoàn thiện logic `TogglePostLikeAsync(...)` đúng yêu cầu:
  - Kiểm tra tồn tại post bằng `_postRepository.GetByIdAsync(postId)`.
  - Không tồn tại -> throw `InvalidOperationException("Post not found.")`.
  - Đã like -> `Delete` + `SaveChangesAsync()` + trả `IsLiked = false`.
  - Chưa like -> `Add` + `SaveChangesAsync()` + trả `IsLiked = true`.
- [x] Hoàn thiện logic `ToggleCommentLikeAsync(...)` đúng yêu cầu:
  - Kiểm tra tồn tại comment bằng `_commentRepository.GetByIdAsync(commentId)`.
  - Không tồn tại -> throw `InvalidOperationException("Comment not found.")`.
  - Đã like -> `Delete` + `SaveChangesAsync()` + trả `IsLiked = false`.
  - Chưa like -> `Add` + `SaveChangesAsync()` + trả `IsLiked = true`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<ILikeRepository, LikeRepository>()`
  - `AddScoped<ILikesService, LikesService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `LikesController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity/migration.

### Kết quả xác minh

- [x] Diagnostics các file Likes mới/sửa: không phát sinh lỗi.
- [x] Build backend xác minh compile thành công với output tạm để tránh lock file:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_likes1/`
- [x] Runtime smoke-test DI/startup thành công:
  - Chạy API từ thư mục output tạm tại `http://localhost:5059`.
  - Truy cập `GET /swagger/v1/swagger.json` trả `200`.
  - Đã dừng process backend test sau khi kiểm tra.

---

## Likes Module - Thin Slice 2 (LikesController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/LikesController.cs` với:
  - `[ApiController]`
  - `[Route("api/likes")]`
  - `[Authorize]`
- [x] Inject `ILikesService`.
- [x] Tạo endpoint `POST /api/likes/post/{postId:int}`:
  - Lấy `userId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `TogglePostLikeAsync(postId, userId)`.
  - Trả `200 OK` với `ApiResponse.Success(ToggleLikeResponseDto)`.
- [x] Tạo endpoint `POST /api/likes/comment/{commentId:int}`:
  - Lấy `userId` từ token.
  - Gọi `ToggleCommentLikeAsync(commentId, userId)`.
  - Trả `200 OK` với `ApiResponse.Success(ToggleLikeResponseDto)`.
- [x] Chuẩn hóa response toàn bộ endpoint bằng `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Bọc `try-catch` đúng mapping yêu cầu:
  - `ArgumentException`, `InvalidOperationException` -> `400` + `ApiResponse.Failure(ex.Message)`
  - `Exception` -> `500` + `ApiResponse.Failure("An error occurred while processing the request.")`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi business logic trong `LikesService`.
- [x] Không thay đổi schema/entity/migration.
- [x] Chỉ thêm `LikesController` cho Thin Slice 2.

### Kết quả xác minh

- [x] Diagnostics: không có lỗi ở `LikesController.cs`.
- [x] Build backend thành công với output tạm:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_likes2/`

### Kết quả test runtime thực tế (self-test)

- [x] Chạy API từ thư mục output tạm tại `http://localhost:5061`.
- [x] Tạo user test, login lấy JWT thành công.
- [x] Tạo post test + comment test thành công để làm dữ liệu toggle.
- [x] `POST /api/likes/post/{postId}` lần 1 -> `200` + `isLiked=true`; lần 2 -> `200` + `isLiked=false`.
- [x] `POST /api/likes/comment/{commentId}` lần 1 -> `200` + `isLiked=true`; lần 2 -> `200` + `isLiked=false`.
- [x] `POST /api/likes/post/99999999` -> `400` + lỗi `Post not found.`.
- [x] `POST /api/likes/comment/99999999` -> `400` + lỗi `Comment not found.`.
- [x] Check Swagger runtime operation count -> `26 endpoints`.
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

---

## Reports Module - Thin Slice 1 (Repository + DTO + Service + DI) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Repositories/Interfaces/IReportRepository.cs` kế thừa `IGenericRepository<PostReport>`.
- [x] Tạo `Backend/Repositories/ReportRepository.cs` implement `IReportRepository` (dùng các hàm có sẵn từ `GenericRepository`).
- [x] Tạo DTOs trong `Backend/DTOs/Reports` theo schema thật của `PostReport` (`Reason`):
  - `CreateReportDto` gồm `Reason` (`Required`, `MaxLength(500)`).
  - `ReportResponseDto` gồm `Id`, `PostId`, `ReporterId`, `Reason`, `CreatedAt`.
- [x] Tạo `Backend/Services/Interfaces/IReportsService.cs` với hàm:
  - `CreateReportAsync(int postId, string reporterId, CreateReportDto dto)`.
- [x] Tạo `Backend/Services/ReportsService.cs` implement `IReportsService`, inject:
  - `IReportRepository`
  - `IPostRepository`
- [x] Hoàn thiện logic `CreateReportAsync(...)` đúng yêu cầu:
  - Kiểm tra tồn tại post bằng `_postRepository.GetByIdAsync(postId)`.
  - Không tồn tại -> throw `InvalidOperationException("Post not found.")`.
  - Tạo mới `PostReport` với `PostId`, `ReporterId`, `Reason`, `CreatedAt = DateTime.UtcNow`.
  - Gọi `AddAsync(...)` và `SaveChangesAsync()`.
  - Mapping trả về `ReportResponseDto`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `AddScoped<IReportRepository, ReportRepository>()`
  - `AddScoped<IReportsService, ReportsService>()`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không tạo `ReportsController` ở bước này.
- [x] Không thêm endpoint mới.
- [x] Không thay đổi schema/entity/migration.

### Kết quả xác minh

- [x] Diagnostics các file Reports mới/sửa: không phát sinh lỗi.
- [x] Build backend xác minh compile thành công với output tạm để tránh lock file:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_reports1/`
- [x] Runtime smoke-test DI/startup thành công:
  - Chạy API từ thư mục output tạm tại `http://localhost:5063`.
  - Truy cập `GET /swagger/v1/swagger.json` trả `200`.
  - Đã dừng process backend test sau khi kiểm tra.

---

## Reports Module - Thin Slice 2 (ReportsController) (08/04/2026)

### Phạm vi thực hiện (đúng theo yêu cầu)

- [x] Tạo `Backend/Controllers/ReportsController.cs` với:
  - `[ApiController]`
  - `[Route("api/reports")]`
  - `[Authorize]`
- [x] Inject `IReportsService`.
- [x] Tạo endpoint `POST /api/reports/post/{postId:int}`:
  - Nhận `CreateReportDto` từ body.
  - Lấy `userId` từ token bằng `User.FindFirstValue(ClaimTypes.NameIdentifier)`.
  - Gọi `CreateReportAsync(postId, userId, dto)`.
  - Trả `201 Created` với `ApiResponse.Success(...)`.
- [x] Chuẩn hóa response toàn bộ endpoint bằng `ApiResponse.Success(...)` / `ApiResponse.Failure(...)`.
- [x] Bọc `try-catch` đúng mapping yêu cầu:
  - `ArgumentException`, `InvalidOperationException` -> `400` + `ApiResponse.Failure(ex.Message)`
  - `Exception` -> `500` + `ApiResponse.Failure("An error occurred while processing the request.")`

### Giới hạn phạm vi (không làm vượt yêu cầu)

- [x] Không thay đổi schema/entity/migration.
- [x] Không thay đổi business logic trong `ReportsService`.
- [x] Chỉ bổ sung `ReportsController` cho Thin Slice 2.

### Kết quả xác minh

- [x] Diagnostics: không có lỗi ở `ReportsController.cs`.
- [x] Build backend thành công với output tạm:
  - `dotnet build Backend/InteractHub.Api.csproj -p:UseAppHost=false -p:OutDir=Backend/bin/tmpverify_reports2/`

### Kết quả test runtime thực tế (self-test)

- [x] Chạy API từ thư mục output tạm tại `http://localhost:5065` (Development mode để kiểm tra Swagger).
- [x] Tạo user test + login lấy JWT thành công.
- [x] Tạo post test thành công để làm dữ liệu report (`postId=9`).
- [x] `POST /api/reports/post/{postId}` -> `201` + payload report hợp lệ (`id`, `postId`, `reporterId`, `reason`, `createdAt`).
- [x] `POST /api/reports/post/99999999` -> `400` + lỗi `Post not found.`.
- [x] `GET /swagger/v1/swagger.json` -> `200`; tổng số operations hiện tại: `27`.
- [x] Đã dừng process backend test sau khi hoàn tất để tránh lock file build.

### Đồng bộ tracker/master plan

- [x] Cập nhật `Master_Plan_Tracker.md`:
  - Chốt DONE toàn bộ Giai đoạn 3 (RESTful APIs) -> `100%`.
  - Chuyển hạng mục `SignalR` và `Azure Blob upload service` xuống Giai đoạn 6 theo quyết định mới.
  - Cập nhật mốc endpoint runtime từ `26` lên `27` sau khi thêm Reports endpoint.

---

## 10/04/2026 - Full-Stack Search Users Slice (Phase 5)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/Interfaces/IUsersService.cs`:
  - Thêm contract `Task<IEnumerable<UserProfileResponseDto>> SearchUsersAsync(string query);`.
- [x] Cập nhật `Backend/Services/UsersService.cs`:
  - Triển khai `SearchUsersAsync` để lọc user theo `UserName` chứa chuỗi query (không phân biệt hoa thường).
  - Giới hạn kết quả bằng `.Take(10)`.
  - Mapping kết quả về `UserProfileResponseDto`.
- [x] Cập nhật `Backend/Controllers/UsersController.cs`:
  - Thêm endpoint `GET /api/users/search?q=...`.
  - Trả dữ liệu theo chuẩn `ApiResponse.Success(...)`.

### Kết quả xác minh

- [x] `dotnet build` backend: thành công sau khi thêm Users search endpoint.
- [x] API contract đã sẵn sàng cho frontend gọi search với query param `q`.

---

## 10/04/2026 - Friends Unfollow API Slice (Phase 5)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/Interfaces/IFriendsService.cs`:
  - Thêm contract `Task UnfollowAsync(string followerId, string followeeId);`.
- [x] Cập nhật `Backend/Services/FriendsService.cs`:
  - Triển khai `UnfollowAsync` với validate đầy đủ (không cho self-unfollow, kiểm tra user tồn tại, kiểm tra connection tồn tại).
  - Xóa connection qua repository và `SaveChangesAsync()`.
  - Trả lỗi nghiệp vụ rõ ràng cho các case không hợp lệ.
- [x] Cập nhật `Backend/Controllers/FriendsController.cs`:
  - Thêm endpoint `DELETE /api/friends/{followeeId}`.
  - Chuẩn hóa response theo `ApiResponse.Success/Failure` đồng bộ với các endpoint Friends hiện có.

### Kết quả xác minh

- [x] `dotnet build` backend: pass sau khi thêm endpoint unfollow.
- [x] Smoke test flow follow -> unfollow qua API: pass, follower count tăng/giảm đúng theo thao tác.

---

## 13/04/2026 - Full-Stack Auto-Notification & Post Detail Slice (Phase 5)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Models/Notification.cs`:
  - Thêm field `RelatedEntityId` (`int?`) để liên kết thông báo với post khi cần điều hướng.
- [x] Cập nhật `Backend/Services/FriendsService.cs`:
  - Inject `INotificationRepository`.
  - Trong `SendFriendRequestAsync`, sau khi tạo connection thành công, tạo notification cho followee:
    - `Type = "Follow"`
    - `Content = "{followerUserName} đã bắt đầu theo dõi bạn."`
    - `CreatedAt = DateTime.UtcNow`
- [x] Cập nhật `Backend/Services/LikesService.cs`:
  - Inject `INotificationRepository` và `UserManager<ApplicationUser>`.
  - Trong `TogglePostLikeAsync`, khi thêm like mới và người like không phải chủ post:
    - tạo notification `Type = "Like"`
    - set `RelatedEntityId = postId`
    - set `CreatedAt = DateTime.UtcNow`
- [x] Cập nhật `Backend/Services/CommentsService.cs`:
  - Inject `INotificationRepository`.
  - Trong `CreateCommentAsync`, khi commenter không phải chủ post:
    - tạo notification `Type = "Comment"`
    - set `RelatedEntityId = postId`
    - set `CreatedAt = DateTime.UtcNow`
- [x] Cập nhật `Backend/Services/NotificationsService.cs`:
  - Mapping `NotificationResponseDto.RelatedEntityId` từ entity thay vì luôn `null`.

### Migration & Build

- [x] Tạo migration mới: `20260413144813_AddNotificationRelatedEntityId`.
- [x] Chạy `dotnet ef database update` thành công, đã apply cột `RelatedEntityId` vào bảng `Notifications`.
- [x] `dotnet build` backend: pass.

### Kết quả runtime self-test

- [x] Kịch bản API E2E tự động: `A like post của B` + `A comment post của B` + `A follow B`.
- [x] `GET /api/notifications` của B trả đủ 3 loại thông báo mới (`Like`, `Comment`, `Follow`).
- [x] `Like` và `Comment` có `relatedEntityId` đúng bằng `postId`.
- [x] Kết quả script: `AUTO_NOTIFICATION_SMOKE: PASS` (`postId=32`, notification ids `6/7/8`).

---

## 13/04/2026 - Hoàn thành Hotfix UX: Tên người Comment & UI Danh sách Follow (Phase 5)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/CommentsService.cs`:
  - Đổi nội dung thông báo comment từ chuỗi chung sang username thực tế của người bình luận.
  - Nội dung mới: `"{user.UserName} đã bình luận về bài viết của bạn."`.

---

## 13/04/2026 - Hotfix UX Like Button: Hiển thị trạng thái "Đã thích" (Phase 5)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/DTOs/Posts/PostResponseDto.cs`:
  - Thêm field `IsLikedByCurrentUser`.
- [x] Cập nhật `Backend/Services/Interfaces/IPostService.cs`:
  - Mở rộng `GetAllAsync`/`GetByIdAsync` nhận `currentUserId` tùy chọn.
- [x] Cập nhật `Backend/Services/PostService.cs`:
  - Bổ sung kiểm tra like theo user hiện tại cho từng post qua `ILikeRepository`.
  - Trả về `IsLikedByCurrentUser` trong mapping `PostResponseDto`.
- [x] Cập nhật `Backend/Controllers/PostsController.cs`:
  - Truyền `ClaimTypes.NameIdentifier` (nếu có) vào service cho `GET /api/posts` và `GET /api/posts/{postId}`.

---

## 13/04/2026 - Azure Blob Storage Service Foundation (Requirement B4)

### Phần Backend đã thực hiện

- [x] Cài package NuGet `Azure.Storage.Blobs` vào `Backend/InteractHub.Api.csproj`.
- [x] Tạo `Backend/Services/Interfaces/IFileService.cs`:
  - `Task<string> UploadFileAsync(IFormFile file, string containerName);`
  - `Task<bool> DeleteFileAsync(string fileUrl, string containerName);`
- [x] Tạo `Backend/Services/AzureBlobService.cs` triển khai `IFileService`:
  - Inject `IConfiguration`, đọc connection string `AzureBlobStorage`.
  - `UploadFileAsync`: tạo tên file unique (`Guid + extension`), tạo container nếu chưa tồn tại với public access level `Blob`, upload stream, trả về absolute blob URI.
  - `DeleteFileAsync`: parse blob name từ URL và xóa blob bằng `DeleteIfExistsAsync`.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - `builder.Services.AddScoped<IFileService, AzureBlobService>();`

### Ghi chú phạm vi

- [x] Chưa đụng vào `PostService`/`StoriesService` theo đúng yêu cầu hiện tại.

---

## 13/04/2026 - Refactor PostService sang Azure Blob Storage (Requirement B4)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/PostService.cs`:
  - Inject `IFileService` vào constructor thay cho lưu file local.
  - Trong `CreateWithImageAsync`, thay upload local bằng `_fileService.UploadFileAsync(request.Image, "posts")`.
  - Trong `DeleteAsync`, bổ sung cleanup blob trước khi xóa post bằng `_fileService.DeleteFileAsync(post.ImageUrl, "posts")` khi có ảnh.
  - Loại bỏ toàn bộ logic lưu file local (`wwwroot/uploads/posts`, `Directory.CreateDirectory`, `FileStream`).

### Ghi chú phạm vi

- [x] Chưa thay đổi `StoriesService` theo đúng yêu cầu hiện tại.

---

## 13/04/2026 - Hotfix Runtime 500 khi tải danh sách bài viết

### Nguyên nhân

- [x] `AzureBlobService` ném exception ngay trong constructor nếu thiếu `ConnectionStrings:AzureBlobStorage`.
- [x] `PostService` inject `IFileService`, nên `GET /api/posts` bị fail DI và trả `500` dù endpoint không upload file.

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/AzureBlobService.cs`:
  - Chuyển sang lazy-init `BlobServiceClient`.
  - Không throw ở constructor nữa.
  - Chỉ validate `AzureBlobStorage` khi thực sự gọi `UploadFileAsync`/`DeleteFileAsync`.

### Kết quả

- [x] `GET /api/posts` không còn phụ thuộc bắt buộc vào cấu hình Azure Blob ở thời điểm khởi tạo service.

---

## 13/04/2026 - Hotfix 400 khi đăng bài có ảnh

### Nguyên nhân

- [x] Sau khi refactor sang Azure Blob, môi trường local chưa có `ConnectionStrings:AzureBlobStorage` nên upload ảnh trả lỗi.

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/AzureBlobService.cs`:
  - Ưu tiên upload/delete bằng Azure Blob khi có cấu hình `AzureBlobStorage`.
  - Thêm fallback local storage cho môi trường chưa cấu hình Azure:
    - Upload vào `wwwroot/uploads/{containerName}`.
    - Trả về URL ảnh đầy đủ để frontend hiển thị trực tiếp.
    - Hỗ trợ xóa file local tương ứng trong `DeleteFileAsync`.

### Kết quả

- [x] Đăng bài có ảnh hoạt động lại ở local dev mà không bắt buộc phải có Azure Blob connection string ngay.

---

## 14/04/2026 - Runtime Strategy Switch: Ưu tiên Local Upload để ổn định dev

### Bối cảnh

- [x] Theo yêu cầu hiện tại, tạm dừng sử dụng Azure Blob ở runtime để ưu tiên hệ thống chạy local ổn định.
- [x] Giữ nguyên code Azure để dùng lại sau khi hoàn thiện các module chính.

### Phần Backend đã thực hiện

- [x] Tạo `Backend/Services/LocalFileService.cs` triển khai `IFileService`:
  - Upload ảnh vào `wwwroot/uploads/{containerName}`.
  - Trả về URL tương đối dạng `/uploads/{containerName}/{fileName}`.
  - Hỗ trợ xóa ảnh local tương ứng theo URL đã lưu.
- [x] Cập nhật DI trong `Backend/Program.cs`:
  - Chuyển từ `AzureBlobService` sang `LocalFileService` cho `IFileService`.

### Kết quả kỳ vọng

- [x] `POST /api/posts/with-image` hoạt động ổn định trên local mà không phụ thuộc cấu hình Azure.

---

## 14/04/2026 - Hotfix Feed: Ảnh post không hiển thị & F5 tải chậm

### Nguyên nhân xác định

- [x] Ảnh post local lưu URL dạng tương đối (`/uploads/...`) nên frontend ở domain/port khác dễ hiển thị lỗi ảnh.
- [x] `PostService.GetAllAsync`/`GetByIdAsync` đang gọi kiểm tra like theo từng post (N+1 query) làm feed load chậm khi refresh.

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/PostService.cs`:
  - Bỏ truy vấn like theo từng post qua repository trong vòng lặp.
  - Tính `IsLikedByCurrentUser` trực tiếp từ `post.Likes` đã được include, giảm số lượng query DB đáng kể.

### Kết quả

- [x] Luồng tải danh sách bài viết khi F5 nhẹ hơn do loại bỏ N+1 query cho trạng thái like.

---

## 14/04/2026 - SignalR Notification Hub Foundation (Requirement F4)

### Phần Backend đã thực hiện

- [x] Tạo `Backend/Hubs/NotificationHub.cs`:
  - Kế thừa `Hub`.
  - Gắn `[Authorize]` để chỉ cho phép client đã xác thực kết nối.
- [x] Cập nhật `Backend/Program.cs`:
  - Thêm `builder.Services.AddSignalR();`.
  - Map hub endpoint: `app.MapHub<NotificationHub>("/hubs/notifications");`.
  - Bổ sung `OnMessageReceived` trong `AddJwtBearer` để đọc JWT từ query `access_token` khi request path bắt đầu bằng `/hubs/notifications`.

### Ghi chú phạm vi

- [x] Chưa thay đổi business logic/service phát realtime notification ở phase này.

---

## 14/04/2026 - SignalR Realtime Emit From Services (Friends/Likes/Comments)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/FriendsService.cs`:
  - Inject `IHubContext<NotificationHub>` vào constructor.
  - Sau khi tạo và lưu `Notification` (follow), gọi:
    - `await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");`
- [x] Cập nhật `Backend/Services/LikesService.cs`:
  - Inject `IHubContext<NotificationHub>` vào constructor.
  - Sau khi tạo và lưu `Notification` (like post), gọi:
    - `await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");`
- [x] Cập nhật `Backend/Services/CommentsService.cs`:
  - Inject `IHubContext<NotificationHub>` vào constructor.
  - Sau khi tạo và lưu `Notification` (comment), gọi:
    - `await _hubContext.Clients.User(notification.UserId).SendAsync("ReceiveNotification");`

### Xác minh

- [x] Chạy build backend thành công sau patch:
  - `dotnet build` -> `Build succeeded`.

---

## 14/04/2026 - Performance Optimization: SQL Pagination cho Feed Posts

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Repositories/Interfaces/IPostRepository.cs`:
  - Thêm `CountPostsAsync()`.
  - Thêm `GetPostsPageWithDetailsAsync(int skip, int take)`.
- [x] Cập nhật `Backend/Repositories/PostRepository.cs`:
  - Thêm truy vấn đếm tổng số posts ở database (`CountAsync`).
  - Thêm truy vấn lấy page posts ở database (`OrderByDescending` + `Skip` + `Take`) kèm details.
  - Áp dụng `AsNoTracking` + `AsSplitQuery` cho các truy vấn đọc feed để giảm overhead.
- [x] Cập nhật `Backend/Services/PostService.cs` (`GetAllAsync`):
  - Bỏ luồng tải toàn bộ posts vào memory rồi mới phân trang.
  - Chuyển sang luồng phân trang tại DB: tính `skip`, lấy `totalCount` và page items trực tiếp từ repository.

### Xác minh

- [x] Build backend pass sau tối ưu:
  - `dotnet build` -> `Build succeeded`.

---

## 14/04/2026 - Notifications API: Bổ sung tính năng Xóa thông báo

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Services/Interfaces/INotificationsService.cs`:
  - Thêm method `DeleteAsync(int notificationId, string userId)`.
- [x] Cập nhật `Backend/Services/NotificationsService.cs`:
  - Thêm logic xóa thông báo theo `notificationId`.
  - Kiểm tra quyền sở hữu thông báo theo `userId` trước khi xóa.
  - Trả lỗi nhất quán cho các case `not found` và `forbidden`.
- [x] Cập nhật `Backend/Controllers/NotificationsController.cs`:
  - Thêm endpoint `DELETE /api/notifications/{id}`.
  - Giữ chuẩn response `ApiResponse.Success/Failure` và exception handling đồng nhất với endpoint hiện có.

### Xác minh

- [x] Build backend pass sau patch:
  - `dotnet build Backend/InteractHub.Api.csproj` -> `Build succeeded`.

---

## 14/04/2026 - Notifications API: Bổ sung tính năng Xóa hết thông báo

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Repositories/Interfaces/INotificationRepository.cs`:
  - Thêm method `DeleteAllByUserIdAsync(string userId)`.
- [x] Cập nhật `Backend/Repositories/NotificationRepository.cs`:
  - Triển khai xóa toàn bộ thông báo theo `userId` bằng `ExecuteDeleteAsync` (thực thi trực tiếp tại DB).
- [x] Cập nhật `Backend/Services/Interfaces/INotificationsService.cs`:
  - Thêm method `DeleteAllAsync(string userId)`.
- [x] Cập nhật `Backend/Services/NotificationsService.cs`:
  - Thêm validate `userId` và gọi repository để xóa toàn bộ thông báo theo user hiện tại.
- [x] Cập nhật `Backend/Controllers/NotificationsController.cs`:
  - Thêm endpoint `DELETE /api/notifications`.
  - Trả response gồm `message` và `deletedCount`.

### Xác minh

- [x] Build backend pass sau patch:
  - `dotnet build Backend/InteractHub.Api.csproj` -> `Build succeeded`.

---

## 18/04/2026 - Posts API: Bổ sung endpoint lấy bài viết theo user (Profile Feed)

### Phần Backend đã thực hiện

- [x] Cập nhật `Backend/Repositories/Interfaces/IPostRepository.cs`:
  - Thêm method `GetPostsByUserIdAsync(string userId)`.
- [x] Cập nhật `Backend/Repositories/PostRepository.cs`:
  - Triển khai truy vấn lấy posts theo `userId`.
  - Include đầy đủ `User`, `Comments`, `Likes`, `Hashtags` để tái sử dụng mapping hiện có.
  - Sắp xếp `OrderByDescending(p => p.CreatedAt)`.
- [x] Cập nhật `Backend/Services/Interfaces/IPostService.cs`:
  - Thêm method `GetPostsByUserAsync(string targetUserId, int pageNumber, int pageSize, string? currentUserId = null)`.
- [x] Cập nhật `Backend/Services/PostService.cs`:
  - Thêm luồng phân trang cho danh sách bài viết của 1 user.
  - Tái sử dụng logic mapping `ToPostResponse(...)` và `IsPostLikedByUser(...)` để giữ format response đồng nhất với Home Feed.
- [x] Cập nhật `Backend/Controllers/PostsController.cs`:
  - Thêm endpoint `GET /api/posts/user/{userId}` nhận `pageNumber`, `pageSize` qua query.
  - Trả response chuẩn `ApiResponse.Success(...)`.

### Xác minh

- [x] Build backend pass:
  - `dotnet build Backend/InteractHub.Api.csproj` -> `Build succeeded`.

---

## 18/04/2026 - Hashtags API: Trending Hashtags (Top 5)

### Phần Backend đã thực hiện

- [x] Tạo `Backend/Repositories/Interfaces/IHashtagRepository.cs`:
  - Khai báo `Task<IEnumerable<string>> GetTrendingHashtagsAsync(int limit)`.
- [x] Tạo `Backend/Repositories/HashtagRepository.cs`:
  - Query hashtags có liên kết post (`Posts.Any()`).
  - Sắp xếp theo số lượng post giảm dần (`OrderByDescending(hashtag.Posts.Count)`).
  - Secondary sort theo tên hashtag (`ThenBy(Name)`) để ổn định dữ liệu.
  - `Take(limit)` cho top hashtags.
- [x] Tạo `Backend/Services/Interfaces/IHashtagsService.cs` + `Backend/Services/HashtagsService.cs`:
  - Bọc business logic lấy trending hashtags và normalize giới hạn (default 5, max 20).
- [x] Tạo `Backend/Controllers/HashtagsController.cs`:
  - Thêm endpoint `GET /api/hashtags/trending`.
  - Trả chuẩn `ApiResponse.Success(List<string>)`.
- [x] Cập nhật `Backend/Program.cs`:
  - Đăng ký DI: `IHashtagRepository -> HashtagRepository`, `IHashtagsService -> HashtagsService`.

### Xác minh

- [x] Build backend pass sau patch:
  - `dotnet build Backend/InteractHub.Api.csproj` -> `Build succeeded`.
