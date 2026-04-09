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
