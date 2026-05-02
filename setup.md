PHẦN 1: CÀI ĐẶT PHẦN MỀM NỀN (Chỉ làm 1 lần duy nhất)
Máy mới kéo code về chưa chạy được ngay đâu, phải cài 3 cái này:
Visual Studio 2022 (VS Tím): Lúc cài nhớ tick chọn mục "ASP.NET and web development" và "Data storage and processing" (để nó cài luôn SQL Server LocalDB).
Visual Studio Code (VS Xanh): Để code Frontend.
Node.js: Lên Google gõ "Download Node.js", tải bản có chữ LTS (Recommended for most users) cài vào máy (Next -> Next -> Finish). Cái này bắt buộc phải có thì Frontend mới chạy được.
PHẦN 2: CÁCH CHẠY BACKEND (Dùng VS Tím)
Bước 1: Mở Project
Mở thư mục code ra, chui vào thư mục Backend, nháy đúp chuột vào file InteractHub.sln để mở bằng VS Tím.
Bước 2: Cập nhật Database (Rất quan trọng)
Máy mới chưa có Database, nếu bấm chạy ngay sẽ bị lỗi. Cần bảo Entity Framework tạo Database.
Trên thanh menu của VS Tím, chọn Tools -> NuGet Package Manager -> Package Manager Console.
Sẽ có một cái bảng nhỏ hiện ra ở dưới đáy màn hình, bạn gõ lệnh này vào và nhấn Enter:
code
Powershell
Update-Database
Đợi nó chạy hiện chữ Done. (Lúc này nó đã tạo xong Database và tự động đẩy Data mẫu như Alice, Bob vào máy bạn).
Bước 3: Chạy Backend
Nhìn lên menu phía trên cùng, chỗ có nút Play màu xanh lá cây (thường có chữ http hoặc https). Bấm vào đó.
Trình duyệt sẽ tự động bật lên và mở trang Swagger (ví dụ: http://localhost:5035/swagger).
Lưu ý: Cứ để cái màn hình đen (Console) hoặc VS Tím chạy ngầm, KHÔNG ĐƯỢC TẮT. Tắt là sập Backend.
PHẦN 3: CÁCH CHẠY FRONTEND (Dùng VS Xanh)
Bước 1: Mở Project
Mở thư mục code ra, click chuột phải vào thư mục Frontend -> Chọn "Open with Code" (Mở bằng VS Xanh).
Bước 2: Cài đặt thư viện (Chỉ làm 1 lần khi mới kéo code)
Bấm tổ hợp phím Ctrl + ~ (nút dấu ngã dưới nút ESC) để mở Terminal (bảng gõ lệnh ở dưới đáy).
Gõ lệnh sau và nhấn Enter:
code
Bash
npm install
Giải thích: Lệnh này để tải các thư viện của React về máy (nó sẽ tạo ra thư mục node_modules rất nặng). Chờ nó chạy xong (tầm 1-2 phút).
Bước 3: Chạy Web Frontend
Sau khi cài xong, gõ tiếp lệnh sau vào Terminal và nhấn Enter:
code
Bash
npm run dev
Trình duyệt sẽ hiện ra một dòng chữ màu xanh dạng: ➜ Local: http://localhost:5173/.
Giữ nút Ctrl và click chuột trái vào cái link đó. Giao diện trang web InteractHub của nhóm bạn sẽ hiện lên!
🚨 BẮT BỆNH KHI CHẠY LỖI (Dành cho Nhóm trưởng xử lý)
Nếu các bạn trong nhóm than phiền "Ông ơi máy tôi lỗi không chạy được", hãy check 3 lỗi kinh điển sau:
Lỗi Frontend báo "Network Error" hoặc quay vòng vòng không login được:
Nguyên nhân: Backend chưa chạy. Hoặc Backend đang chạy ở Port (Cổng) khác.
Cách sửa: Mở file Frontend/src/api/axiosClient.ts, kiểm tra xem dòng baseURL: 'http://localhost:5035/api' có TRÙNG với cái cổng lúc chạy VS Tím không. Nếu VS Tím chạy cổng 5123 thì sửa số 5035 thành 5123.
Lỗi Backend Update-Database báo "A network-related or instance-specific error":
Nguyên nhân: Máy người đó chưa cài SQL Server LocalDB hoặc tên SQL Server bị khác.
Cách sửa: Mở file Backend/appsettings.json. Tìm dòng DefaultConnection.
Chữ Server=(localdb)\\mssqllocaldb là chuẩn mặc định. Nếu máy bạn đó xài SQL Server cài tay thì đổi chữ đó thành Server=.\\SQLEXPRESS hoặc Server=TEN_MAY_TINH.
Lỗi Frontend gõ npm run dev báo đỏ chót "Command not found":
Nguyên nhân: Bạn đó lười, chưa gõ npm install hoặc chưa cài Node.js.
Cách sửa: Nhắc cài Node.js, khởi động lại máy tính, rồi gõ npm install.
