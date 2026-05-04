# Danh sách Task (Frontend & Backend)

Dự án được phân chia rõ ràng theo 2 mảng: **Frontend (TypeScript)** và **Backend (PHP)**. Mỗi task được chia nhỏ theo từng trang (Page/Section) hoặc nhóm API để dễ dàng phân công cho các thành viên.

---

## 1. FRONTEND TASKS (TypeScript)

### Nhóm F1: Hệ thống chung & Xác thực (Common & Auth)
*   **Trang Đăng ký / Đăng nhập (Auth Pages):** Dựng form Đăng ký, Đăng nhập. Xử lý phân loại luồng đăng nhập dựa trên Role (Citizen, Enterprise, Collector, Admin) và lưu trữ Token/Session.
*   **Layout & Menu Điều hướng (Navigation):** Dựng khung giao diện chung (Header, Footer, Sidebar). Tùy biến hiển thị các mục menu dựa trên quyền truy cập (Role-based access).

### Nhóm F2: Chức năng Người dân (Citizen Pages)
*   **Trang Tạo báo cáo rác (Report Form):** Giao diện form điền mô tả, chọn loại rác, lấy tọa độ GPS và upload hình ảnh. *(Tùy chọn: Tích hợp nút upload ảnh qua AI để tự động chọn loại rác)*.
*   **Trang Theo dõi trạng thái & Khiếu nại:** Hiển thị danh sách các báo cáo đã gửi cùng trạng thái (Pending, Accepted, Assigned, Collected). Nút và Modal (popup) cho phép gửi phản hồi/khiếu nại nếu thu gom sai cam kết.
*   **Trang Bảng xếp hạng & Điểm thưởng (Leaderboard & Points):** Giao diện xem số điểm thưởng cá nhân, lịch sử nhận điểm và Bảng xếp hạng (Leaderboard) những người dùng có điểm cao nhất theo khu vực.

### Nhóm F3: Chức năng Doanh nghiệp (Enterprise Pages)
*   **Trang Hồ sơ năng lực & Cấu hình:** Giao diện cho phép doanh nghiệp đăng ký, cập nhật năng lực (Loại rác tiếp nhận, công suất, khu vực) và thiết lập quy tắc tính điểm cho Citizen.
*   **Trang Quản lý yêu cầu (Requests Dashboard):** Danh sách các yêu cầu thu gom có trong khu vực, kèm các nhãn gợi ý ưu tiên. Có các nút thao tác nhanh: "Tiếp nhận" hoặc "Từ chối".
*   **Trang Điều phối & Theo dõi (Assignment & Tracking):** Giao diện hiển thị danh sách yêu cầu đã nhận. Có Dropdown/Bảng để chọn và gán (Assign) nhiệm vụ cho từng Collector. Hiển thị trạng thái tiến độ thời gian thực.
*   **Trang Báo cáo thống kê (Reports):** Biểu đồ và bảng dữ liệu thống kê khối lượng rác đã thu gom/tái chế, lọc theo thời gian, loại rác và khu vực.

### Nhóm F4: Chức năng Collector & Quản trị viên (Collector & Admin Pages)
*   **Trang Nhiệm vụ thu gom (Collector App):** Giao diện ưu tiên Mobile (Mobile-first). Hiển thị danh sách task. Có nút thay đổi trạng thái (Assigned -> On the way -> Collected) và form upload ảnh minh chứng.
*   **Trang Lịch sử Collector:** Danh sách các công việc đã hoàn thành và thống kê kết quả thu gom cá nhân.
*   **Trang Quản trị Hệ thống (Admin Dashboard):** Bảng điều khiển cho Admin. Giao diện danh sách User, nút duyệt/từ chối đăng ký doanh nghiệp và giao diện xử lý các khiếu nại.

---

## 2. BACKEND TASKS (PHP / Laravel)

### Nhóm B1: Cơ sở dữ liệu & Phân quyền (DB & Auth)
*   **Database & Migrations:** Thiết kế và khởi tạo các bảng DB: `Users`, `Roles`, `Waste_Requests`, `Waste_Types`, `Points`, `Complaints`. Cấu hình Seeder để có sẵn dữ liệu mẫu (Dummy data).
*   **Authentication & Role Middleware:** Viết API Đăng nhập, Đăng ký. Thiết lập Middleware để bảo vệ và phân quyền cho các routes (Chỉ Admin vào route Admin, Enterprise vào route Enterprise...).

### Nhóm B2: API dành cho Người dân (Citizen APIs)
*   **Waste Report APIs:** API tạo báo cáo thu gom (nhận tọa độ GPS, phân loại rác và xử lý file upload ảnh). API trả về danh sách lịch sử báo cáo của user kèm trạng thái.
*   **Gamification APIs:** API tự động cộng điểm cho Citizen dựa vào logic/cấu hình điểm khi một báo cáo chuyển sang trạng thái "Collected" hoàn tất. API lịch sử điểm.
*   **Leaderboard APIs:** API tính toán tổng điểm và trả về danh sách xếp hạng (Top Users) theo các khu vực.
*   **AI Support API (Tùy chọn):** API tiếp nhận file ảnh, gửi qua dịch vụ external AI (hoặc script Python) để nhận về nhãn phân loại rác và trả về Frontend.

### Nhóm B3: API dành cho Doanh nghiệp (Enterprise APIs)
*   **Enterprise Profile APIs:** API cập nhật hồ sơ năng lực của doanh nghiệp và API lưu cấu hình quy tắc tính điểm.
*   **Request Management APIs:** API truy vấn danh sách yêu cầu đang Pending theo khu vực, kèm thuật toán sắp xếp mức độ ưu tiên. API cập nhật trạng thái tiếp nhận/từ chối.
*   **Assignment & Dashboard APIs:** API gán báo cáo cho `collector_id`. API truy xuất tiến độ trạng thái (Realtime) các task hiện tại và API tính toán tổng lượng rác xuất ra báo cáo thống kê.

### Nhóm B4: API dành cho Collector & Quản trị viên (Collector & Admin APIs)
*   **Collector Task APIs:** API trả về list công việc của một Collector. API thay đổi trạng thái task (Assigned -> On the way -> Collected), trong đó bước hoàn thành yêu cầu đính kèm file ảnh minh chứng.
*   **Admin User Management APIs:** API lấy danh sách tài khoản toàn hệ thống. API để Admin cập nhật trạng thái "Approved" hoặc "Rejected" cho tài khoản Doanh nghiệp mới.
*   **Complaints & Monitoring APIs:** API tiếp nhận khiếu nại từ Citizen. API cung cấp dữ liệu tổng quan toàn hệ thống cho Dashboard của Admin.