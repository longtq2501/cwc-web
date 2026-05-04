import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Search, Filter, Clock, CheckCircle2, 
  Truck, MessageSquareWarning, ArrowRight, 
  MapPin, Calendar, MoreVertical, X, Send,
  AlertCircle, Image as ImageIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const REPORTS_MOCK = [
  {
    id: 'WR-2025-001',
    type: 'Recyclable',
    status: 'COLLECTED',
    address: '123 Lê Lợi, P.Bến Thành, Q.1',
    date: '24/05/2025 08:30',
    weight: '2.5kg',
    points: 15,
    collector: 'Nguyễn Văn B',
    image: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=200'
  },
  {
    id: 'WR-2025-002',
    type: 'Hazardous',
    status: 'ASSIGNED',
    address: '45 Nguyễn Huệ, Q.1',
    date: '24/05/2025 10:15',
    weight: '0.8kg',
    points: 0,
    collector: 'Trần Minh C',
  },
  {
    id: 'WR-2025-003',
    type: 'Organic',
    status: 'PENDING',
    address: '88 Hàm Nghi, Q.1',
    date: '24/05/2025 14:00',
    weight: '1.2kg',
    points: 0,
  }
];

const STATUS_COLORS: any = {
  'PENDING': 'bg-status-pending text-white',
  'ACCEPTED': 'bg-status-accepted text-white',
  'ASSIGNED': 'bg-status-assigned text-white',
  'ON_THE_WAY': 'bg-status-on-way text-white',
  'COLLECTED': 'bg-status-collected text-white',
  'CONFIRMED': 'bg-status-confirmed text-white',
  'REJECTED': 'bg-status-rejected text-white',
  'CANCELLED': 'bg-status-cancelled text-white',
};

const ReportCard = ({ report, onComplaint }: any) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
    <div className="p-6">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-pale flex items-center justify-center text-primary shrink-0">
            {report.image ? (
              <img src={report.image} alt="" className="w-full h-full object-cover rounded-2xl" />
            ) : (
              <ImageIcon className="w-6 h-6" />
            )}
          </div>
          <div>
            <h4 className="font-bold text-gray-900">{report.type}</h4>
            <p className="text-xs text-gray-400 font-mono">{report.id}</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[report.status]}`}>
          {report.status}
        </span>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span className="truncate">{report.address}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{report.date}</span>
        </div>
        {report.collector && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Truck className="w-4 h-4 text-gray-400" />
            <span>Collector: {report.collector}</span>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
        <div className="flex items-center gap-1">
          <span className="text-sm font-bold text-gray-900">{report.weight}</span>
          {report.points > 0 && (
            <span className="text-xs font-bold text-primary ml-2">+{report.points} pts</span>
          )}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => onComplaint(report)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
            title="Gửi khiếu nại"
          >
            <MessageSquareWarning className="w-5 h-5" />
          </button>
          <button className="p-2 text-primary hover:bg-primary-pale rounded-xl transition-all">
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const ComplaintModal = ({ report, onClose }: any) => {
  const [msg, setMsg] = useState('');
  const [sent, setSent] = useState(false);

  const handleSend = () => {
    setSent(true);
    setTimeout(onClose, 2000);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
      >
        {!sent ? (
          <div className="p-8">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Gửi khiếu nại</h3>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Bạn đang gửi khiếu nại cho báo cáo <span className="font-bold text-gray-900">{report.id}</span>. 
              Hãy mô tả vấn đề bạn gặp phải (ví dụ: chưa thu gom nhưng đã báo hoàn thành).
            </p>
            <textarea
              rows={4}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-primary focus:border-primary text-sm mb-6"
              placeholder="Nhập nội dung khiếu nại..."
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
            />
            <button 
              onClick={handleSend}
              disabled={!msg}
              className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              Gửi khiếu nại <Send className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Đã gửi thành công</h3>
            <p className="text-gray-500">Admin sẽ xem xét và phản hồi cho bạn sớm nhất có thể.</p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

const ReportHistoryPage = () => {
  const [filter, setFilter] = useState('ALL');
  const [complaintReport, setComplaintReport] = useState<any>(null);
  const location = useLocation();
  const successMsg = location.state?.success;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Lịch sử báo cáo</h1>
          <p className="text-gray-500">Theo dõi trạng thái và quản lý các yêu cầu thu gom của bạn.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 shadow-sm">
          {['ALL', 'PENDING', 'COLLECTED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
              }`}
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>
      </div>

      {successMsg && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-green-50 border border-green-100 text-green-700 p-4 rounded-2xl flex items-center gap-3"
        >
          <CheckCircle2 className="w-6 h-6" />
          <p className="font-medium">Báo cáo của bạn đã được gửi thành công! Hãy chờ Enterprise tiếp nhận.</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {REPORTS_MOCK.filter(r => filter === 'ALL' || r.status === filter).map((report) => (
          <ReportCard 
            key={report.id} 
            report={report} 
            onComplaint={setComplaintReport}
          />
        ))}
      </div>

      {REPORTS_MOCK.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-300" />
          </div>
          <p className="text-gray-500 font-medium">Bạn chưa có báo cáo nào.</p>
        </div>
      )}

      <AnimatePresence>
        {complaintReport && (
          <ComplaintModal 
            report={complaintReport} 
            onClose={() => setComplaintReport(null)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportHistoryPage;
