import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Search, Filter, Clock, CheckCircle2, 
  Truck, MessageSquareWarning, ArrowRight, 
  MapPin, Calendar, MoreVertical, X, Send,
  AlertCircle, Image as ImageIcon, Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const STATUS_COLORS: any = {
  'pending': 'bg-amber-500 text-white',
  'accepted': 'bg-blue-500 text-white',
  'assigned': 'bg-indigo-500 text-white',
  'on_the_way': 'bg-purple-500 text-white',
  'collected': 'bg-green-500 text-white',
  'confirmed': 'bg-emerald-600 text-white',
  'rejected': 'bg-red-500 text-white',
  'cancelled': 'bg-gray-400 text-white',
};

const ReportCard = ({ report, onConfirm, onComplaint }: any) => {
  const primaryImage = report.images?.find((img: any) => img.is_primary)?.image_url || report.images?.[0]?.image_url;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-all group">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary-pale flex items-center justify-center text-primary shrink-0">
              {primaryImage ? (
                <img 
                  src={primaryImage} 
                  alt="" 
                  className="w-full h-full object-cover rounded-2xl" 
                  onError={(e) => {
                    (e.currentTarget.src = 'https://placehold.co/400x400?text=No+Image');
                  }}
                />
              ) : (
                <ImageIcon className="w-6 h-6" />
              )}
            </div>
            <div>
              <h4 className="font-bold text-gray-900 capitalize">{report.waste_type?.name || 'Rác'}</h4>
              <p className="text-[10px] text-gray-400 font-mono">#{report.id}</p>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_COLORS[report.status]}`}>
            {report.status}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4 text-gray-400" />
            <span className="truncate">{report.address_detail}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span>{new Date(report.created_at).toLocaleString('vi-VN')}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-50">
          <div className="flex items-center gap-1">
            <span className="text-sm font-bold text-gray-900">{report.actual_weight_kg || report.estimated_weight_kg || 0} kg</span>
            {report.points_awarded > 0 && (
              <span className="text-xs font-bold text-primary ml-2">+{report.points_awarded} pts</span>
            )}
          </div>
          <div className="flex gap-2">
            {report.status === 'collected' && (
              <button 
                onClick={() => onConfirm(report)}
                className="bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all shadow-sm"
              >
                Xác nhận
              </button>
            )}
            <button 
              onClick={() => onComplaint(report)}
              className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
              title="Gửi khiếu nại"
            >
              <MessageSquareWarning className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReportHistoryPage = () => {
  const { token } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('ALL');
  const [complaintReport, setComplaintReport] = useState<any>(null);
  
  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/citizen/requests', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data.data || data); // Laravel pagination returns .data
      }
    } catch (e) {
      toast.error('Không thể tải lịch sử báo cáo');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleConfirm = async (report: any) => {
    try {
      const res = await fetch(`/api/citizen/requests/${report.id}/confirm`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Đã xác nhận thu gom thành công! Điểm thưởng đã được cộng.');
        fetchReports();
      }
    } catch (e) {
      toast.error('Lỗi khi xác nhận');
    }
  };

  const filteredReports = reports.filter((r: any) => 
    filter === 'ALL' ? true : r.status === filter.toLowerCase()
  );

  const [complaintContent, setComplaintContent] = useState('');
  const [isSubmittingComplaint, setIsSubmittingComplaint] = useState(false);

  const submitComplaint = async () => {
    if (!complaintContent.trim()) {
      toast.error('Vui lòng nhập nội dung');
      return;
    }
    setIsSubmittingComplaint(true);
    try {
      const res = await fetch(`/api/citizen/requests/${complaintReport.id}/complain`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          complaint_type: 'complaint',
          content: complaintContent
        })
      });

      if (res.ok) {
        toast.success('Đã gửi khiếu nại thành công');
        setComplaintReport(null);
        setComplaintContent('');
      } else {
        const data = await res.json();
        toast.error(data.message || 'Lỗi khi gửi khiếu nại');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsSubmittingComplaint(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Lịch sử báo cáo</h1>
          <p className="text-gray-500">Theo dõi trạng thái và quản lý các yêu cầu thu gom của bạn.</p>
        </div>
        <div className="flex bg-white rounded-2xl border border-gray-100 p-1 shadow-sm overflow-x-auto">
          {['ALL', 'PENDING', 'ACCEPTED', 'ASSIGNED', 'COLLECTED', 'CONFIRMED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap ${
                filter === f ? 'bg-primary text-white shadow-md' : 'text-gray-500 hover:text-primary'
              }`}
            >
              {f === 'ALL' ? 'Tất cả' : f}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500 font-medium">Đang tải dữ liệu...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredReports.map((report: any) => (
              <ReportCard 
                key={report.id} 
                report={report} 
                onConfirm={handleConfirm}
                onComplaint={setComplaintReport}
              />
            ))}
          </div>

          {filteredReports.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
              <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <p className="text-gray-500 font-medium">Không tìm thấy báo cáo nào.</p>
            </div>
          )}
        </>
      )}

      {/* Complaint Modal */}
      <AnimatePresence>
        {complaintReport && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-md p-8">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Gửi khiếu nại</h3>
                <button onClick={() => setComplaintReport(null)} className="text-gray-400 hover:text-gray-900"><X /></button>
              </div>
              <p className="text-sm text-gray-500 mb-4">Bạn đang khiếu nại về yêu cầu thu gom #{complaintReport.id}</p>
              <textarea 
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 focus:ring-primary focus:border-primary mb-6 text-sm" 
                placeholder="Nhập nội dung khiếu nại chi tiết..." 
                rows={4}
                value={complaintContent}
                onChange={(e) => setComplaintContent(e.target.value)}
              />
              <button 
                onClick={submitComplaint} 
                disabled={isSubmittingComplaint}
                className="w-full bg-red-500 text-white font-bold py-4 rounded-2xl hover:bg-red-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmittingComplaint ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Gửi khiếu nại'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ReportHistoryPage;
