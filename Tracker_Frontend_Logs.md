# Nhật Ký Phát Triển Frontend

[⬅ Quay lại Master Plan](./Master_Plan_Tracker.md)

## 08/04/2026 - Scaffold Layout, Routing, Login UI (Phase 4)

- Đã đọc lại `Project_Rules_And_Architecture.md` trước khi triển khai để bám đúng stack và quy tắc frontend.
- Tạo/chuẩn hóa cấu trúc thư mục trong `src/`: `components`, `layouts`, `pages`, `services`, `stores`, `types`.
- Tạo `src/components/Navbar.tsx`: navbar fixed top gồm brand InteractHub, ô search, icon thông báo và avatar placeholder.
- Tạo `src/layouts/MainLayout.tsx`: khung 3 cột (LeftSidebar 20%, MainContent 55% nhận `children`, RightSidebar 25%) với màu nền phân biệt.
- Tạo `src/pages/LoginPage.tsx`: form đăng nhập căn giữa màn hình, quản lý `username/password` bằng `useState`.
- Cập nhật `src/App.tsx`: setup routing với `/login` -> `LoginPage`, `/` -> `MainLayout` + Home placeholder.
- Bổ sung `src/contexts/index.ts` và `src/types/index.ts` để cố định scaffold module cho bước state management và type dùng chung.
- Cập nhật `Master_Plan_Tracker.md`: đánh dấu tiến độ partial cho F1/F4, Router/Layout và nâng tiến độ Giai đoạn 4 lên 40%.

## 08/04/2026 - Frontend Cleanup + Login Form Standardization (Phase 4-5)

- Dọn rác và chuẩn hóa metadata: đổi title ở `index.html` từ `frontend` sang `InteractHub`.
- Triệt cảnh báo build CSS import order: đưa 2 dòng `@import url(...)` Google Fonts lên đầu `src/index.css`, trước `@import "tailwindcss"`.
- Xóa file không còn dùng `src/App.css`; xác nhận không có import `App.css` trong `src/App.tsx` và `src/main.tsx`.
- Refactor `src/pages/LoginPage.tsx` sang React Hook Form (bỏ `useState` hoàn toàn).
- Thêm validation login theo yêu cầu: `username` bắt buộc, `password` bắt buộc + tối thiểu 6 ký tự; hiển thị lỗi dưới input với class `text-red-500 text-sm`.
- Cập nhật submit handler tạm thời: `console.log(data)` khi form hợp lệ.
- Cập nhật `Master_Plan_Tracker.md`: tăng tiến độ cho F3, Authentication/Form validation và cập nhật phần trăm Giai đoạn 4/5.

## 08/04/2026 - Thin Slice Login Thực Tế (Context + Axios + Router Guard)

- Thêm type dùng chung tại `src/types/index.ts`: `ApiResponse<T>` và `LoginResponseData` theo chuẩn response backend.
- Tạo `src/api/axiosClient.ts` với `baseURL` backend, request interceptor tự gắn Bearer token từ localStorage và response interceptor reject lỗi cơ bản.
- Tạo `src/services/authService.ts` với hàm `login(payload)` gọi `POST /auth/login` và trả về `response.data` typed.
- Nâng cấp `src/contexts/AuthContext.tsx`: bỏ dummy logic, đọc state khởi tạo từ localStorage, `login(username, password)` gọi service thật, lưu `token/userId/username` vào localStorage khi thành công, throw lỗi khi backend trả `success=false`.
- Thêm route guard `src/components/ProtectedRoute.tsx` và bảo vệ route `/` trong `src/App.tsx` bằng `Navigate` về `/login` khi chưa xác thực.
- Nối API vào `src/pages/LoginPage.tsx`: submit gọi `useAuth().login`, bắt lỗi API qua `try/catch`, hiển thị `errorMsg` từ backend khi đăng nhập sai.
- Kiểm tra kỹ thuật sau thay đổi: `npm run lint` pass, `npm run build` pass.

## 09/04/2026 - Authentication Lifecycle Slice (Logout + Token Expiration)

- Cập nhật `src/api/axiosClient.ts`: thêm xử lý global `401` ở response interceptor, tự động xóa `auth_token`, `auth_user_id`, `auth_username` khỏi localStorage và ép redirect về `/login`.
- Cập nhật `src/components/Navbar.tsx`: nối `useAuth()` + `useNavigate()`, hiển thị `Xin chào, {user?.username}` và thêm nút `Đăng xuất` gọi `logout()` + `navigate('/login')`.
- Cập nhật `src/App.tsx`: thêm `HomeTest` component trong file và render thông báo xác nhận token/login thành công bên trong route `/` đã được bảo vệ.
- Cập nhật `Master_Plan_Tracker.md`: tăng tiến độ F2/F4, tiến độ Giai đoạn 4/5 theo lát cắt vòng đời authentication.

## 09/04/2026 - Authentication Register Slice (RHF + Axios + Router)

- Mở rộng `src/types/index.ts`: thêm `RegisterRequestDto` để đồng bộ contract đăng ký với backend.
- Mở rộng `src/services/authService.ts`: thêm hàm `register(payload)` gọi `POST /auth/register`, trả về `ApiResponse<any>`.
- Tạo `src/pages/RegisterPage.tsx` bằng React Hook Form với validation đầy đủ: required fields, email regex, password minLength, confirmPassword matching.
- Nối submit register với service layer, loại bỏ `confirmPassword` khỏi payload gửi backend, bắt lỗi qua `isAxiosError` và hiển thị mảng `errors` từ backend.
- Khi register thành công: `window.alert(...)` + điều hướng về `/login`.
- Cập nhật `src/pages/LoginPage.tsx`: thêm link điều hướng sang `/register`.
- Cập nhật `src/App.tsx`: thêm route `/register`.
- Kiểm tra kỹ thuật sau thay đổi: build/lint và test API auth flow register + login.

## 09/04/2026 - Hotfix Authentication UX (401 on Login/Register)

- Điều tra bug UX: khi nhập sai mật khẩu, lỗi đỏ hiển thị chớp rồi mất và form bị reset.
- Xác định nguyên nhân: backend trả `401` cho login sai mật khẩu, trúng global interceptor nên bị `window.location.href='/login'` gây reload trang.
- Sửa `src/api/axiosClient.ts`: thêm điều kiện loại trừ `/auth/login` và `/auth/register` khỏi nhánh redirect global `401`.
- Kết quả mong đợi sau fix: lỗi backend hiển thị ổn định trên form, không reset input khi đăng nhập sai; global `401` vẫn hoạt động cho protected APIs.

## 09/04/2026 - React Query Home Feed Caching Slice (Phase 4-5)

- Cài dependency `@tanstack/react-query` và cập nhật lockfile trong frontend.
- Cập nhật `src/main.tsx`: thêm `QueryClient` + `QueryClientProvider` bọc toàn app để bật caching layer.
- Mở rộng `src/types/index.ts`: thêm `PostResponseDto` (id, userId, userName, userAvatarUrl, content, imageUrl, createdAt, likeCount, commentCount, hashtags) và `PostListResponseData`.
- Tạo `src/services/postService.ts`: thêm hàm `getPosts(pageNumber, pageSize)` gọi `GET /posts` qua `axiosClient`, map dữ liệu backend về shape frontend thống nhất và trả về danh sách posts.
- Tạo `src/pages/HomePage.tsx`: dùng `useQuery` với query key `['posts', 1, 10]`, có đầy đủ loading/error/empty/data states và render danh sách post cards.
- Cập nhật `src/App.tsx`: thay `HomeTest` bằng `HomePage` trong route `/` đã được `ProtectedRoute` bảo vệ.
- Cập nhật `Master_Plan_Tracker.md`: đánh dấu hoàn thành tích hợp React Query, nâng tiến độ F2/F4 và Giai đoạn 4/5 theo thin slice mới.

## 09/04/2026 - Create Post Form Slice (RHF + Upload + Preview + Mutation)

- Mở rộng `src/services/postService.ts`: thêm hàm `createPost(data: FormData)` gọi `POST /posts/with-image` với `multipart/form-data` và trả về `response.data`.
- Tạo `src/components/CreatePostForm.tsx`:
  - Dùng `react-hook-form` quản lý `content` và `image`.
  - Validation: `content` bắt buộc, tối đa 1000 ký tự.
  - Upload ảnh bằng input file (`jpeg/png/webp`).
  - Preview ảnh bằng `URL.createObjectURL` + cleanup `URL.revokeObjectURL` để tránh memory leak.
  - Có nút `X` xóa ảnh: reset field `image`, clear input file và clear preview.
  - Tích hợp `useMutation` gọi `createPost`, trạng thái loading disable nút submit (`Đang đăng...`).
  - `onSuccess`: alert thành công, reset form + preview, `invalidateQueries({ queryKey: ['posts'] })` để tự reload feed.
- Cập nhật `src/pages/HomePage.tsx`: thêm `CreatePostForm` ở đầu trang và chuẩn hóa layout dãn cách `space-y-6` giữa form và danh sách bài viết.
- Cập nhật `Master_Plan_Tracker.md`: nâng tiến độ F3/Home Feed/Form validation/Giai đoạn 5 theo lát cắt mới.

## 09/04/2026 - PostCard Refactor + Delete/Like Slice (Phase 5)

- Mở rộng `src/services/postService.ts`: thêm `deletePost(postId)` gọi `DELETE /posts/{postId}`.
- Tạo `src/services/likeService.ts`: thêm `togglePostLike(postId)` gọi `POST /likes/post/{postId}`.
- Tạo `src/components/PostCard.tsx`:
  - Tách toàn bộ khối card bài viết từ Home Feed sang component tái sử dụng.
  - Nhận props `post` và `currentUserId`.
  - Hiển thị nút `Xóa` khi `post.userId === currentUserId`.
  - Tích hợp `useMutation` cho xóa bài viết, confirm trước khi xóa, `alert` khi thành công, và `invalidateQueries({ queryKey: ['posts'] })`.
  - Tích hợp `useMutation` cho thả tim bài viết (`togglePostLike`) và `invalidateQueries({ queryKey: ['posts'] })` sau khi mutate thành công.
- Cập nhật `src/pages/HomePage.tsx`:
  - Dùng `useAuth()` lấy `user?.id`.
  - Thay block `<article>` bằng `<PostCard key={post.id} post={post} currentUserId={user?.id} />`.
  - Giữ cấu trúc spacing `space-y-6`/`space-y-4` để UI không xô lệch.
- Cập nhật `Master_Plan_Tracker.md`: phản ánh tiến độ mới cho Home Feed refactor component, delete/like actions và phần trăm Giai đoạn 5.

## 09/04/2026 - Hotfix Delete/Like UI Reliability (Phase 5)

- Cập nhật `src/components/PostCard.tsx` để tăng độ ổn định thao tác:
  - Bổ sung `onError` cho mutation xóa/like, parse lỗi từ `ApiResponse.errors` và hiển thị alert rõ ràng thay vì im lặng.
  - Bổ sung `queryClient.setQueriesData(...)` để cập nhật cache tức thời:
    - Delete: remove post khỏi cache ngay sau success.
    - Like: tăng/giảm `likeCount` theo `isLiked` trả về từ API.
  - Vẫn giữ `invalidateQueries({ queryKey: ['posts'] })` để đồng bộ lại dữ liệu server.
- Đồng bộ contract dữ liệu post từ backend mới (`userId/userName/userAvatarUrl/likeCount/commentCount`) để UI phản ánh đúng thay đổi sau like/delete.
- Chạy kiểm tra frontend sau hotfix:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh mới).
  - `npm run build`: pass.
