# Nhật Ký Phát Triển Frontend

[⬅ Quay lại Master Plan](./Master_Plan_Tracker.md)

## 27/04/2026 - Notification Flow cho Report Moderation

- Cập nhật `src/pages/NotificationsPage.tsx` để hỗ trợ type thông báo `Report`:
  - Bổ sung badge riêng cho `Report` với icon `flag`, màu đỏ để admin dễ nhận diện thông báo kiểm duyệt.
  - Chuẩn hóa xử lý `notification.type` theo `toLowerCase()` để tránh lệch hoa/thường.
  - Mở rộng click handler: với `Report` + `relatedEntityId` sẽ điều hướng sang `/posts/{relatedEntityId}`.
- Kết quả:
  - Khi admin bấm vào thông báo report, app mở đúng trang post detail để kiểm duyệt/xóa bài vi phạm.
  - `npm run build` -> **Build succeeded**.

## 26/04/2026 - Admin Moderation UI Fix (Post/Comment)

- Xác định nguyên nhân tài khoản `adminReal` không thấy nút xóa nội dung user khác:
  - Frontend đang chỉ kiểm tra owner (`currentUserId`) để hiển thị nút xóa ở `PostCard` và `CommentSection`.
  - Auth context chưa đọc/luu role từ JWT sau đăng nhập.
- Cập nhật `src/contexts/AuthContext.tsx`:
  - Thêm parse role từ JWT payload claim role.
  - Lưu role vào `sessionStorage` (`auth_user_role`) và hydrate lại user khi refresh trang.
- Cập nhật `src/components/PostCard.tsx`:
  - Bổ sung prop `currentUserRole`.
  - `canDelete` đổi thành `owner || role === Admin`.
  - Truyền `currentUserRole` xuống `CommentSection`.
- Cập nhật `src/components/CommentSection.tsx`:
  - Bổ sung prop `currentUserRole`.
  - `canDelete` đổi thành `owner || role === Admin`.
- Cập nhật các trang gọi `PostCard` để truyền role hiện tại:
  - `src/pages/HomePage.tsx`
  - `src/pages/ProfilePage.tsx`
  - `src/pages/PostDetailPage.tsx`
- Kết quả xác minh frontend:
  - `npm run build` -> **Build succeeded**.

## 22/04/2026 - Phase 7 Submission Docs: Component Hierarchy

- Hoàn thành tài liệu kiến trúc component frontend tại `Frontend/Component_Hierarchy.md`.
- Tài liệu mô tả cây runtime theo đúng code hiện tại:
  - `main.tsx` -> `QueryClientProvider` -> `AuthProvider` -> `App`.
  - `App` -> `BrowserRouter` -> `Routes` -> `ProtectedRoute` -> `MainLayout` -> các pages.
  - Mapping các component quan trọng: `PostCard`, `CommentSection`, `CreatePostForm`, `FileInput`, `TextInput`, `StoriesBar`, `GlobalNotificationListener`.
- Mục tiêu đạt được: đáp ứng artifact "Component hierarchy documentation (tree structure)" cho rubric F1/Phase 7 submission package.

## 20/04/2026 - F2 State/API Audit + Hoàn tất Service Typing & True Optimistic Like UI

- Rà soát trước khi code theo yêu cầu F2:
  - Task `eliminate any types in src/services`: chưa hoàn thành (còn nhiều `ApiResponse<any>` và `eslint-disable @typescript-eslint/no-explicit-any` trong `authService`, `postService`, `commentService`, `notificationService`, `reportService`, `userService`, `storyService`).
  - Task `true optimistic UI for like`: chưa đạt chuẩn pattern React Query (đang update cache ở `onSuccess`, chưa có snapshot/rollback context chuẩn `onMutate` + `onError`).
- Hoàn tất Task 1 (service typing):
  - Cập nhật `src/types/index.ts` thêm các DTO dùng chung cho response không payload đầy đủ:
    - `SuccessMessageData`
    - `DeleteAllNotificationsResponseData`
    - `ReportResponseDto`
  - Refactor các service để bỏ hoàn toàn `ApiResponse<any>` và bỏ các comment eslint-disable cho `no-explicit-any`:
    - `src/services/authService.ts`: `register` -> `ApiResponse<SuccessMessageData>`.
    - `src/services/postService.ts`: `createPost` -> `ApiResponse<PostResponseDto>` (normalize từ backend DTO), `deletePost` -> `ApiResponse<SuccessMessageData>`.
    - `src/services/commentService.ts`: `createComment` -> `ApiResponse<CommentResponseDto>`, `deleteComment` -> `ApiResponse<SuccessMessageData>`.
    - `src/services/notificationService.ts`: `markAsRead/deleteNotification` -> `ApiResponse<SuccessMessageData>`, `deleteAllNotifications` -> `ApiResponse<DeleteAllNotificationsResponseData>`.
    - `src/services/reportService.ts`: `reportPost` -> `ApiResponse<ReportResponseDto>`.
    - `src/services/userService.ts`: `updateProfile` -> `ApiResponse<UserProfileResponseDto>`.
    - `src/services/storyService.ts`: `deleteStory` -> `ApiResponse<SuccessMessageData>`.
- Hoàn tất Task 2 (optimistic like chuẩn React Query):
  - Cập nhật `src/components/PostCard.tsx` mutation like theo pattern chuẩn:
    - `onMutate`: `cancelQueries(['posts'])`, snapshot `previousPosts` từ `getQueryData(['posts'])`, optimistic update `isLikedByCurrentUser` + `likeCount`.
    - `onError`: rollback về `context.previousPosts` và hiển thị alert lỗi.
    - `onSettled`: `invalidateQueries(['posts'])` để sync server truth.
- Kết quả kiểm tra:
  - Quét lại `src/services`: không còn `ApiResponse<any>` và không còn eslint-disable cho `no-explicit-any`.
  - `npm run build`: pass (không lỗi TypeScript).

## 20/04/2026 - F3 Forms & Validation Audit + Hoàn tất FileInput/Loading State

- Rà soát 3 task F3 theo yêu cầu và đối chiếu code hiện tại:
  - Password strength indicator trong `RegisterPage` đã có sẵn từ trước (`watch("password")`, chấm điểm theo regex, hiển thị `Yếu/Trung bình/Mạnh`).
  - `ProfilePage` hiện không có `input type="file"` hardcoded (form profile đang dùng `avatarUrl` dạng text URL), nên không có điểm cần replace trong file này ở trạng thái hiện tại.
  - `CreatePostForm` còn `input type="file"` hardcoded -> cần refactor.
- Tạo mới `src/components/common/FileInput.tsx`:
  - Dùng `forwardRef` để tương thích với React Hook Form.
  - Hỗ trợ props `label`, `error`, `accept`, `onChange` và toàn bộ input attributes chuẩn.
- Refactor `src/components/CreatePostForm.tsx`:
  - Thay hardcoded `input type="file"` bằng `<FileInput />`.
  - Giữ nguyên luồng preview ảnh (`useWatch` + `URL.createObjectURL` + cleanup `URL.revokeObjectURL`) và logic nút `Thêm ảnh`/`X` xóa ảnh.
- Cập nhật loading states submit:
  - `src/pages/LoginPage.tsx`: dùng `formState.isSubmitting`, disable button khi submit và đổi text thành `Đang xử lý...`.
  - `src/pages/RegisterPage.tsx`: dùng `formState.isSubmitting`, disable button khi submit và đổi text thành `Đang xử lý...`.
- Kết quả kiểm tra:
  - `npm run build`: pass (không lỗi TypeScript).

## 20/04/2026 - Refactor Nested Routes Thật Sự + Image Lazy Loading (Phase 4/5)

- Cập nhật `src/layouts/MainLayout.tsx`:
  - Bỏ render qua `children` và chuyển sang `Outlet` từ `react-router-dom` để render route con theo layout.
- Cập nhật `src/App.tsx`:
  - Refactor cây route sang nested route chuẩn: route cha protected `/` bọc `MainLayout`.
  - Khai báo route con dưới layout gồm: `index` (Home), `/profile/:userId`, `/notifications`, `/search`, `/posts/:postId`.
  - Giữ `/login` và `/register` là public routes.
- Cập nhật lazy loading cho ảnh để tối ưu tải trang:
  - `src/components/PostCard.tsx`: thêm `loading="lazy"` cho các thẻ `img` hiển thị ảnh bài viết/avatar.
  - `src/pages/ProfilePage.tsx`: thêm `loading="lazy"` cho ảnh avatar và ảnh trong danh sách followers/following.
  - `src/components/CommentSection.tsx`: thêm `loading="lazy"` cho avatar comment.
- Kết quả kiểm tra:
  - `npm run build`: pass.

## 20/04/2026 - F4 Loading Skeletons cho Home/Profile (Perceived Performance)

- Tạo mới `src/components/PostSkeleton.tsx` mô phỏng khung `PostCard`:
  - Avatar tròn (`rounded-full`),
  - Các dòng tên/thời gian,
  - Khối nội dung + ảnh lớn,
  - Các khối action nhỏ ở footer.
- Áp dụng Tailwind skeleton style theo yêu cầu: `animate-pulse`, `bg-gray-200`, `rounded-full`, `rounded-md`.
- Cập nhật `src/pages/HomePage.tsx`:
  - Khi `isLoading` của `useInfiniteQuery` là `true`, render 3 `<PostSkeleton />` thay cho text loading cũ.
- Cập nhật `src/pages/ProfilePage.tsx`:
  - Khi `isUserPostsLoading` là `true`, render 3 `<PostSkeleton />` ở section `Bài viết`.
- Mục tiêu đạt được: cải thiện cảm nhận tốc độ tải dữ liệu cho requirement F4 (loading skeletons).

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

## 10/04/2026 - Comment Integration Slice on PostCard (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `CommentResponseDto` (`id`, `postId`, `userId`, `userName`, `userAvatarUrl`, `content`, `createdAt`).
  - Thêm `CreateCommentDto` (`content`).
- Tạo `src/services/commentService.ts` với 3 hàm:
  - `getCommentsByPostId(postId)` gọi `GET /comments/post/{postId}` và bóc tách `response.data.data`.
  - `createComment(postId, payload)` gọi `POST /comments/post/{postId}`.
  - `deleteComment(commentId)` gọi `DELETE /comments/{commentId}`.
- Tạo `src/components/CommentSection.tsx`:
  - Dùng `useQuery` queryKey `['comments', postId]` để tải danh sách bình luận.
  - Hiển thị avatar tròn nhỏ, `userName`, thời gian tạo và nội dung bình luận.
  - Nút `Xóa` chỉ hiện với bình luận của user hiện tại.
  - `useMutation` cho xóa bình luận: invalidate `['comments', postId]` và `['posts']`.
  - Form bình luận bằng `react-hook-form`: input placeholder `Viết bình luận...`, nút `Gửi`, validation required + max 500 ký tự.
  - `useMutation` cho tạo bình luận: reset input và invalidate `['comments', postId]` + `['posts']` khi thành công.
- Cập nhật `src/components/PostCard.tsx`:
  - Thêm state `showComments` để bật/tắt khu vực bình luận.
  - Đổi text comment count thành button có `hover:underline`.
  - Render `<CommentSection postId={post.id} currentUserId={currentUserId} />` trong khối `mt-4 border-t border-gray-100 pt-4` khi bật bình luận.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - E2E API flow test comments: PASS (`create post -> create comment -> list comment -> delete comment -> verify commentCount`).

## 10/04/2026 - Profile Page + Edit Profile Slice (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `UserProfileResponseDto` (`id`, `userName`, `email`, `bio`, `avatarUrl`, `dateJoined`, `role`).
  - Thêm `UpdateProfileDto` (`bio`, `avatarUrl`).
- Tạo `src/services/userService.ts` với 2 hàm:
  - `getUserProfile(userId)` gọi `GET /users/${userId}` và bóc tách `response.data.data`.
  - `updateProfile(userId, payload)` gọi `PUT /users/${userId}`.
- Tạo `src/pages/ProfilePage.tsx`:
  - Dùng `useParams` lấy `userId`.
  - Dùng `useQuery` queryKey `['profile', userId]` để tải hồ sơ.
  - Hiển thị giao diện profile gồm avatar lớn, userName, email, ngày tham gia, role và bio.
  - Nếu là chính chủ (`userId === user.id`) thì hiển thị nút `Chỉnh sửa hồ sơ`.
  - Khi bật chỉnh sửa: form bằng `react-hook-form` gồm `bio` và `avatarUrl`.
  - Validation: `bio` max 500, `avatarUrl` validate URL regex cơ bản.
  - Submit bằng `useMutation` gọi update profile, `onSuccess` đóng form và invalidate `['profile', userId]` + `['posts']`.
- Cập nhật `src/App.tsx`:
  - Thêm route protected `/profile/:userId` render `MainLayout + ProfilePage`.
- Cập nhật `src/components/Navbar.tsx`:
  - Bọc `Xin chào, {user?.username}` bằng `Link` điều hướng tới `/profile/${user?.id}`.
- Cập nhật `src/components/PostCard.tsx`:
  - Bọc avatar và tên tác giả bằng `Link` tới `/profile/${post.userId}`.

- Kết quả kiểm tra:
  - `npm run lint`: pass.
  - `npm run build`: pass.

## 10/04/2026 - Home Feed Load More Pagination Slice (Phase 5)

- Cập nhật `src/pages/HomePage.tsx`:
  - Chuyển từ `useQuery` sang `useInfiniteQuery` (React Query v5).
  - Cấu hình `queryKey: ['posts']`, `initialPageParam: 1`.
  - `queryFn: ({ pageParam }) => getPosts(pageParam, 10)`.
  - `getNextPageParam`: trả page tiếp theo khi `lastPage.length === 10`, ngược lại trả `undefined`.
  - Gộp dữ liệu feed bằng `data?.pages.flatMap((page) => page) ?? []`.
  - Thêm nút `Tải thêm bài viết` dưới danh sách post:
    - `onClick={() => fetchNextPage()}`.
    - Disable + đổi text `Đang tải...` khi `isFetchingNextPage`.
    - Ẩn nút khi `!hasNextPage`.
- Cập nhật `src/components/PostCard.tsx`:
  - Điều chỉnh `queryClient.setQueriesData` để tương thích với `InfiniteData<PostResponseDto[]>` của query key `['posts']`.
  - Giữ nguyên cơ chế invalidate `['posts']` sau delete/like để đồng bộ dữ liệu server.
- Giữ nguyên `CreatePostForm` với `invalidateQueries({ queryKey: ['posts'] })` vì đã tương thích với infinite query key hiện tại.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.

## 10/04/2026 - Notification Module Slice (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `NotificationResponseDto` (`id`, `userId`, `type`, `content`, `isRead`, `relatedEntityId`, `createdAt`).
- Tạo `src/services/notificationService.ts`:
  - `getNotifications()` gọi `GET /notifications`, bóc tách `response.data.data`.
  - `markAsRead(id)` gọi `PUT /notifications/${id}/read`.
- Tạo `src/pages/NotificationsPage.tsx`:
  - Dùng `useQuery` queryKey `['notifications']` để tải danh sách thông báo.
  - Hiển thị list với unread `bg-blue-50`, read `bg-white`.
  - Click thông báo chưa đọc để gọi `useMutation` mark-as-read.
  - `onSuccess` invalidate `['notifications']` để refresh.
  - Có đầy đủ loading/error/empty state.
- Cập nhật `src/App.tsx`:
  - Thêm route protected `/notifications` render `MainLayout + NotificationsPage`.
- Cập nhật `src/components/Navbar.tsx`:
  - Đổi placeholder thông báo sang `Link to="/notifications"`.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.

## 10/04/2026 - React Router Lazy Loading & Suspense Slice (Phase 4/5)

- Tạo `src/components/PageLoader.tsx`:
  - Fallback UI đơn giản khi đang tải route lazy gồm spinner `animate-spin` và text `Đang tải...`.
- Cập nhật `src/App.tsx`:
  - Chuyển các page imports sang `React.lazy` cho `LoginPage`, `RegisterPage`, `HomePage`, `ProfilePage`, `NotificationsPage`.
  - Import `Suspense` và bọc toàn bộ khu vực `Routes` với `fallback={<PageLoader />}`.
  - Giữ nguyên cấu trúc `ProtectedRoute` + `MainLayout`.
- Kết quả tối ưu:
  - Route pages được tách thành các chunk riêng trong build output thay vì dồn một bundle chính.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.

## 10/04/2026 - Custom Hook useDebounce & Navbar Search Routing (Phase 5)

- Tạo `src/hooks/useDebounce.ts`:
  - Viết custom hook generic `useDebounce<T>(value, delay)` bằng `useState` + `useEffect` với `setTimeout`/`clearTimeout`.
  - Hook trả về giá trị `debouncedValue` sau đúng khoảng delay cấu hình.
- Tạo `src/pages/SearchPage.tsx`:
  - Dùng `useSearchParams` đọc query param `q`.
  - Hiển thị heading `Kết quả tìm kiếm cho: "{query}"`.
  - Thêm block text tạm: `Tính năng tìm kiếm đang được cập nhật dữ liệu từ Backend...` để chứng minh luồng debounce + routing hoạt động.
- Cập nhật `src/components/Navbar.tsx`:
  - Thêm state `searchTerm` cho input `Tìm kiếm...` (controlled input).
  - Nối custom hook `const debouncedSearch = useDebounce(searchTerm, 500)`.
  - Dùng `useEffect` theo dõi `debouncedSearch`; khi có nội dung hợp lệ thì `navigate(`/search?q=${encodeURIComponent(...)}`)`.
- Cập nhật `src/App.tsx`:
  - Thêm lazy import `SearchPage` và route protected `/search` bọc trong `MainLayout`.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.

## 10/04/2026 - Full-Stack Search Users Slice (Phase 5)

- Cập nhật `src/services/userService.ts`:
  - Thêm hàm `searchUsers(query)` gọi `GET /users/search?q={query}`.
  - Trả về mảng `UserProfileResponseDto[]` và fallback rỗng khi không có data.
- Cập nhật `src/pages/SearchPage.tsx`:
  - Dùng `useQuery` với `queryKey: ['search', query]` và `queryFn: () => searchUsers(query)`.
  - Áp dụng `enabled: !!query` để không gọi API khi query rỗng.
  - Xóa text placeholder cũ và thay bằng UI kết quả thật:
    - Hiển thị danh sách user (avatar + username).
    - Dùng `Link` điều hướng sang `/profile/{userId}` khi click avatar/tên.
  - Bổ sung đầy đủ trạng thái: loading, error, empty result.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.

## 10/04/2026 - Friends Integration Slice trên ProfilePage (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `FriendResponseDto` (`userId`, `userName`, `avatarUrl`, `bio`).
- Tạo `src/services/friendService.ts` với 3 hàm:
  - `followUser(followeeId)` gọi `POST /friends/{followeeId}`.
  - `getFollowers(userId)` gọi `GET /friends/{userId}/followers`.
  - `getFollowing(userId)` gọi `GET /friends/{userId}/following`.
- Cập nhật `src/pages/ProfilePage.tsx`:
  - Tích hợp thêm 2 query `['followers', userId]` và `['following', userId]`.
  - Hiển thị số lượng Follower/Following dưới phần thông tin profile.
  - Thêm logic nút `Theo dõi` khi xem profile người khác (`userId !== user.id`).
  - Nút follow dùng `useMutation`, gọi `followUser` và `invalidateQueries({ queryKey: ['followers', userId] })` khi thành công.
  - Bổ sung xử lý lỗi `onError` cho case đã follow hoặc tự follow.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Smoke test follow với 2 user mới tạo qua API (`A follow B`): `PASS` (`beforeCount=0`, `afterCount=1`, `followStatus=200`).

## 10/04/2026 - Unfollow Toggle Integration trên ProfilePage (Phase 5)

- Cập nhật `src/services/friendService.ts`:
  - Thêm hàm `unfollowUser(followeeId)` gọi `DELETE /friends/{followeeId}`.
- Cập nhật `src/pages/ProfilePage.tsx`:
  - Xác định trạng thái đang theo dõi bằng dữ liệu `followers` của profile đang xem.
  - Nút hành động giờ chuyển đổi theo trạng thái:
    - Chưa theo dõi: hiển thị `Theo dõi`.
    - Đã theo dõi: hiển thị `Hủy theo dõi`.
  - Bổ sung `useMutation` cho `unfollowUser`.
  - Sau follow/unfollow đều invalidate cache cho cả:
    - `['followers', userId]` của profile đang xem.
    - `['following', currentUserId]` và `['followers', currentUserId]` của user hiện tại.
  - Bổ sung xử lý lỗi riêng cho flow hủy theo dõi.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Smoke test follow -> unfollow với 2 user mới tạo qua API: `PASS` (follower count thay đổi đúng 0 -> 1 -> 0).

## 10/04/2026 - Hoàn thành Report Post Slice (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `CreateReportDto` gồm field `reason`.
- Tạo `src/services/reportService.ts`:
  - Thêm hàm `reportPost(postId, payload)` gọi `POST /reports/post/{postId}`.
  - Trả về `ApiResponse<any>` theo contract frontend hiện tại.
- Cập nhật `src/components/PostCard.tsx`:
  - Tích hợp `useMutation` cho report post.
  - Thêm biến `canReport = currentUserId !== post.userId`.
  - Hiển thị nút `Báo cáo` ở góc phải cho bài viết của user khác.
  - Khi bấm: mở `window.prompt(...)`, nếu có lý do hợp lệ thì gửi report.
  - `onSuccess` hiển thị thông báo: `Đã gửi báo cáo vi phạm thành công. Quản trị viên sẽ xem xét.`

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Smoke test report với 2 user mới tạo (`A report post của B`): `PASS` (`reportStatus=201`).

## 10/04/2026 - Hoàn thành Stories UI Slice (Phase 5)

- Mở rộng `src/types/index.ts`:
  - Thêm `StoryResponseDto` và `CreateStoryDto` để đồng bộ contract Stories với backend.
- Tạo `src/services/storyService.ts`:
  - `getActiveStories()` gọi `GET /stories` và trả về `StoryResponseDto[]`.
  - `createStory(payload)` gọi `POST /stories`.
  - `deleteStory(id)` gọi `DELETE /stories/{id}`.
- Tạo `src/components/StoriesBar.tsx`:
  - Dùng `useQuery` query key `['stories']` để tải danh sách story active.
  - Tích hợp nút tạo story bằng `window.prompt(...)` + mutation create story.
  - Tích hợp xem chi tiết story (nội dung, ảnh, người đăng, ngày đăng) qua state `activeStory`.
  - Cho phép xóa story của chính user đang đăng nhập.
- Cập nhật `src/pages/HomePage.tsx`:
  - Đưa `<StoriesBar />` lên trên cùng, ngay trước `<CreatePostForm />`.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Story smoke test (create -> get -> delete -> verify) qua API: `PASS` (`createStatus=201`, `deleteStatus=200`).

## 13/04/2026 - Search Result Click Navigation Fix (Phase 5)

- Cập nhật `src/components/Navbar.tsx` để xử lý lỗi điều hướng khi click trái vào kết quả search:
  - Thêm `lastNavigatedSearch` bằng `useRef` để ghi nhận từ khóa đã điều hướng gần nhất.
  - Luồng debounce chỉ `navigate('/search?q=...')` khi từ khóa thay đổi thật sự.
  - Chặn điều hướng lặp lại khi chuyển route sang profile (tránh hiện tượng nháy rồi quay về trang search).
- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Regression check logic điều hướng debounce: `NAV_GUARD_TEST: PASS` (không điều hướng lặp khi query không đổi, chỉ điều hướng lại sau khi clear và nhập lại query).

## 13/04/2026 - Multi-Tab Authentication Isolation Fix (Phase 5)

- Cập nhật `src/contexts/AuthContext.tsx`:
  - Chuyển lưu phiên đăng nhập từ `localStorage` sang `sessionStorage` để mỗi tab giữ phiên riêng.
  - Đồng bộ login/logout với `sessionStorage`.
  - Bổ sung cleanup key auth legacy trong `localStorage` để tránh trộn phiên giữa các tab.
- Cập nhật `src/api/axiosClient.ts`:
  - Request interceptor đọc token từ `sessionStorage`.
  - Nhánh xử lý `401` dọn dữ liệu auth ở cả `sessionStorage` và key legacy trong `localStorage`.
- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Regression check storage key: `AUTH_STORAGE_ISOLATION_TEST: PASS` (token mỗi tab độc lập theo `sessionStorage`, không còn dùng token shared từ `localStorage`).

## 13/04/2026 - Full-Stack Auto-Notification & Post Detail Slice (Phase 5)

- Cập nhật `src/services/postService.ts`:
  - Thêm `getPostById(id)` gọi `GET /posts/${id}` và normalize về `PostResponseDto`.
- Tạo `src/pages/PostDetailPage.tsx`:
  - Đọc `postId` từ params.
  - Dùng `useQuery` lấy dữ liệu post.
  - Hiển thị state loading/error theo yêu cầu và render `PostCard` khi có dữ liệu.
- Cập nhật `src/App.tsx`:
  - Thêm lazy import `PostDetailPage`.
  - Thêm protected route `/posts/:postId` trong `MainLayout`.
- Cập nhật `src/pages/NotificationsPage.tsx`:
  - Thêm `useNavigate` + xử lý click notification:
    - `Follow` -> điều hướng profile.
    - `Like`/`Comment` có `relatedEntityId` -> điều hướng `/posts/{relatedEntityId}`.
  - Giữ luồng gọi `markAsReadMutation` khi notification còn unread.

- Kết quả kiểm tra:
  - `npm run lint`: pass (còn 1 warning cũ ở `RegisterPage.tsx`, không phát sinh lỗi mới).
  - `npm run build`: pass.
  - Build output có chunk mới `PostDetailPage-*.js`.

## 13/04/2026 - Hoàn thành Hotfix UX: Tên người Comment & UI Danh sách Follow (Phase 5)

- Cập nhật `src/pages/ProfilePage.tsx`:
  - Thêm 2 state UI: `showFollowers` và `showFollowing`.
  - Đổi block đếm `Follower/Following` sang button có `hover:underline` và toggle hiển thị danh sách theo tab.
  - Render danh sách `followers` và `following` ngay bên dưới phần đếm:
    - Hiển thị avatar nhỏ + username.
    - Bọc avatar/tên bằng `Link` đến `/profile/{userId}`.
    - Có empty state khi danh sách rỗng.

## 13/04/2026 - Hotfix UX Like Button: Hiển thị trạng thái "Đã thích" (Phase 5)

- Cập nhật `src/types/index.ts`:
  - Bổ sung `PostResponseDto.isLikedByCurrentUser`.
- Cập nhật `src/services/postService.ts`:
  - Map field backend `isLikedByCurrentUser` vào dữ liệu post normalize.
- Cập nhật `src/components/PostCard.tsx`:
  - Nút like hiển thị `Đã thích` khi `post.isLikedByCurrentUser = true`, ngược lại hiển thị `Lượt thích`.
  - Sau khi toggle like thành công, cập nhật cache vừa `likeCount` vừa `isLikedByCurrentUser` để UI đổi trạng thái ngay.

## 14/04/2026 - Hotfix Feed Image URL (Local Runtime)

- Cập nhật `src/services/postService.ts`:
  - Bổ sung chuẩn hóa `imageUrl` khi dữ liệu backend trả path tương đối (`/uploads/...`).
  - Tự resolve sang absolute URL theo origin backend (`http://localhost:5035`) để ảnh hiển thị đúng khi frontend chạy cổng khác (`5173`).
- Kết quả:
  - Ảnh trong post tạo từ local upload hiển thị đúng, không còn icon ảnh hỏng do sai host.

## 14/04/2026 - SignalR Global Notification Listener + Toast (Phase 6/F4)

- Tạo `src/components/GlobalNotificationListener.tsx`:
  - Lấy `token` từ `useAuth()`.
  - Dựng kết nối SignalR bằng `HubConnectionBuilder` tới `http://localhost:5035/hubs/notifications` với `accessTokenFactory` và `withAutomaticReconnect()`.
  - Đăng ký listener `ReceiveNotification` để:
    - Hiển thị toast `Bạn có thông báo mới!` với icon `🔔` qua `react-hot-toast`.
    - Gọi `queryClient.invalidateQueries({ queryKey: ['notifications'] })` để đồng bộ danh sách thông báo.
  - Cleanup trong `useEffect` bằng `connection.stop()`.
- Cập nhật `src/App.tsx`:
  - Import và render `<GlobalNotificationListener />` toàn cục cùng router.
  - Listener chạy trong cây đã được bọc bởi `QueryClientProvider` + `AuthProvider` (từ `src/main.tsx`).

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 14/04/2026 - Notifications UI: Bổ sung nút Xóa thông báo

- Cập nhật `src/services/notificationService.ts`:
  - Thêm API client `deleteNotification(id)` gọi `DELETE /notifications/{id}`.
- Cập nhật `src/pages/NotificationsPage.tsx`:
  - Thêm mutation `deleteNotificationMutation`.
  - Thêm nút `Xóa` cho từng notification item.
  - Disable trạng thái thao tác item phù hợp trong lúc đang mark-as-read/mark-all/delete để tránh race condition.
  - Giữ invalidate cache `['notifications']` sau khi xóa để UI đồng bộ dữ liệu server.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 14/04/2026 - Notifications UI: Bổ sung nút Xóa hết

- Cập nhật `src/services/notificationService.ts`:
  - Thêm API client `deleteAllNotifications()` gọi `DELETE /notifications`.
- Cập nhật `src/pages/NotificationsPage.tsx`:
  - Thêm mutation `deleteAllNotificationsMutation`.
  - Thêm nút `Xóa hết` cạnh nút `Đánh dấu đã đọc hết`.
  - Thêm `window.confirm` trước khi xóa toàn bộ để tránh thao tác nhầm.
  - Đồng bộ trạng thái disable/loading giữa mark-all, delete-all và thao tác từng item để tránh race condition.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 14/04/2026 - UX/Performance Tuning: Giảm Loading Treo + Ổn định SignalR Listener

- Cập nhật `src/main.tsx`:
  - Cấu hình `QueryClient` default options cho queries:
    - `retry: false` để fail-fast khi backend không sẵn sàng (tránh loading kéo dài do retry nhiều vòng).
    - `refetchOnWindowFocus: false` để giảm refetch không cần thiết khi chuyển tab/focus lại.
- Cập nhật `src/components/GlobalNotificationListener.tsx`:
  - Bổ sung xử lý lỗi khi `connection.start()` để tránh unhandled promise rejection.
  - Bỏ qua lỗi `stopped during negotiation` trong dev StrictMode (mount/unmount kép) để giảm log đỏ gây nhiễu.
  - Cleanup rõ ràng hơn: `connection.off("ReceiveNotification")` trước `connection.stop()`.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Main Layout: Bổ sung Left Sidebar Navigation

- Cập nhật `src/components/LeftSidebar.tsx`:
  - Tạo component sidebar trái mới dùng `NavLink` từ `react-router-dom`.
  - Dùng `useAuth()` để lấy `user?.id` cho link `Trang cá nhân` (`/profile/${user?.id}`).
  - Bổ sung 3 mục điều hướng:
    - `Trang chủ` -> `/`
    - `Thông báo` -> `/notifications`
    - `Trang cá nhân` -> `/profile/${user?.id}`
  - Thêm SVG icons cho Home/Bell/User.
  - Áp dụng active state theo yêu cầu (`bg-blue-50 text-blue-600`) và hover effect hiện đại.

- Cập nhật `src/layouts/MainLayout.tsx`:
  - Import và render `<LeftSidebar />` trong cột trái của layout.
  - Giữ bố cục 3 cột hiện tại, chỉ thay placeholder cột trái bằng sidebar thật.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Profile Page: Hiển thị bài viết của user

- Cập nhật `src/services/postService.ts`:
  - Thêm API client `getPostsByUser(userId, pageNumber, pageSize)` gọi `GET /posts/user/${userId}`.
- Cập nhật `src/pages/ProfilePage.tsx`:
  - Thêm `useInfiniteQuery` với queryKey `['posts', 'user', userId]`.
  - Gọi API phân trang bài viết theo user đang xem profile.
  - Render danh sách bằng `PostCard` hiện có để tái sử dụng UI/logic.
  - Bổ sung nút `Tải thêm bài viết` giống Home Feed.
  - Thêm loading/error/empty states cho khối bài viết trong trang profile.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Right Sidebar: Trending Hashtags

- Tạo `src/services/hashtagService.ts`:
  - Thêm hàm `getTrendingHashtags(limit = 5)` gọi `GET /hashtags/trending`.
- Tạo `src/components/RightSidebar.tsx`:
  - Dùng `useQuery` với `queryKey: ['trending-hashtags']`.
  - Hiển thị card `Trending Hashtags` top 5 hashtag.
  - Thêm loading/error/empty states.
  - Mỗi hashtag render dạng badge và link sang `/search?q=${encodeURIComponent(hashtag)}`.
- Cập nhật `src/layouts/MainLayout.tsx`:
  - Render `<RightSidebar />` trong cột phải thay placeholder cũ.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Right Sidebar: Disable click Trending Hashtags

- Cập nhật `src/components/RightSidebar.tsx`:
  - Bỏ `Link` cho hashtag trending vì trang `/search` hiện chỉ hỗ trợ search user.
  - Chuyển hashtag về hiển thị dạng badge tĩnh (non-clickable) để tránh UX sai kỳ vọng.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Home Feed UI Restyle (match mockup)

- Cập nhật `src/layouts/MainLayout.tsx`:
  - Tinh chỉnh bố cục 3 cột desktop, ẩn 2 sidebar trên mobile để feed trung tâm thoáng hơn.
  - Bỏ nền khối `main` màu amber, chuyển về layout trung tính giống mockup.
- Cập nhật `src/components/Navbar.tsx`:
  - Tinh chỉnh header theo style social feed: logo xanh, ô search bo tròn có icon, cụm icon phải gọn.
- Cập nhật `src/components/LeftSidebar.tsx`:
  - Chuyển nav item sang dạng pill/card tương tự mockup.
  - Bổ sung card quote trang trí phía dưới.
- Cập nhật `src/components/RightSidebar.tsx`:
  - Restyle card `Xu hướng` giống mockup (heading + item meta + hashtag + số lượng bài viết).
  - Giữ hashtag ở dạng badge tĩnh (không click).
- Cập nhật `src/components/StoriesBar.tsx`:
  - Restyle thanh stories dạng strip ngang bo tròn giống mockup.
- Cập nhật `src/components/CreatePostForm.tsx`:
  - Đổi composer sang layout avatar + input mềm + action chips + nút đăng dạng pill.
- Cập nhật `src/components/PostCard.tsx`:
  - Tinh chỉnh card bài viết: header, typography, ảnh bo góc, footer icon actions theo style mockup.
- Cập nhật `src/pages/HomePage.tsx`:
  - Đồng bộ spacing/cards/load-more theo ngôn ngữ UI mới.

- Kết quả kiểm tra:
  - `npm run build`: pass.

## 18/04/2026 - Notifications Page UI Restyle (match mockup)

- Cập nhật `src/pages/NotificationsPage.tsx`:
  - Restyle toàn bộ khu vực trung tâm trang Notifications theo mockup:
    - Heading lớn `Thông báo`.
    - Cụm 2 nút hành động (`Đánh dấu đã đọc hết`, `Xóa hết`) dạng pill giống style tab trong ảnh.
    - Danh sách thông báo dạng card lớn, mỗi dòng có:
      - avatar tròn,
      - badge icon theo loại thông báo (`Like`, `Comment`, `Follow`, fallback `campaign`),
      - nội dung text được tách actor/detail để nhấn mạnh phần tên,
      - thời gian ở dòng phụ,
      - chấm xanh bên phải cho item chưa đọc.
  - Bỏ UI phân biệt trạng thái `Đã đọc/Chưa đọc` bằng label chip ở từng dòng (giữ logic xử lý click/mark-as-read).
  - Không thay đổi sidebars theo yêu cầu.

- Sửa lỗi build liên quan file `src/components/RightSidebar.tsx`:
  - Loại bỏ biến không dùng `fakePostCount`.

- Kết quả kiểm tra:
  - `npm run build`: pass.
