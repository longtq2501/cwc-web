
# Crowdsourced Waste Collection & Recycling Platform
## Nền tảng kết nối thu gom rác và tái chế cộng đồng

> **Phân tích & Làm rõ yêu cầu bài toán** | Năm 2025

---

## Table of Contents
1. [Mô tả bài toán & Bối cảnh](#mô-tả-bài-toán--bối-cảnh)
2. [Actor & Vai trò](#actor--vai-trò)
3. [Functional Requirements](#functional-requirements)
4. [Non-functional Requirements](#non-functional-requirements)
5. [Business Rules & Ràng buộc](#business-rules--ràng-buộc)
6. [Luồng nghiệp vụ chính](#luồng-nghiệp-vụ-chính)
7. [Database Schema](#database-schema)

---

## Mô tả bài toán & Bối cảnh

### Bối cảnh

Quản lý rác thải đô thị tại Việt Nam đang đối mặt với nhiều thách thức nghiêm trọng:
- Lịch thu gom không ổn định
- Tỷ lệ phân loại rác tại nguồn thấp
- Sự phối hợp rời rạc giữa người dân, đơn vị thu gom và doanh nghiệp tái chế

**Quy định bắt buộc:** Luật Bảo vệ Môi trường 2020 yêu cầu phân loại rác tại nguồn từ năm 2025. Điều này đặt ra nhu cầu cấp thiết về một **nền tảng số hóa** hỗ trợ kết nối, điều phối và giám sát toàn bộ quy trình thu gom – tái chế theo khu vực một cách hiệu quả và minh bạch.

### Vấn đề hiện tại

- ❌ Chưa có hệ thống số hóa tập trung cho phép người dân báo cáo rác và theo dõi trạng thái thu gom
- ❌ Doanh nghiệp tái chế và cơ quan quản lý thiếu dữ liệu vận hành theo thời gian thực
- ❌ Không có cơ chế khuyến khích người dân phân loại rác đúng cách
- ❌ Việc điều phối Collector thủ công dẫn đến chậm trễ, trùng lặp và bỏ sót yêu cầu
- ❌ Chi phí vận hành cao do thiếu công cụ phân tích và tối ưu hóa tuyến đường thu gom

### Giải pháp đề xuất

**Nền tảng web/mobile kết nối 4 nhóm đối tượng:**

| Nhóm | Vai trò | Khả năng |
|------|---------|----------|
| **Citizen** | Người dân | Báo cáo rác kèm ảnh, vị trí GPS và loại rác được phân loại |
| **Enterprise** | Doanh nghiệp tái chế | Tiếp nhận, điều phối thu gom và quản lý năng lực xử lý theo khu vực |
| **Collector** | Nhân viên thu gom | Nhận nhiệm vụ, cập nhật trạng thái theo thời gian thực |
| **System** | Hệ thống | Điểm thưởng gamification khuyến khích người dân tham gia tích cực |

---

## Actor & Vai trò

Hệ thống có **4 nhóm người dùng chính** với vai trò và quyền hạn khác nhau:

| Actor | Tên tiếng Việt | Vai trò chính | Quyền truy cập |
|-------|--------|-----------|---------|
| **Citizen** | Người dân | Báo cáo rác, theo dõi trạng thái, nhận điểm thưởng | Tạo báo cáo, xem lịch sử, leaderboard |
| **Enterprise** | Doanh nghiệp tái chế | Tiếp nhận yêu cầu, điều phối Collector, cấu hình năng lực | Quản lý đơn vị thu gom và khu vực phục vụ |
| **Collector** | Nhân viên thu gom | Thực hiện thu gom, cập nhật trạng thái, xác nhận hoàn tất | Thuộc 1 Enterprise cố định |
| **Administrator** | Quản trị viên | Quản lý toàn hệ thống, duyệt Enterprise, xử lý tranh chấp | Toàn quyền hệ thống |

---

## Functional Requirements

### Citizen (Người dân)

| # | Chức năng | Mô tả chi tiết | Ưu tiên |
|---|----------|---------------|---------|
| FR-C01 | Đăng ký / Đăng nhập | Tạo tài khoản bằng email hoặc số điện thoại, đăng nhập có xác thực | Bắt buộc |
| FR-C02 | Tạo báo cáo rác | Chụp ảnh, chọn loại rác, nhập địa chỉ (phường/xã), thêm mô tả và ước tính khối lượng | Core |
| FR-C03 | Phân loại rác tại nguồn | Chọn loại rác: Organic, Recyclable, Hazardous, Electronic, Bulky, Other | Core |
| FR-C04 | Theo dõi trạng thái báo cáo | Xem trạng thái: Pending → Accepted → Assigned → Collected → Confirmed | Core |
| FR-C05 | Xác nhận đã được thu gom | Citizen xác nhận sau khi Collector hoàn tất, kích hoạt cộng điểm | Core |
| FR-C06 | Nhận điểm thưởng | Điểm được cộng tự động khi báo cáo hợp lệ và phân loại đúng | Core |
| FR-C07 | Xem lịch sử điểm | Xem toàn bộ lịch sử cộng/trừ điểm với lý do chi tiết | Core |
| FR-C08 | Bảng xếp hạng | Xem leaderboard theo khu vực (phường), theo tháng và toàn thời gian | Core |
| FR-C09 | Gửi phản hồi / khiếu nại | Gửi khiếu nại khi thu gom không đúng cam kết | Core |
| FR-C10 | Nhận thông báo | Nhận push notification khi trạng thái báo cáo thay đổi | Core |

### Recycling Enterprise (Doanh nghiệp tái chế)

| # | Chức năng | Mô tả chi tiết | Ưu tiên |
|---|----------|---------------|---------|
| FR-E01 | Đăng ký Enterprise | Đăng ký tài khoản doanh nghiệp, chờ Admin phê duyệt | Bắt buộc |
| FR-E02 | Cấu hình năng lực xử lý | Khai báo loại rác tiếp nhận, công suất xử lý (kg/ngày), khu vực phục vụ | Core |
| FR-E03 | Tiếp nhận / từ chối yêu cầu | Xem danh sách báo cáo trong khu vực phục vụ, chấp nhận hoặc từ chối | Core |
| FR-E04 | Gán Collector | Phân công báo cáo đã tiếp nhận cho Collector thuộc Enterprise | Core |
| FR-E05 | Theo dõi tiến độ thu gom | Xem trạng thái thu gom theo thời gian thực của tất cả Collector | Core |
| FR-E06 | Quản lý Collector | Thêm, sửa, vô hiệu hóa tài khoản Collector thuộc Enterprise | Core |
| FR-E07 | Xem báo cáo vận hành | Thống kê khối lượng rác thu gom theo loại / khu vực / thời gian | Core |
| FR-E08 | Xem gợi ý ưu tiên xử lý | Hệ thống gợi ý yêu cầu cần ưu tiên dựa trên loại rác và thời gian chờ | Optional |

### Collector (Nhân viên thu gom)

| # | Chức năng | Mô tả chi tiết | Ưu tiên |
|---|----------|---------------|---------|
| FR-L01 | Xem danh sách nhiệm vụ | Xem các báo cáo được phân công từ Enterprise kèm địa chỉ và loại rác | Core |
| FR-L02 | Cập nhật trạng thái thu gom | Cập nhật: Assigned → On the way → Collected theo thời gian thực | Core |
| FR-L03 | Xác nhận hoàn tất bằng ảnh | Chụp ảnh xác nhận đã thu gom, nhập khối lượng thực tế | Core |
| FR-L04 | Xem lịch sử công việc | Xem danh sách nhiệm vụ đã hoàn thành và thống kê cá nhân | Core |

### Administrator (Quản trị viên)

| # | Chức năng | Mô tả chi tiết | Ưu tiên |
|---|----------|---------------|---------|
| FR-A01 | Quản lý tài khoản & phân quyền | Xem, khóa, mở khóa tài khoản người dùng; gán vai trò | Core |
| FR-A02 | Duyệt Enterprise | Xem xét và phê duyệt / từ chối đăng ký của Recycling Enterprise | Core |
| FR-A03 | Quản lý quy tắc điểm thưởng | Tạo, sửa, vô hiệu hóa quy tắc cộng điểm áp dụng toàn hệ thống | Core |
| FR-A04 | Giám sát hoạt động hệ thống | Dashboard tổng quan: số báo cáo, tỷ lệ xử lý, khối lượng thu gom | Core |
| FR-A05 | Xử lý tranh chấp / khiếu nại | Tiếp nhận và phân xử khiếu nại từ Citizen, ghi kết quả xử lý | Core |
| FR-A06 | Quản lý danh mục loại rác | Thêm, sửa, ẩn/hiện các loại rác trong hệ thống | Core |
| FR-A07 | Quản lý danh mục địa lý | Cập nhật danh mục tỉnh / quận / phường khi cần | Core |
| FR-A08 | Báo cáo thống kê tổng hợp | Xuất báo cáo hoạt động toàn hệ thống theo kỳ | Core |

---

## Non-functional Requirements

| Mã | Tiêu chí | Yêu cầu cụ thể | Ưu tiên |
|---|----------|----------------|---------|
| NFR-01 | Hiệu năng (Performance) | Trang tải < 3 giây; API phản hồi < 500ms với 500 concurrent users | **Cao** |
| NFR-02 | Khả dụng (Availability) | Uptime >= 99.5%; có cơ chế failover cho các tính năng core | **Cao** |
| NFR-03 | Bảo mật (Security) | Mã hóa mật khẩu bcrypt; JWT authentication; HTTPS toàn bộ | **Cao** |
| NFR-04 | Khả năng mở rộng (Scalability) | Kiến trúc hỗ trợ mở rộng ngang (horizontal scaling); DB indexing tối ưu | Trung bình |
| NFR-05 | Tính sử dụng (Usability) | UI thân thiện mobile-first; hỗ trợ tiếng Việt toàn bộ | **Cao** |
| NFR-06 | Độ tin cậy dữ liệu | Transaction ACID cho thao tác điểm thưởng; không mất dữ liệu báo cáo | **Cao** |
| NFR-07 | Khả năng bảo trì | Code tuân thủ chuẩn; log đầy đủ; tài liệu API đầy đủ | Trung bình |

---

## Business Rules & Ràng buộc

### Quy tắc về Báo cáo rác

- **BR-01**: Mỗi báo cáo chỉ được tiếp nhận bởi duy nhất 1 Enterprise tại 1 thời điểm
- **BR-02**: Enterprise chỉ thấy báo cáo thuộc khu vực (phường) mà mình đã đăng ký phục vụ
- **BR-03**: Citizen chỉ được hủy báo cáo khi trạng thái còn là Pending
- **BR-04**: Báo cáo phải có ít nhất 1 ảnh và chọn loại rác mới được gửi đi
- **BR-05**: Một Citizen không thể gửi quá 10 báo cáo trong 1 ngày (chống spam)

### Quy tắc về Collector

- **BR-06**: Mỗi Collector chỉ thuộc về duy nhất 1 Recycling Enterprise
- **BR-07**: Collector chỉ nhận nhiệm vụ được gán từ Enterprise của mình
- **BR-08**: Collector phải upload ảnh xác nhận khi cập nhật trạng thái Collected

### Quy tắc về Điểm thưởng

- **BR-09**: Điểm chỉ được cộng sau khi Citizen xác nhận đã nhận được dịch vụ thu gom
- **BR-10**: Quy tắc điểm thưởng do Admin tạo và áp dụng toàn hệ thống
- **BR-11**: Điểm âm không được phép — số dư điểm tối thiểu là 0
- **BR-12**: Leaderboard cập nhật theo thời gian thực khi có giao dịch điểm mới

### Quy tắc về Enterprise

- **BR-13**: Enterprise phải được Admin phê duyệt trước khi có thể tiếp nhận yêu cầu
- **BR-14**: Enterprise bị suspended không thể tiếp nhận yêu cầu mới nhưng vẫn xử lý các yêu cầu đang thực hiện
- **BR-15**: Enterprise phải khai báo ít nhất 1 loại rác và 1 khu vực phục vụ khi đăng ký

### Ràng buộc kỹ thuật

- **TC-01**: Khu vực quản lý theo đơn vị hành chính Tỉnh / Quận / Phường
- **TC-02**: Hệ thống dùng MySQL 8.0+, encoding utf8mb4 để hỗ trợ tiếng Việt
- **TC-03**: Tất cả ảnh upload phải được lưu trên cloud storage
- **TC-04**: Soft delete áp dụng cho tất cả bảng chính (is_deleted = true)

---

## Luồng nghiệp vụ chính

### Luồng báo cáo & thu gom rác (Happy Path)

| Bước | Actor | Hành động | Trạng thái |
|------|-------|----------|----------|
| 1 | Citizen | Tạo báo cáo rác (ảnh + loại rác + địa chỉ phường) | `PENDING` |
| 2 | Hệ thống | Tự động thông báo cho Enterprise phục vụ khu vực đó | Notification gửi |
| 3 | Enterprise | Xem và tiếp nhận yêu cầu | `ACCEPTED` |
| 4 | Enterprise | Gán Collector phù hợp | `ASSIGNED` |
| 5 | Collector | Bắt đầu di chuyển tới địa điểm | `ON_THE_WAY` |
| 6 | Collector | Hoàn tất thu gom, upload ảnh xác nhận | `COLLECTED` |
| 7 | Citizen | Nhận thông báo, xác nhận đã được thu gom | `CONFIRMED` |
| 8 | Hệ thống | Áp dụng quy tắc điểm, cộng điểm cho Citizen | Ghi nhận |
| 9 | Hệ thống | Cập nhật leaderboard theo phường | Cập nhật |

### Luồng đăng ký & duyệt Enterprise

```
1. Enterprise nộp đơn đăng ký
   ↓
2. Admin nhận thông báo & xem xét hồ sơ
   ↓
3a. PHÊDUYỆT → Status: approved → Hoạt động ngay
   └→ 3b. TỪ CHỐI → Gửi lý do → Enterprise chỉnh sửa & nộp lại
```

### Luồng xử lý khiếu nại

```
1. Citizen gửi khiếu nại
   ↓
2. Admin nhận & xem xét bằng chứng
   ↓
3a. GIẢI QUYẾT → Admin điều chỉnh điểm & gửi thông báo
   └→ 3b. TỪ CHỐI → Thông báo từ chối
```

### Sơ đồ trạng thái báo cáo rác

| Trạng thái | Ý nghĩa | Chuyển sang | Điều kiện |
|-----------|---------|-----------|-----------|
| **PENDING** | Vừa được tạo, chờ Enterprise | ACCEPTED / REJECTED / CANCELLED | Enterprise tiếp nhận / từ chối / Citizen hủy |
| **ACCEPTED** | Enterprise đã tiếp nhận | ASSIGNED | Enterprise gán Collector |
| **ASSIGNED** | Đã có Collector nhận nhiệm vụ | COLLECTED | Collector hoàn tất thu gom |
| **COLLECTED** | Collector đã thu gom xong | CONFIRMED | Citizen xác nhận |
| **CONFIRMED** | Hoàn tất toàn bộ quy trình | _(Kết thúc)_ | Điểm được cộng |
| **REJECTED** | Enterprise từ chối | _(Kết thúc)_ | Có thể tạo báo cáo mới |
| **CANCELLED** | Citizen hủy Pending | _(Kết thúc)_ | Chỉ hủy ở trạng thái Pending |

---

## Database Schema

```sql
-- ============================================================
-- CROWDSOURCED WASTE COLLECTION & RECYCLING PLATFORM
-- Database: MySQL 8.0+
-- Encoding: utf8mb4
-- ============================================================

CREATE DATABASE IF NOT EXISTS waste_recycling
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE waste_recycling;

-- ============================================================
-- NHÓM 1: ĐỊA LÝ HÀNH CHÍNH
-- ============================================================

CREATE TABLE provinces (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Tỉnh / Thành phố';

CREATE TABLE districts (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    province_id INT UNSIGNED NOT NULL,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_district_province FOREIGN KEY (province_id)
        REFERENCES provinces(id) ON DELETE CASCADE
) COMMENT 'Quận / Huyện';

CREATE TABLE wards (
    id          INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    district_id INT UNSIGNED NOT NULL,
    name        VARCHAR(100) NOT NULL,
    code        VARCHAR(10)  NOT NULL UNIQUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_ward_district FOREIGN KEY (district_id)
        REFERENCES districts(id) ON DELETE CASCADE
) COMMENT 'Phường / Xã';

-- ============================================================
-- NHÓM 2: USERS & AUTH
-- ============================================================

CREATE TABLE roles (
    id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(50)  NOT NULL UNIQUE  COMMENT 'citizen | collector | enterprise | admin',
    description VARCHAR(255),
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Vai trò hệ thống';

CREATE TABLE users (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    role_id         TINYINT UNSIGNED NOT NULL,
    full_name       VARCHAR(150)    NOT NULL,
    email           VARCHAR(255)    NOT NULL UNIQUE,
    phone           VARCHAR(20)     UNIQUE,
    password_hash   VARCHAR(255)    NOT NULL,
    avatar_url      VARCHAR(500),
    -- Địa chỉ thường trú (dùng cho Citizen để tính leaderboard khu vực)
    ward_id         INT UNSIGNED,
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    is_deleted      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_user_role FOREIGN KEY (role_id)
        REFERENCES roles(id),
    CONSTRAINT fk_user_ward FOREIGN KEY (ward_id)
        REFERENCES wards(id)
) COMMENT 'Tất cả người dùng hệ thống';

-- ============================================================
-- NHÓM 3: RECYCLING ENTERPRISE
-- ============================================================

CREATE TABLE recycling_enterprises (
    id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id             INT UNSIGNED    NOT NULL UNIQUE  COMMENT 'Tài khoản quản lý enterprise',
    enterprise_name     VARCHAR(200)    NOT NULL,
    license_number      VARCHAR(100)    UNIQUE           COMMENT 'Số giấy phép kinh doanh',
    description         TEXT,
    address             VARCHAR(500),
    ward_id             INT UNSIGNED,
    logo_url            VARCHAR(500),
    status              ENUM('pending','approved','suspended') NOT NULL DEFAULT 'pending'
                        COMMENT 'Admin duyệt trước khi hoạt động',
    approved_at         TIMESTAMP,
    approved_by         INT UNSIGNED                    COMMENT 'Admin đã duyệt',
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_enterprise_user    FOREIGN KEY (user_id)       REFERENCES users(id),
    CONSTRAINT fk_enterprise_ward    FOREIGN KEY (ward_id)        REFERENCES wards(id),
    CONSTRAINT fk_enterprise_admin   FOREIGN KEY (approved_by)    REFERENCES users(id)
) COMMENT 'Doanh nghiệp tái chế';

CREATE TABLE waste_types (
    id          TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE  COMMENT 'Organic | Recyclable | Hazardous | Bulky | Electronic | Other',
    description VARCHAR(255),
    icon_url    VARCHAR(500),
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
) COMMENT 'Danh mục loại rác';

CREATE TABLE enterprise_capabilities (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    enterprise_id   INT UNSIGNED    NOT NULL,
    waste_type_id   TINYINT UNSIGNED NOT NULL,
    max_capacity_kg DECIMAL(10,2)   COMMENT 'Công suất xử lý tối đa (kg/ngày)',
    notes           VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_enterprise_waste (enterprise_id, waste_type_id),
    CONSTRAINT fk_cap_enterprise  FOREIGN KEY (enterprise_id)  REFERENCES recycling_enterprises(id) ON DELETE CASCADE,
    CONSTRAINT fk_cap_waste_type  FOREIGN KEY (waste_type_id)  REFERENCES waste_types(id)
) COMMENT 'Năng lực xử lý rác của từng Enterprise theo loại rác';

CREATE TABLE enterprise_service_areas (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    enterprise_id   INT UNSIGNED    NOT NULL,
    ward_id         INT UNSIGNED    NOT NULL,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uq_enterprise_area (enterprise_id, ward_id),
    CONSTRAINT fk_area_enterprise FOREIGN KEY (enterprise_id) REFERENCES recycling_enterprises(id) ON DELETE CASCADE,
    CONSTRAINT fk_area_ward       FOREIGN KEY (ward_id)       REFERENCES wards(id)
) COMMENT 'Khu vực phục vụ của Enterprise (theo Phường/Xã)';

-- ============================================================
-- NHÓM 4: COLLECTOR
-- ============================================================

CREATE TABLE collectors (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL UNIQUE,
    enterprise_id   INT UNSIGNED    NOT NULL  COMMENT 'Chỉ thuộc 1 Enterprise',
    vehicle_info    VARCHAR(255)    COMMENT 'Thông tin phương tiện (biển số, loại xe)',
    status          ENUM('active','inactive','suspended') NOT NULL DEFAULT 'active',
    joined_at       DATE,
    is_deleted      BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_collector_user       FOREIGN KEY (user_id)       REFERENCES users(id),
    CONSTRAINT fk_collector_enterprise FOREIGN KEY (enterprise_id) REFERENCES recycling_enterprises(id)
) COMMENT 'Nhân viên thu gom - thuộc đúng 1 Enterprise';

-- ============================================================
-- NHÓM 5: BÁO CÁO RÁC
-- ============================================================

CREATE TABLE waste_reports (
    id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    citizen_id          INT UNSIGNED    NOT NULL  COMMENT 'User có role citizen',
    waste_type_id       TINYINT UNSIGNED NOT NULL,
    -- Vị trí
    ward_id             INT UNSIGNED    NOT NULL,
    address_detail      VARCHAR(500)    NOT NULL  COMMENT 'Số nhà, tên đường...',
    latitude            DECIMAL(10,7)   COMMENT 'Toạ độ GPS (lưu thêm để hiển thị map)',
    longitude           DECIMAL(10,7),
    -- Nội dung
    description         TEXT,
    estimated_weight_kg DECIMAL(8,2)   COMMENT 'Ước tính khối lượng',
    -- Trạng thái
    status              ENUM('pending','accepted','rejected','assigned','collected','confirmed','cancelled')
                        NOT NULL DEFAULT 'pending',
    rejected_reason     VARCHAR(500),
    -- Điểm thưởng
    is_valid_report     BOOLEAN         COMMENT 'Enterprise xác nhận báo cáo hợp lệ',
    is_correct_type     BOOLEAN         COMMENT 'Phân loại rác đúng không',
    points_awarded      INT UNSIGNED    NOT NULL DEFAULT 0,
    -- AI (optional)
    ai_suggested_type   TINYINT UNSIGNED COMMENT 'Loại rác AI gợi ý',
    ai_confidence       DECIMAL(5,2)    COMMENT 'Độ tin cậy AI (%)',
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_report_citizen    FOREIGN KEY (citizen_id)    REFERENCES users(id),
    CONSTRAINT fk_report_waste_type FOREIGN KEY (waste_type_id) REFERENCES waste_types(id),
    CONSTRAINT fk_report_ward       FOREIGN KEY (ward_id)       REFERENCES wards(id),
    CONSTRAINT fk_report_ai_type    FOREIGN KEY (ai_suggested_type) REFERENCES waste_types(id)
) COMMENT 'Báo cáo rác/tái chế của Citizen';

CREATE TABLE report_images (
    id          INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    report_id   INT UNSIGNED    NOT NULL,
    image_url   VARCHAR(500)    NOT NULL,
    is_primary  BOOLEAN         NOT NULL DEFAULT FALSE COMMENT 'Ảnh đại diện',
    uploaded_at TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_img_report FOREIGN KEY (report_id) REFERENCES waste_reports(id) ON DELETE CASCADE
) COMMENT 'Ảnh đính kèm báo cáo rác';

-- ============================================================
-- NHÓM 6: PHÂN CÔNG & THU GOM
-- ============================================================

CREATE TABLE collection_assignments (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    report_id       INT UNSIGNED    NOT NULL UNIQUE  COMMENT 'Mỗi báo cáo chỉ có 1 assignment active',
    enterprise_id   INT UNSIGNED    NOT NULL,
    collector_id    INT UNSIGNED,               COMMENT 'NULL khi Enterprise chưa gán Collector',
    -- Trạng thái
    status          ENUM('accepted','assigned','on_the_way','collected','failed')
                    NOT NULL DEFAULT 'accepted',
    -- Thời gian
    accepted_at     TIMESTAMP       COMMENT 'Enterprise tiếp nhận',
    assigned_at     TIMESTAMP       COMMENT 'Gán Collector',
    started_at      TIMESTAMP       COMMENT 'Collector bắt đầu di chuyển',
    collected_at    TIMESTAMP       COMMENT 'Collector hoàn tất thu gom',
    -- Kết quả
    actual_weight_kg DECIMAL(8,2)   COMMENT 'Khối lượng thực tế thu gom',
    collector_note  TEXT,
    proof_image_url VARCHAR(500)    COMMENT 'Ảnh xác nhận hoàn tất',
    failed_reason   VARCHAR(500),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_assign_report     FOREIGN KEY (report_id)     REFERENCES waste_reports(id),
    CONSTRAINT fk_assign_enterprise FOREIGN KEY (enterprise_id) REFERENCES recycling_enterprises(id),
    CONSTRAINT fk_assign_collector  FOREIGN KEY (collector_id)  REFERENCES collectors(id)
) COMMENT 'Phân công thu gom từ Enterprise → Collector';

-- ============================================================
-- NHÓM 7: ĐIỂM THƯỞNG
-- ============================================================

CREATE TABLE point_rules (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    waste_type_id   TINYINT UNSIGNED            COMMENT 'NULL = áp dụng tất cả loại rác',
    rule_name       VARCHAR(200)    NOT NULL,
    description     VARCHAR(500),
    -- Điều kiện
    condition_type  ENUM('valid_report','correct_classification','fast_collection','first_report_of_day','other')
                    NOT NULL,
    -- Điểm
    points          INT             NOT NULL     COMMENT 'Số điểm thưởng (âm = trừ điểm)',
    -- Hiệu lực
    is_active       BOOLEAN         NOT NULL DEFAULT TRUE,
    effective_from  DATE            NOT NULL,
    effective_to    DATE,
    created_by      INT UNSIGNED    NOT NULL     COMMENT 'Admin tạo',
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_rule_waste_type FOREIGN KEY (waste_type_id) REFERENCES waste_types(id),
    CONSTRAINT fk_rule_admin      FOREIGN KEY (created_by)    REFERENCES users(id)
) COMMENT 'Quy tắc tính điểm - Admin quản lý toàn hệ thống';

CREATE TABLE point_transactions (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    citizen_id      INT UNSIGNED    NOT NULL,
    report_id       INT UNSIGNED,
    rule_id         INT UNSIGNED,
    points          INT             NOT NULL     COMMENT 'Dương = cộng, âm = trừ',
    balance_after   INT             NOT NULL     COMMENT 'Số dư sau giao dịch',
    description     VARCHAR(255),
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tx_citizen FOREIGN KEY (citizen_id) REFERENCES users(id),
    CONSTRAINT fk_tx_report  FOREIGN KEY (report_id)  REFERENCES waste_reports(id),
    CONSTRAINT fk_tx_rule    FOREIGN KEY (rule_id)    REFERENCES point_rules(id)
) COMMENT 'Lịch sử cộng/trừ điểm của Citizen';

CREATE TABLE leaderboards (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    citizen_id      INT UNSIGNED    NOT NULL,
    ward_id         INT UNSIGNED    NOT NULL     COMMENT 'Bảng xếp hạng theo phường',
    -- Điểm toàn thời gian
    total_points    INT             NOT NULL DEFAULT 0,
    total_rank      INT UNSIGNED    COMMENT 'Hạng toàn thời gian trong phường',
    -- Điểm theo tháng
    period_year     SMALLINT UNSIGNED NOT NULL,
    period_month    TINYINT UNSIGNED  NOT NULL,
    period_points   INT             NOT NULL DEFAULT 0,
    period_rank     INT UNSIGNED    COMMENT 'Hạng tháng trong phường',
    -- Thống kê thêm
    total_reports   INT UNSIGNED    NOT NULL DEFAULT 0,
    updated_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY uq_leaderboard (citizen_id, ward_id, period_year, period_month),
    CONSTRAINT fk_lb_citizen FOREIGN KEY (citizen_id) REFERENCES users(id),
    CONSTRAINT fk_lb_ward    FOREIGN KEY (ward_id)    REFERENCES wards(id)
) COMMENT 'Bảng xếp hạng theo khu vực - cả tổng và theo tháng';

-- ============================================================
-- NHÓM 8: FEEDBACK & KHIẾU NẠI
-- ============================================================

CREATE TABLE feedbacks (
    id                  INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    citizen_id          INT UNSIGNED    NOT NULL,
    report_id           INT UNSIGNED    NOT NULL,
    assignment_id       INT UNSIGNED,
    feedback_type       ENUM('complaint','compliment','suggestion') NOT NULL,
    content             TEXT            NOT NULL,
    status              ENUM('pending','processing','resolved','rejected')
                        NOT NULL DEFAULT 'pending',
    resolved_by         INT UNSIGNED    COMMENT 'Admin xử lý',
    resolved_at         TIMESTAMP,
    resolution_note     TEXT,
    is_deleted          BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at          TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_fb_citizen    FOREIGN KEY (citizen_id)    REFERENCES users(id),
    CONSTRAINT fk_fb_report     FOREIGN KEY (report_id)     REFERENCES waste_reports(id),
    CONSTRAINT fk_fb_assignment FOREIGN KEY (assignment_id) REFERENCES collection_assignments(id),
    CONSTRAINT fk_fb_admin      FOREIGN KEY (resolved_by)   REFERENCES users(id)
) COMMENT 'Phản hồi / khiếu nại của Citizen';

-- ============================================================
-- NHÓM 9: THÔNG BÁO
-- ============================================================

CREATE TABLE notifications (
    id              INT UNSIGNED    AUTO_INCREMENT PRIMARY KEY,
    user_id         INT UNSIGNED    NOT NULL,
    title           VARCHAR(255)    NOT NULL,
    body            TEXT            NOT NULL,
    type            ENUM('report_status','point_earned','assignment','system','feedback')
                    NOT NULL,
    ref_id          INT UNSIGNED    COMMENT 'ID của đối tượng liên quan (report, assignment...)',
    is_read         BOOLEAN         NOT NULL DEFAULT FALSE,
    created_at      TIMESTAMP       NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_notif_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) COMMENT 'Thông báo đẩy cho người dùng';

-- ============================================================
-- INDEXES BỔ SUNG (performance)
-- ============================================================

-- Tìm báo cáo theo khu vực và trạng thái (Enterprise dùng nhiều)
CREATE INDEX idx_report_ward_status   ON waste_reports (ward_id, status);
-- Tìm báo cáo theo Citizen
CREATE INDEX idx_report_citizen       ON waste_reports (citizen_id, created_at DESC);
-- Tìm assignment theo Collector
CREATE INDEX idx_assign_collector     ON collection_assignments (collector_id, status);
-- Tìm điểm theo Citizen
CREATE INDEX idx_tx_citizen_time      ON point_transactions (citizen_id, created_at DESC);
-- Leaderboard query
CREATE INDEX idx_lb_ward_period       ON leaderboards (ward_id, period_year, period_month, period_points DESC);
CREATE INDEX idx_lb_ward_total        ON leaderboards (ward_id, total_points DESC);
-- Thông báo chưa đọc
CREATE INDEX idx_notif_user_unread    ON notifications (user_id, is_read, created_at DESC);
-- Enterprise tìm theo khu vực
CREATE INDEX idx_area_ward            ON enterprise_service_areas (ward_id);

-- ============================================================
-- SEED DATA CƠ BẢN
-- ============================================================

INSERT INTO roles (name, description) VALUES
('citizen',    'Người dân báo cáo rác'),
('collector',  'Nhân viên thu gom của Enterprise'),
('enterprise', 'Tài khoản quản lý Recycling Enterprise'),
('admin',      'Quản trị viên hệ thống');

INSERT INTO waste_types (name, description) VALUES
('Organic',     'Rác hữu cơ, thực phẩm thừa'),
('Recyclable',  'Rác có thể tái chế: giấy, nhựa, kim loại, thủy tinh'),
('Hazardous',   'Rác nguy hại: pin, hóa chất, thuốc'),
('Bulky',       'Rác cồng kềnh: đồ nội thất, thiết bị lớn'),
('Electronic',  'Rác điện tử: máy tính, điện thoại cũ'),
('Other',       'Loại rác khác');

INSERT INTO point_rules (waste_type_id, rule_name, condition_type, points, effective_from, created_by)
VALUES
(NULL, 'Báo cáo hợp lệ',           'valid_report',          10, '2025-01-01', 1),
(NULL, 'Phân loại rác đúng',        'correct_classification', 5, '2025-01-01', 1),
(3,    'Báo cáo rác nguy hại đúng', 'correct_classification',15, '2025-01-01', 1),
(NULL, 'Báo cáo đầu tiên trong ngày','first_report_of_day',   3, '2025-01-01', 1);
```

---

## Tóm tắt

### Key Features
- ✅ **Gamification**: Hệ thống điểm thưởng để khuyến khích người dân
- ✅ **Real-time tracking**: Theo dõi trạng thái thu gom theo thời gian thực
- ✅ **Multi-role system**: 4 vai trò với quyền hạn khác nhau
- ✅ **Complaint handling**: Hệ thống tiếp nhận và xử lý khiếu nại
- ✅ **Leaderboard**: Bảng xếp hạng theo khu vực và theo tháng
- ✅ **Analytics**: Báo cáo chi tiết cho quản trị viên và doanh nghiệp

### Technology Stack
- **Backend**: Node.js / Java / Python (TBD)
- **Database**: MySQL 8.0+
- **Frontend**: React / Vue.js (TBD)
- **Cloud Storage**: AWS S3 / Google Cloud Storage
- **API**: REST / GraphQL (TBD)

### Timeline
- Năm 2025: Phase 1 - MVP (Citizen, Enterprise cơ bản, Collector)
- Năm 2025: Phase 2 - Analytics & Optimization
- Năm 2026: Phase 3 - AI-powered classification & Route planning

