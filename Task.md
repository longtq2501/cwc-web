# Danh sách Task (Frontend & Backend)


## 1. FRONTEND TASKS (TypeScript)

### Nhóm F1: Hệ thống chung & Xác thực (Common & Auth)
*   **Trang Đăng ký / Đăng nhập (Auth Pages):** Dựng form Đăng ký, Đăng nhập. Xử lý phân loại luồng đăng nhập dựa trên Role (Citizen, Enterprise, Collector, Admin) và lưu trữ Token/Session.
*   **Layout & Menu Điều hướng (Navigation):** Dựng khung giao diện chung (Header, Footer, Sidebar). Tùy biến hiển thị các mục menu dựa trên quyền truy cập (Role-based access).

### Nhóm F2: Chức năng Người dân (Citizen Pages)
*   **Trang Tạo báo cáo rác (Report Form):** Giao diện form báo cáo rác/tái chế cần thu gom: điền mô tả, thực hiện phân loại rác tại nguồn (chọn loại rác khi tạo báo cáo), lấy tọa độ GPS và upload hình ảnh. *(Tùy chọn: Tích hợp nút upload ảnh qua AI để tự động chọn loại rác)*.
*   **Trang Theo dõi trạng thái & Khiếu nại:** Theo dõi trạng thái thu gom của từng báo cáo (Pending, Accepted, Assigned, Collected). Nút và Modal (popup) cho phép gửi phản hồi hoặc khiếu nại khi việc thu gom không đúng cam kết.
*   **Trang Bảng xếp hạng & Điểm thưởng (Leaderboard & Points):** Giao diện xem số điểm thưởng cá nhân (nhận điểm thưởng khi báo cáo hợp lệ và phân loại đúng), xem lịch sử điểm thưởng và bảng xếp hạng theo khu vực.

### Nhóm F3: Chức năng Doanh nghiệp (Recycling Enterprise Pages)
*   **Trang Hồ sơ năng lực & Cấu hình:** Giao diện cho phép doanh nghiệp đăng ký và quản lý năng lực xử lý rác: Loại rác tiếp nhận/Công suất xử lý/Khu vực phục vụ. Tạo và cấu hình quy tắc tính điểm thưởng cho Citizen (theo loại rác, chất lượng báo cáo, thời gian xử lý…).
*   **Trang Quản lý yêu cầu (Requests Dashboard):** Nhận và quyết định tiếp nhận hoặc từ chối các yêu cầu thu gom trong phạm vi hoạt động. Xem danh sách yêu cầu thu gom được gợi ý ưu tiên xử lý dựa trên các tiêu chí cấu hình (Optional).
*   **Trang Điều phối & Theo dõi (Assignment & Tracking):** Gán và điều phối yêu cầu thu gom cho Collector thuộc doanh nghiệp. Theo dõi tiến độ xử lý và trạng thái thu gom theo thời gian thực.
*   **Trang Báo cáo thống kê (Reports):** Xem báo cáo khối lượng rác đã thu gom và tái chế theo loại/khu vực/thời gian.

### Nhóm F4: Chức năng Collector & Quản trị viên (Collector & Admin Pages)
*   **Trang Nhiệm vụ thu gom (Collector App):** Giao diện ưu tiên Mobile (Mobile-first). Nhận các yêu cầu thu gom được phân công từ Recycling Enterprise. Cập nhật trạng thái thu gom theo thời gian thực (Assigned / On the way / Collected). Xác nhận hoàn tất thu gom bằng hình ảnh và thông tin trạng thái.
*   **Trang Lịch sử Collector:** Xem lịch sử công việc và số lượng yêu cầu đã hoàn thành.
*   **Trang Quản trị Hệ thống (Admin Dashboard):** Bảng điều khiển cho Administrator. Quản lý tài khoản và phân quyền. Giám sát hoạt động tổng thể của hệ thống. Tiếp nhận và giải quyết tranh chấp/khiếu nại.

---

## 2. BACKEND TASKS (PHP / Laravel)

### Nhóm B1: Cơ sở dữ liệu & Phân quyền (DB & Auth)
*   **Database & Migrations:** Thiết kế và khởi tạo các bảng DB: `Users`, `Roles`, `Waste_Requests`, `Waste_Types`, `Points`, `Complaints`. Cấu hình Seeder để có sẵn dữ liệu mẫu (Dummy data).
*   **Authentication & Role Middleware:** Viết API Đăng nhập, Đăng ký. Thiết lập Middleware để bảo vệ và phân quyền cho các routes (Quản lý tài khoản và phân quyền).

### Nhóm B2: API dành cho Người dân (Citizen APIs)
*   **Waste Report APIs:** API tạo báo cáo thu gom (nhận tọa độ GPS, phân loại rác và xử lý file upload ảnh). API trả về danh sách theo dõi trạng thái thu gom của từng báo cáo.
*   **Gamification APIs:** API nhận điểm thưởng cho Citizen khi báo cáo hợp lệ và phân loại đúng. API xem lịch sử điểm thưởng.
*   **Leaderboard APIs:** API tính toán tổng điểm và trả về danh sách bảng xếp hạng theo khu vực.
*   **AI Support API (Tùy chọn):** API tiếp nhận file ảnh, gửi qua dịch vụ external AI (hoặc script Python) để nhận về nhãn phân loại rác và trả về Frontend.

### Nhóm B3: API dành cho Doanh nghiệp (Enterprise APIs)
*   **Enterprise Profile APIs:** API đăng ký và quản lý năng lực xử lý rác (loại rác, công suất, khu vực). API tạo và cấu hình quy tắc tính điểm thưởng.
*   **Request Management APIs:** API lấy danh sách yêu cầu thu gom trong phạm vi hoạt động (có gợi ý ưu tiên). API quyết định tiếp nhận hoặc từ chối.
*   **Assignment & Dashboard APIs:** API gán và điều phối yêu cầu thu gom cho Collector. API theo dõi tiến độ xử lý thời gian thực. API lấy báo cáo khối lượng rác đã thu gom.

### Nhóm B4: API dành cho Collector & Quản trị viên (Collector & Admin APIs)
*   **Collector Task APIs:** API nhận các yêu cầu phân công. API cập nhật trạng thái thu gom (Assigned / On the way / Collected) và xác nhận hoàn tất bằng hình ảnh. API lịch sử công việc.
*   **Admin Management APIs:** API quản lý tài khoản và phân quyền. API giám sát hoạt động tổng thể của hệ thống. API tiếp nhận và giải quyết tranh chấp/khiếu nại.