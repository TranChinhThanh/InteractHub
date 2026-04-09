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
