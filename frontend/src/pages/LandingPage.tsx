import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Leaf, Recycle, Truck, ShieldCheck, 
  ArrowRight, CheckCircle2, Award, Users, Building2, 
  Menu, X, Star, CheckCircle, XCircle, Zap, 
  Trophy, Sofa, Laptop, Box, BatteryWarning,
  Facebook, Youtube, Instagram
} from 'lucide-react';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 cursor-pointer group hover:opacity-80 transition-opacity">
          <div className="bg-primary p-2 rounded-lg group-hover:scale-110 transition-transform shadow-sm shadow-primary/20">
            <Recycle className="text-white w-6 h-6" />
          </div>
          <span className="font-display font-bold text-xl text-primary tracking-tight">EcoCollect</span>
        </Link>
        
        <div className="hidden lg:flex items-center gap-8">
          <a href="#features" className="text-gray-600 hover:text-primary font-medium transition-colors">Tính năng</a>
          <a href="#workflow" className="text-gray-600 hover:text-primary font-medium transition-colors">Cách hoạt động</a>
          <a href="#rewards" className="text-gray-600 hover:text-primary font-medium transition-colors">Điểm thưởng</a>
          <a href="#enterprise" className="text-gray-600 hover:text-primary font-medium transition-colors">Đối tác</a>
          <a href="#about" className="text-gray-600 hover:text-primary font-medium transition-colors">Về chúng tôi</a>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <button onClick={() => navigate('/login')} className="text-primary font-medium hover:bg-primary-pale px-4 py-2 rounded-full transition-colors">
            Đăng nhập
          </button>
          <button onClick={() => navigate('/register')} className="bg-primary-mid text-white font-medium px-6 py-2 rounded-full hover:bg-primary transition-colors flex items-center gap-2">
            Bắt đầu miễn phí <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <button className="lg:hidden text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg py-4 px-4 flex flex-col gap-4">
          <a href="#features" className="text-gray-600 font-medium py-2 border-b border-gray-100">Tính năng</a>
          <a href="#workflow" className="text-gray-600 font-medium py-2 border-b border-gray-100">Cách hoạt động</a>
          <a href="#rewards" className="text-gray-600 font-medium py-2 border-b border-gray-100">Điểm thưởng</a>
          <a href="#enterprise" className="text-gray-600 font-medium py-2 border-b border-gray-100">Đối tác</a>
          <div className="flex flex-col gap-2 mt-2">
            <button onClick={() => navigate('/login')} className="text-primary font-medium py-2 border border-primary rounded-full">Đăng nhập</button>
            <button onClick={() => navigate('/register')} className="bg-primary-mid text-white font-medium py-2 rounded-full">Bắt đầu miễn phí</button>
          </div>
        </div>
      )}
    </nav>
  );
};

const Hero = () => {
  return (
    <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
      <div className="flex-1 text-center lg:text-left">
        <div className="inline-flex items-center gap-2 bg-primary-pale text-primary-mid px-4 py-1.5 rounded-full text-sm font-medium mb-6">
          <ShieldCheck className="w-4 h-4" />
          Tuân thủ Luật BVMT 2020 — Bắt buộc từ 2025
        </div>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-gray-900 leading-tight mb-6">
          Phân Loại Rác Đúng Cách <br className="hidden md:block" />
          <span className="text-primary-mid">Nhận Thưởng Thực Sự</span>
        </h1>
        <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
          Nền tảng kết nối 4 bên: Người dân, Doanh nghiệp tái chế, Đội thu gom và Chính quyền địa phương — minh bạch, tức thì, hiệu quả.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start mb-12">
          <button className="w-full sm:w-auto bg-primary-mid text-white font-medium px-8 py-4 rounded-full hover:bg-primary transition-all hover:shadow-lg hover:-translate-y-1 flex items-center justify-center gap-2 text-lg">
            <Leaf className="w-5 h-5" /> Báo Cáo Rác Ngay — Miễn Phí
          </button>
          <button className="w-full sm:w-auto bg-white text-enterprise border-2 border-enterprise font-medium px-8 py-4 rounded-full hover:bg-enterprise-lt/20 transition-all flex items-center justify-center gap-2 text-lg">
            Tôi là Doanh Nghiệp <ArrowRight className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm font-medium text-gray-500">
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-light" /> 48,000+ Hộ gia đình</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-light" /> 850 Đội thu gom</div>
          <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary-light" /> 1,247 Tấn rác đã xử lý</div>
        </div>
      </div>
      
      <div className="flex-1 relative w-full max-w-lg lg:max-w-none hidden md:block">
        <div className="relative aspect-square bg-primary-pale rounded-full flex items-center justify-center p-8">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            className="w-full h-full border-4 border-dashed border-primary-light/30 rounded-full relative"
          >
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100">
              <Users className="w-8 h-8 text-primary" />
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100">
              <Building2 className="w-8 h-8 text-enterprise" />
            </div>
            <div className="absolute top-1/2 -left-6 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100">
              <Truck className="w-8 h-8 text-collector" />
            </div>
            <div className="absolute top-1/2 -right-6 -translate-y-1/2 bg-white p-3 rounded-full shadow-lg border border-gray-100">
              <ShieldCheck className="w-8 h-8 text-purple-600" />
            </div>
          </motion.div>
          
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <Recycle className="w-24 h-24 text-primary-mid opacity-20" />
          </div>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute top-1/4 -right-12 bg-white p-4 rounded-xl shadow-xl border border-gray-100 w-64"
          >
            <div className="flex items-center gap-3 mb-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Trạng thái</span>
            </div>
            <p className="text-sm font-medium text-gray-900">✅ COLLECTED — Chị Mai, Q.7</p>
            <p className="text-xs text-gray-500 mt-1">5 phút trước</p>
          </motion.div>

          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-1/4 -left-8 bg-white p-3 rounded-xl shadow-xl border border-gray-100 flex items-center gap-3"
          >
            <div className="bg-yellow-100 p-2 rounded-full">
              <Award className="w-5 h-5 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">+10 điểm</p>
              <p className="text-xs text-gray-500">vừa được cộng!</p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Problems = () => {
  const problems = [
    "Chưa có hệ thống số hóa cho người dân báo cáo & theo dõi thu gom",
    "Doanh nghiệp tái chế thiếu dữ liệu vận hành thời gian thực",
    "Không có cơ chế khuyến khích phân loại rác đúng cách",
    "Điều phối Collector thủ công → trễ, trùng, bỏ sót",
    "Chi phí vận hành cao vì thiếu công cụ phân tích tuyến đường"
  ];

  return (
    <section className="py-20 bg-white" id="features">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Rác thải đô thị Việt Nam đang gặp khủng hoảng nghiêm trọng
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {problems.map((prob, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-red-50 p-6 rounded-2xl border border-red-100 flex items-start gap-4"
            >
              <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
              <p className="text-gray-800 font-medium">{prob}</p>
            </motion.div>
          ))}
        </div>
        <div className="text-center">
          <div className="inline-block bg-primary-pale text-primary-mid font-bold px-8 py-4 rounded-full text-lg">
            EcoCollect giải quyết tất cả — trong một nền tảng
          </div>
        </div>
      </div>
    </section>
  );
};

const Actors = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Một Nền Tảng — Bốn Vai Trò — Cùng Một Mục Tiêu
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-hover transition-all border-t-4 border-primary">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-primary-pale p-4 rounded-xl">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">CITIZEN — Người Dân</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Chụp ảnh rác, chọn loại, đặt địa chỉ — hệ thống tự tìm Enterprise phục vụ khu vực của bạn. Nhận điểm thưởng đổi tiền mặt.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Tạo báo cáo</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Theo dõi 7 trạng thái</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Bảng xếp hạng</span>
            </div>
            <button onClick={() => navigate('/register')} className="text-primary font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Đăng ký làm Citizen <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-hover transition-all border-t-4 border-enterprise">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-enterprise-lt/30 p-4 rounded-xl">
                <Building2 className="w-8 h-8 text-enterprise" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">ENTERPRISE — Doanh Nghiệp</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Đăng ký khu vực phục vụ, loại rác tiếp nhận và công suất xử lý. Nhận báo cáo tự động, gán Collector, theo dõi vận hành thời gian thực.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Tiếp nhận yêu cầu</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Gán Collector</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Dashboard vận hành</span>
            </div>
            <button onClick={() => navigate('/register')} className="text-enterprise font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Đăng ký Enterprise <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-hover transition-all border-t-4 border-collector">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-collector-lt p-4 rounded-xl">
                <Truck className="w-8 h-8 text-collector" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">COLLECTOR — Thu Gom</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Nhận nhiệm vụ từ Enterprise của bạn, cập nhật trạng thái trên đường, xác nhận hoàn tất bằng ảnh và khối lượng thực tế.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Xem nhiệm vụ</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Cập nhật 4 trạng thái</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Upload ảnh xác nhận</span>
            </div>
            <button className="text-gray-400 font-bold flex items-center gap-2 cursor-not-allowed">
              Được tạo bởi Enterprise
            </button>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-card hover:shadow-hover transition-all border-t-4 border-purple-600">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-purple-100 p-4 rounded-xl">
                <ShieldCheck className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-display font-bold text-gray-900">ADMINISTRATOR — Quản Trị</h3>
            </div>
            <p className="text-gray-600 mb-6">
              Giám sát toàn hệ thống, duyệt Enterprise, quản lý quy tắc điểm thưởng và xử lý khiếu nại từ người dân.
            </p>
            <div className="flex flex-wrap gap-2 mb-8">
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Duyệt Enterprise</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Quản lý quy tắc điểm</span>
              <span className="bg-gray-100 text-gray-700 text-sm px-3 py-1 rounded-full">Xử lý tranh chấp</span>
            </div>
            <button className="text-gray-400 font-bold flex items-center gap-2 cursor-not-allowed">
              Hệ thống nội bộ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

const Workflow = () => {
  const steps = [
    { actor: "CITIZEN", action: "Tạo báo cáo: ảnh + loại rác + địa chỉ", status: "PENDING", color: "bg-status-pending" },
    { actor: "HỆ THỐNG", action: "Thông báo tự động đến Enterprise khu vực", status: "", color: "bg-gray-400" },
    { actor: "ENTERPRISE", action: "Xem & tiếp nhận yêu cầu", status: "ACCEPTED", color: "bg-status-accepted" },
    { actor: "ENTERPRISE", action: "Gán Collector phù hợp", status: "ASSIGNED", color: "bg-status-assigned" },
    { actor: "COLLECTOR", action: "Bắt đầu di chuyển đến địa điểm", status: "ON_THE_WAY", color: "bg-status-on-way" },
    { actor: "COLLECTOR", action: "Hoàn tất thu gom + upload ảnh xác nhận", status: "COLLECTED", color: "bg-status-collected" },
    { actor: "CITIZEN", action: "Nhận thông báo + xác nhận đã được thu gom", status: "CONFIRMED", color: "bg-status-confirmed" },
    { actor: "HỆ THỐNG", action: "Áp dụng quy tắc điểm, cộng điểm cho Citizen", status: "", color: "bg-gray-400" },
    { actor: "HỆ THỐNG", action: "Cập nhật leaderboard theo phường", status: "", color: "bg-gray-400" },
  ];

  return (
    <section className="py-20 bg-white" id="workflow">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Quy Trình 9 Bước — Minh Bạch Từ Đầu Đến Cuối
          </h2>
        </div>
        <div className="relative border-l-2 border-gray-100 ml-4 md:ml-0 md:border-none">
          {steps.map((step, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="mb-8 relative pl-8 md:pl-0 md:flex items-center justify-between group"
            >
              <div className="hidden md:block absolute left-1/2 top-1/2 -translate-y-1/2 w-full h-0.5 bg-gray-100 -z-10"></div>
              
              <div className="md:w-5/12 text-left md:text-right pr-4">
                <span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full mb-2">
                  Bước {idx + 1} — {step.actor}
                </span>
                <p className="text-gray-900 font-medium">{step.action}</p>
              </div>
              
              <div className="absolute left-0 top-0 md:relative md:w-2/12 flex justify-center">
                <div className={`w-4 h-4 rounded-full ${step.color} border-4 border-white shadow-sm z-10 group-hover:scale-150 transition-transform`}></div>
              </div>
              
              <div className="md:w-5/12 pl-4 mt-2 md:mt-0">
                {step.status && (
                  <span className={`inline-block px-3 py-1 text-white text-xs font-bold rounded-full ${step.color}`}>
                    {step.status}
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-sm text-gray-500 mt-8 italic">
          * Citizen chỉ được hủy báo cáo khi còn ở trạng thái PENDING (BR-03)
        </p>
      </div>
    </section>
  );
};

const StatusFlow = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-12">
          Theo Dõi Rác Của Bạn Từng Bước Một
        </h2>
        <div className="flex flex-wrap justify-center items-center gap-4">
          <span className="bg-status-pending text-white px-4 py-2 rounded-full font-bold text-sm">PENDING</span>
          <ArrowRight className="text-gray-400" />
          <span className="bg-status-accepted text-white px-4 py-2 rounded-full font-bold text-sm">ACCEPTED</span>
          <ArrowRight className="text-gray-400" />
          <span className="bg-status-assigned text-white px-4 py-2 rounded-full font-bold text-sm">ASSIGNED</span>
          <ArrowRight className="text-gray-400" />
          <span className="bg-status-on-way text-white px-4 py-2 rounded-full font-bold text-sm">ON_THE_WAY</span>
          <ArrowRight className="text-gray-400" />
          <span className="bg-status-collected text-white px-4 py-2 rounded-full font-bold text-sm">COLLECTED</span>
          <ArrowRight className="text-gray-400" />
          <span className="bg-status-confirmed text-white px-4 py-2 rounded-full font-bold text-sm">CONFIRMED</span>
        </div>
        <div className="flex justify-center gap-8 mt-8">
          <div className="flex items-center gap-2 text-status-rejected font-bold text-sm">
            <ArrowRight className="rotate-45" /> REJECTED (Enterprise từ chối)
          </div>
          <div className="flex items-center gap-2 text-status-cancelled font-bold text-sm">
            <ArrowRight className="rotate-45" /> CANCELLED (Citizen hủy)
          </div>
        </div>
      </div>
    </section>
  );
};

const WasteTypes = () => {
  const types = [
    { icon: <Leaf className="w-8 h-8 text-green-600" />, name: "Rác Hữu Cơ", desc: "Thực phẩm thừa, vỏ rau củ", pts: "" },
    { icon: <Recycle className="w-8 h-8 text-blue-500" />, name: "Rác Tái Chế", desc: "Giấy, nhựa, kim loại, thủy tinh", pts: "+5đ phân loại đúng" },
    { icon: <BatteryWarning className="w-8 h-8 text-red-500" />, name: "Rác Nguy Hại", desc: "Pin, hóa chất, dược phẩm", pts: "+15đ ĐẶC BIỆT" },
    { icon: <Sofa className="w-8 h-8 text-amber-700" />, name: "Rác Cồng Kềnh", desc: "Đồ nội thất, thiết bị lớn", pts: "" },
    { icon: <Laptop className="w-8 h-8 text-gray-700" />, name: "Rác Điện Tử", desc: "Máy tính, điện thoại, thiết bị điện", pts: "" },
    { icon: <Box className="w-8 h-8 text-gray-400" />, name: "Loại Khác", desc: "Các loại rác không thuộc nhóm trên", pts: "" },
  ];

  return (
    <section className="py-20 bg-primary-pale/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Phân Loại Đúng — Nhận Thêm Điểm
          </h2>
          <p className="text-gray-600">💡 AI hỗ trợ gợi ý loại rác khi bạn chụp ảnh</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {types.map((type, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ y: -5 }}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-md transition-all border border-gray-100 flex flex-col items-center text-center"
            >
              <div className="bg-gray-50 p-4 rounded-full mb-4">
                {type.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{type.name}</h3>
              <p className="text-gray-600 mb-4">{type.desc}</p>
              {type.pts && (
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full mt-auto">
                  {type.pts}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const PointsSection = () => {
  return (
    <section className="py-20 bg-white" id="rewards">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-6">
              EcoPoint — Từ Hành Động Xanh Thành Phần Thưởng Thực
            </h2>
            <div className="space-y-4 mb-8">
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="font-medium text-gray-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Báo cáo hợp lệ</span>
                <span className="font-bold text-primary">+10 điểm</span>
              </div>
              <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
                <span className="font-medium text-gray-800 flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-primary" /> Phân loại rác đúng</span>
                <span className="font-bold text-primary">+5 điểm</span>
              </div>
              <div className="flex items-center justify-between bg-yellow-50 p-4 rounded-xl border border-yellow-100">
                <span className="font-medium text-yellow-800 flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> Phân loại rác nguy hại đúng</span>
                <span className="font-bold text-yellow-600">+15 điểm [CAO NHẤT]</span>
              </div>
              <div className="flex items-center justify-between bg-blue-50 p-4 rounded-xl border border-blue-100">
                <span className="font-medium text-blue-800 flex items-center gap-2"><Zap className="w-5 h-5 text-blue-500" /> Báo cáo đầu tiên trong ngày</span>
                <span className="font-bold text-blue-600">+3 điểm [BONUS]</span>
              </div>
            </div>
            <div className="bg-primary text-white p-6 rounded-2xl">
              <p className="text-lg font-medium mb-2">Quy đổi điểm thưởng:</p>
              <p className="text-3xl font-display font-bold">1,000 điểm = 50,000đ</p>
              <p className="text-primary-pale mt-2">Rút về ví MoMo hoặc ZaloPay</p>
            </div>
          </div>

          <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 relative">
            <div className="absolute -top-4 -right-4 bg-white px-4 py-2 rounded-full shadow-md border border-gray-100 text-xs font-bold text-gray-600 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              Cập nhật thời gian thực (BR-12)
            </div>
            <h3 className="text-2xl font-display font-bold text-gray-900 mb-6 flex items-center gap-2">
              <Trophy className="w-6 h-6 text-yellow-500" /> Bảng Xếp Hạng Phường
            </h3>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-yellow-400">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center font-bold text-yellow-600">1</div>
                  <div>
                    <p className="font-bold text-gray-900">Nguyễn Thị Mai</p>
                    <p className="text-xs text-gray-500">P.7, Q.Bình Thạnh</p>
                  </div>
                </div>
                <span className="font-bold text-primary">1,247 đ</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-gray-300">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">2</div>
                  <div>
                    <p className="font-bold text-gray-900">Trần Minh Khoa</p>
                    <p className="text-xs text-gray-500">P.3, Q.Tân Bình</p>
                  </div>
                </div>
                <span className="font-bold text-primary">1,098 đ</span>
              </div>
              <div className="bg-white p-4 rounded-xl shadow-sm flex items-center justify-between border-l-4 border-amber-600">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center font-bold text-amber-700">3</div>
                  <div>
                    <p className="font-bold text-gray-900">Lê Văn Thanh</p>
                    <p className="text-xs text-gray-500">P.12, Q.Gò Vấp</p>
                  </div>
                </div>
                <span className="font-bold text-primary">987 đ</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const BusinessRules = () => {
  const rules = [
    { title: "Không tranh chấp", desc: "Mỗi báo cáo chỉ do 1 Enterprise tiếp nhận (BR-01)" },
    { title: "Bảo mật dữ liệu", desc: "Enterprise chỉ thấy báo cáo trong khu vực đã đăng ký (BR-02)" },
    { title: "Công bằng tuyệt đối", desc: "Điểm chỉ cộng sau khi BẠN xác nhận đã được thu gom (BR-09)" },
    { title: "An toàn tài khoản", desc: "Điểm không bao giờ âm — số dư tối thiểu là 0 (BR-11)" },
    { title: "Đối tác tin cậy", desc: "Enterprise phải được Admin duyệt trước khi hoạt động (BR-13)" },
    { title: "Minh bạch 100%", desc: "Collector xác nhận bằng ảnh thực tế khi hoàn thành (BR-08)" },
  ];

  return (
    <section className="py-20 bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            Những Cam Kết Của EcoCollect
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rules.map((rule, idx) => (
            <div key={idx} className="bg-gray-800 p-6 rounded-2xl border border-gray-700 flex items-start gap-4">
              <ShieldCheck className="w-6 h-6 text-primary-light shrink-0 mt-1" />
              <div>
                <h4 className="font-bold text-lg mb-1">{rule.title}</h4>
                <p className="text-gray-400 text-sm">{rule.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const EnterpriseCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-enterprise-lt/10" id="enterprise">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-16 bg-enterprise text-white">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-6">
                Doanh Nghiệp Tái Chế? <br/> Mở Rộng Nguồn Nguyên Liệu
              </h2>
              <ul className="space-y-4 mb-10">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-enterprise-lt shrink-0" />
                  <span>Nhận báo cáo rác tự động từ khu vực bạn đăng ký</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-enterprise-lt shrink-0" />
                  <span>Dashboard vận hành: số lượng, khối lượng, tỷ lệ xử lý theo thời gian thực</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-enterprise-lt shrink-0" />
                  <span>Quản lý toàn bộ đội Collector trong một giao diện</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-6 h-6 text-enterprise-lt shrink-0" />
                  <span>Cấu hình năng lực theo loại rác và công suất xử lý (kg/ngày)</span>
                </li>
              </ul>
              <button onClick={() => navigate('/register')} className="bg-white text-enterprise font-bold px-8 py-4 rounded-full hover:bg-gray-100 transition-colors">
                Đăng Ký Enterprise Ngay →
              </button>
            </div>
            <div className="p-10 lg:p-16">
              <h3 className="text-2xl font-display font-bold text-gray-900 mb-8">Quy trình đăng ký</h3>
              <div className="space-y-8">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-enterprise-lt/30 text-enterprise font-bold flex items-center justify-center shrink-0">1</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Điền thông tin</h4>
                    <p className="text-gray-600 text-sm">Tên doanh nghiệp + số giấy phép kinh doanh</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-enterprise-lt/30 text-enterprise font-bold flex items-center justify-center shrink-0">2</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Khai báo năng lực</h4>
                    <p className="text-gray-600 text-sm">Loại rác tiếp nhận + khu vực phục vụ (ít nhất 1 khu vực - BR-15)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-enterprise-lt/30 text-enterprise font-bold flex items-center justify-center shrink-0">3</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Chờ phê duyệt</h4>
                    <p className="text-gray-600 text-sm">Được Admin duyệt trong 24h làm việc (BR-13)</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-enterprise-lt/30 text-enterprise font-bold flex items-center justify-center shrink-0">4</div>
                  <div>
                    <h4 className="font-bold text-gray-900">Bắt đầu hoạt động</h4>
                    <p className="text-gray-600 text-sm">Nhận và xử lý yêu cầu thu gom</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Stats = () => {
  return (
    <section className="py-20 bg-primary relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#fff 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div>
            <div className="text-5xl md:text-6xl font-stats font-bold text-white mb-2">1,247</div>
            <div className="text-primary-pale font-medium">Tấn rác đã xử lý</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-stats font-bold text-white mb-2">48,392</div>
            <div className="text-primary-pale font-medium">Hộ gia đình</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-stats font-bold text-white mb-2">850+</div>
            <div className="text-primary-pale font-medium">Đội thu gom</div>
          </div>
          <div>
            <div className="text-5xl md:text-6xl font-stats font-bold text-white mb-2">6</div>
            <div className="text-primary-pale font-medium">Loại rác phân loại</div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Testimonials = () => {
  const reviews = [
    {
      role: "Citizen",
      name: "Chị Nguyễn Thị Hương",
      desc: "35 tuổi, P.7 Q.Bình Thạnh, TP.HCM",
      text: "Trước tôi không biết bỏ pin cũ đi đâu. Giờ tôi chụp ảnh, chọn 'Rác Nguy Hại', 2 tiếng sau có người đến lấy. Tháng này tôi được 15 điểm chỉ từ pin cũ!"
    },
    {
      role: "Enterprise",
      name: "Anh Phan Đức Minh",
      desc: "GĐ Công ty Tái Chế Xanh Việt, Hà Nội",
      text: "Dashboard vận hành giúp chúng tôi biết lúc nào cần tăng Collector. Tỷ lệ xử lý tăng 60% so với trước khi dùng EcoCollect."
    },
    {
      role: "Collector",
      name: "Anh Trần Văn Đức",
      desc: "Đội thu gom, Đà Nẵng",
      text: "App chỉ tôi đường đi rõ ràng, xác nhận bằng ảnh rất đơn giản. Không còn bị tranh chấp nhiệm vụ với đồng nghiệp nữa."
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Phản Hồi Thực Tế
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, idx) => (
            <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex text-yellow-400 mb-4">
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
                <Star className="w-5 h-5 fill-current" />
              </div>
              <p className="text-gray-700 italic mb-6">"{review.text}"</p>
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary mb-1 block">[{review.role}]</span>
                <h4 className="font-bold text-gray-900">{review.name}</h4>
                <p className="text-sm text-gray-500">{review.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const RegisterCTA = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
            Bắt Đầu Hành Trình Xanh Hôm Nay
          </h2>
          <p className="text-gray-600 flex items-center justify-center gap-2">
            <ShieldCheck className="w-5 h-5 text-green-500" /> Dữ liệu mã hóa bcrypt · HTTPS · Tuân thủ PDPA
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div className="bg-primary-pale/30 p-8 rounded-3xl border border-primary-pale">
            <h3 className="text-2xl font-display font-bold text-primary mb-6">Đăng Ký Cá Nhân</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Họ tên" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
                <input type="tel" placeholder="Số điện thoại" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              </div>
              <input type="email" placeholder="Email" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary" />
              <button onClick={() => navigate('/register')} type="button" className="w-full bg-primary-mid text-white font-bold py-4 rounded-xl hover:bg-primary transition-colors flex items-center justify-center gap-2 mt-4">
                <Leaf className="w-5 h-5" /> Đăng Ký Nhận Tài Khoản
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">Miễn phí · Không phí ẩn · Cài xong dùng ngay</p>
            </form>
          </div>

          <div className="bg-enterprise-lt/10 p-8 rounded-3xl border border-enterprise-lt/30">
            <h3 className="text-2xl font-display font-bold text-enterprise mb-6">Đăng Ký Doanh Nghiệp</h3>
            <form className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Tên doanh nghiệp" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-enterprise focus:ring-1 focus:ring-enterprise" />
                <input type="text" placeholder="Số giấy phép" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-enterprise focus:ring-1 focus:ring-enterprise" />
              </div>
              <input type="email" placeholder="Email liên hệ" className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:border-enterprise focus:ring-1 focus:ring-enterprise" />
              <button onClick={() => navigate('/register')} type="button" className="w-full bg-enterprise text-white font-bold py-4 rounded-xl hover:bg-enterprise/90 transition-colors flex items-center justify-center gap-2 mt-4">
                <Building2 className="w-5 h-5" /> Gửi Đơn Đăng Ký Enterprise
              </button>
              <p className="text-center text-sm text-gray-500 mt-4">Được Admin duyệt trong 24h làm việc (theo BR-13)</p>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 py-16 border-t border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="bg-primary p-2 rounded-lg">
                <Recycle className="text-white w-6 h-6" />
              </div>
              <span className="font-display font-bold text-xl text-white">EcoCollect</span>
            </div>
            <p className="text-gray-400 mb-6">
              Phân loại đúng – Thu gom đúng giờ – Nhận thưởng xứng đáng.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Facebook className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Youtube className="w-6 h-6" /></a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors"><Instagram className="w-6 h-6" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Người dân</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary-light transition-colors">Tạo báo cáo</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Điểm thưởng</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Leaderboard</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Gửi khiếu nại</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Doanh nghiệp</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary-light transition-colors">Đăng ký Enterprise</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Quản lý Collector</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Báo cáo vận hành</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-white mb-6 uppercase tracking-wider text-sm">Hệ thống</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-primary-light transition-colors">Về chúng tôi</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Chính sách bảo mật</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Điều khoản</a></li>
              <li><a href="#" className="hover:text-primary-light transition-colors">Liên hệ Admin</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2025 EcoCollect · Hotline: 1800-ECO-VN · support@ecocollect.vn</p>
          <p>Tuân thủ Luật Bảo vệ Môi trường 2020 · Được cấp phép bởi Bộ TN&MT</p>
        </div>
      </div>
    </footer>
  );
};

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 font-body">
      <Navbar />
      <Hero />
      <Problems />
      <Actors />
      <Workflow />
      <StatusFlow />
      <WasteTypes />
      <PointsSection />
      <BusinessRules />
      <EnterpriseCTA />
      <Stats />
      <Testimonials />
      <RegisterCTA />
      <Footer />
    </div>
  );
}

export default LandingPage;
