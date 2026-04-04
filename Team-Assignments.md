# Lịch Trình Phân Công Công Việc Nhóm (Vertical Slicing) ✨
**Dự án:** InteractHub - Mạng xã hội Full-stack (React + ASP.NET Core)
**Số lượng thành viên:** 4 người

> 💡 **Phương pháp làm việc (Vertical Slicing):** Thay vì một người chỉ làm Backend, một người chỉ làm Frontend, mỗi người sẽ chịu trách nhiệm cho **toàn bộ một tính năng** (từ Database -> Backend API -> Frontend UI). Cách này giúp tất cả các thành viên đều hiểu rõ luồng hoạt động của hệ thống từ đầu đến cuối và có rào cản phòng tránh tối đa đụng độ (conflict) code của nhau.

---

### 🧑‍💻 Vibe Coder 1: Xác thực & Hồ sơ Cá nhân (Auth & User Profile)
**Nhiệm vụ:** Lo luồng xác thực người dùng và hiển thị thông tin cá nhân.
*   **Backend:** 
    *   Bổ sung API lấy thông tin người dùng (`GET /api/users/profile`).
    *   API cập nhật thông tin (`PUT /api/users/profile` - đổi FullName, Bio, Upload Avatar).
*   **Frontend:** 
    *   Dựng trang đăng nhập / đăng ký (`Login` & `Register` pages).
    *   Cấu hình **Axios Interceptors** để tự động đính kèm JWT Token vào Header của các Request.
    *   Dựng trang Thông tin cá nhân (`Profile Page`) để hiển thị avatar, tên, số lượng người theo dõi và Bio.
    *   Tạo form chỉnh sửa Profile.

---

### 🧑‍💻 Vibe Coder 2: Bảng tin & Bài viết (Posts & News Feed)
**Nhiệm vụ:** Làm tính năng quan trọng nhất của MXH: Đăng bài và lướt Feed.
*   **Backend:** 
    *   Tạo `PostsController`. 
    *   Viết API tạo bài viết mới bằng text và/với hình ảnh (`POST /api/posts`).
    *   Viết API lấy toàn bộ bài viết cho News Feed (`GET /api/posts/feed`), sắp xếp theo thời gian và có tính năng phân trang (Pagination).
    *   API xoá bài viết của chính chủ.
*   **Frontend:** 
    *   Thiết kế UI Component `PostCard` (Khung hiển thị 1 bài viết với Avatar, nội dung và hình ảnh nếu có).
    *   Thiết kế form `CreatePost` (Khung nhập text đăng bài ở đầu trang chủ).
    *   Dựng `Home Page` gọi API nối vào danh sách bài và render ra các `PostCard`.

---

### 🧑‍💻 Vibe Coder 3: Tương tác Mạng Xã Hội (Likes & Comments)
**Nhiệm vụ:** Làm cho mạng xã hội "sống động" thông qua bình luận và lượt thích.
*   **Backend:** 
    *   Bổ sung bảng `Like` vào Database / Identity (nếu cần), tạo API thả tim (`POST /api/posts/{id}/like`).
    *   Tạo `CommentsController` với API viết bình luận (`POST /api/comments`).
    *   API lấy toàn bộ bình luận của 1 bài viết (`GET /api/posts/{id}/comments`).
*   **Frontend:** 
    *   Thêm "Nút Like" và "Số luợng Like" vào `PostCard` do Coder 2 làm (phối hợp nhé). Xử lý state click đổi màu nút.
    *   Làm giao diện hiển thị danh sách dòng bình luận dưới mỗi bài viết dạng danh sách thả xuống (Accordion).
    *   Ô nhập input để người dùng submit bình luận mới.

---

### 🧑‍💻 Vibe Coder 4: Kết nối & Real-time Info (Connections & SignalR)
**Nhiệm vụ:** Xử lý hệ thống theo dõi (Follow) và độ "real-time" của MXH bằng WebSockets.
*   **Backend:** 
    *   Tạo `ConnectionsController` để xử lý logic Follow/Unfollow user khác (`POST /api/connections/follow/{id}`).
    *   API lấy danh sách Followers / Following (`GET /api/connections/{id}/followers`).
    *   Cài đặt **SignalR / NotificationHub** để phát tín hiệu (broadcast) thông báo khi có người vừa được follow hoặc vừa đăng bài.
*   **Frontend:** 
    *   Dựng Widget "Gợi ý kết bạn" / Danh sách User khác để bấm nút "Follow".
    *   Cài đặt package `@microsoft/signalr` trên React Client để lắng nghe sự kiện từ Hub.
    *   Làm một hộp thư thông báo (Notification Dropdown) trên Navbar: Hiện popup thông báo ngay lập tức nếu có ai follow mình lúc mình đang online.

---

### 🚀 Hướng Dẫn Bắt Đầu Dành Cho Cả Team (Pull Code & Setup Local)

Khi từng người lấy code này từ Git về máy tính cá nhân, hãy chạy 2 việc sau để tự update Local DB của bản thân:
1. Mở C# Backend: Chạy `dotnet ef database update` để tự động tạo Database SQL.
2. Mở React Frontend: Chạy `npm install` và `npm run dev`.