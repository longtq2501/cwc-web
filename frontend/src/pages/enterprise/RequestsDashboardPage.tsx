import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Search, Filter, Clock, MapPin, 
  Trash2, CheckCircle2, ChevronRight, 
  AlertCircle, ArrowUpRight, Loader2, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const RequestsDashboardPage = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enterprise/requests/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRequests(data.data || []);
      }
    } catch (e) {
      toast.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAccept = async (id: number) => {
    try {
      const res = await fetch(`/api/enterprise/requests/${id}/accept`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Đã tiếp nhận yêu cầu thành công!');
        fetchRequests();
      }
    } catch (e) {
      toast.error('Lỗi khi tiếp nhận yêu cầu');
    }
  };

  const handleReject = async () => {
    if (!rejectReason) return;
    try {
      const res = await fetch(`/api/enterprise/requests/${selectedRequest.id}/reject`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: rejectReason })
      });
      if (res.ok) {
        toast.success('Đã từ chối yêu cầu');
        setShowRejectModal(false);
        setRejectReason('');
        fetchRequests();
      }
    } catch (e) {
      toast.error('Lỗi khi từ chối yêu cầu');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900">Quản lý yêu cầu</h1>
          <p className="text-gray-500">Các yêu cầu thu gom mới trong khu vực của bạn.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="bg-white rounded-3xl p-20 flex flex-col items-center justify-center border border-gray-100">
              <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
              <p className="text-gray-500">Đang tìm kiếm yêu cầu mới...</p>
            </div>
          ) : requests.length > 0 ? (
            requests.map((req: any) => (
              <motion.div
                key={req.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`bg-white rounded-3xl border p-6 transition-all hover:shadow-md cursor-pointer ${
                  selectedRequest?.id === req.id ? 'border-primary shadow-sm' : 'border-gray-100'
                }`}
                onClick={() => setSelectedRequest(req)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                      {req.images?.[0] ? (
                        <img src={req.images[0].image_url} alt="" className="w-full h-full object-cover rounded-2xl" />
                      ) : (
                        <AlertCircle className="w-6 h-6 text-gray-300" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold text-gray-900">{req.waste_type?.name}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          req.priority_label === 'High' ? 'bg-red-100 text-red-600' : 
                          req.priority_label === 'Medium' ? 'bg-amber-100 text-amber-600' : 
                          'bg-emerald-100 text-emerald-600'
                        }`}>
                          {req.priority_label} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {req.address_detail}
                      </p>
                    </div>
                  </div>
                  <ChevronRight className={`w-5 h-5 transition-all ${selectedRequest?.id === req.id ? 'text-primary translate-x-1' : 'text-gray-300'}`} />
                </div>
              </motion.div>
            ))
          ) : (
            <div className="bg-white rounded-3xl p-20 text-center border border-dashed border-gray-200">
              <p className="text-gray-500">Hiện không có yêu cầu nào mới.</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <AnimatePresence mode="wait">
            {selectedRequest ? (
              <motion.div
                key={selectedRequest.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card className="sticky top-6">
                  <div className="space-y-6">
                    <div className="h-48 rounded-2xl overflow-hidden bg-gray-100">
                      {selectedRequest.images?.[0] ? (
                        <img src={selectedRequest.images[0].image_url} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">Không có ảnh</div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Chi tiết yêu cầu</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{selectedRequest.description || 'Không có mô tả chi tiết.'}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Khối lượng</p>
                        <p className="font-bold text-gray-900">{selectedRequest.estimated_weight_kg || 0} kg</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-2xl">
                        <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Thời gian</p>
                        <p className="font-bold text-gray-900">{new Date(selectedRequest.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>

                    <div className="space-y-3 pt-4">
                      <Button fullWidth onClick={() => handleAccept(selectedRequest.id)} leftIcon={<CheckCircle2 className="w-5 h-5" />}>
                        Tiếp nhận thu gom
                      </Button>
                      <Button fullWidth variant="outline" onClick={() => setShowRejectModal(true)} className="text-red-500 border-red-100 hover:bg-red-50">
                        Từ chối yêu cầu
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-3xl p-12 text-center text-gray-400">
                <ArrowUpRight className="w-10 h-10 mx-auto mb-4 opacity-20" />
                <p className="text-sm font-medium">Chọn một yêu cầu để xem chi tiết và xử lý.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Reject Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl w-full max-w-md p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Lý do từ chối</h3>
              <button onClick={() => setShowRejectModal(false)} className="text-gray-400"><X /></button>
            </div>
            <textarea
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 mb-6"
              rows={4}
              placeholder="Vui lòng nhập lý do (ví dụ: Ngoài khu vực phục vụ, rác không đúng quy định...)"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
            <div className="flex gap-4">
              <Button variant="outline" fullWidth onClick={() => setShowRejectModal(false)}>Hủy</Button>
              <Button fullWidth className="bg-red-500 hover:bg-red-600" disabled={!rejectReason} onClick={handleReject}>Từ chối</Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default RequestsDashboardPage;
