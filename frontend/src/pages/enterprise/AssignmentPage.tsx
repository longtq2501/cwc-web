import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { 
  Truck, User, Clock, CheckCircle, 
  ChevronDown, Search, Check, X,
  MapPin, Box
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Assignment {
  id: number;
  request_id: number;
  status: string;
  request?: {
    id: number;
    waste_type?: { name: string };
    address_detail?: string;
    estimated_weight_kg?: number;
  };
  collector?: {
    id: number;
    user?: {
      fullName: string;
    };
    vehicle_info?: string;
  };
}

interface Collector {
  id: number;
  vehicle_info?: string;
  user?: {
    fullName: string;
  };
}

const SearchableCollectorSelector = ({ collectors, onSelect, isLoading }: any) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  
  const filteredCollectors = collectors.filter((c: any) => 
    (c.user?.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (c.vehicle_info || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative w-full md:w-64">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 border-2 border-transparent hover:border-primary/20 rounded-2xl transition-all group"
      >
        <span className="text-sm font-bold text-gray-500 group-hover:text-primary">Chọn Collector...</span>
        <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-black/5"
            onClick={() => setIsOpen(false)}
          />
        )}
        {isOpen && (
          <motion.div
            key="dropdown"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden"
          >
            <div className="p-2 border-b border-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  autoFocus
                  type="text"
                  placeholder="Tìm kiếm tài xế..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-50 border-none rounded-xl text-sm focus:ring-1 focus:ring-primary/20 outline-none"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="max-h-60 overflow-y-auto p-2 space-y-1">
              {filteredCollectors.length > 0 ? (
                filteredCollectors.map((c: any) => (
                  <button
                    key={c.id}
                    onClick={() => {
                      onSelect(c.id);
                      setIsOpen(false);
                    }}
                    className="w-full flex flex-col items-start px-3 py-2 rounded-xl hover:bg-primary-pale transition-colors text-left group"
                  >
                    <span className="text-sm font-bold text-gray-900 group-hover:text-primary">{c.user?.fullName}</span>
                    <span className="text-[10px] text-gray-400">{c.vehicle_info || 'Không có thông tin xe'}</span>
                  </button>
                ))
              ) : (
                <div className="py-8 text-center text-gray-400 text-xs">Không tìm thấy Collector</div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const AssignmentPage: React.FC = () => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAssigning, setIsAssigning] = useState<number | null>(null);

  const fetchData = async () => {
    try {
      const [assignRes, collectorRes] = await Promise.all([
        fetch('/api/enterprise/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/enterprise/collectors', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      if (!assignRes.ok || !collectorRes.ok) {
        throw new Error('API request failed');
      }

      const assignData = await assignRes.json();
      const collectorData = await collectorRes.json();

      setAssignments(Array.isArray(assignData.data) ? assignData.data : (Array.isArray(assignData) ? assignData : []));
      setCollectors(Array.isArray(collectorData.data) ? collectorData.data : (Array.isArray(collectorData) ? collectorData : []));
    } catch (e) {
      toast.error('Không thể tải dữ liệu điều phối');
      setAssignments([]);
      setCollectors([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssign = async (requestId: number, collectorId: number) => {
    setIsAssigning(requestId);
    try {
      const res = await fetch(`/api/enterprise/requests/${requestId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collector_id: collectorId }),
      });

      if (!res.ok) throw new Error('Failed to assign');
      toast.success('Đã gán nhiệm vụ thành công');
      fetchData();
    } catch (e) {
      toast.error('Thao tác thất bại');
    } finally {
      setIsAssigning(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'assigned': return 'bg-amber-50 text-amber-600 border-amber-100';
      case 'on_the_way': return 'bg-purple-50 text-purple-600 border-purple-100';
      case 'collected': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
      default: return 'bg-gray-50 text-gray-600 border-gray-100';
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 gap-4">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Truck className="w-10 h-10 text-primary" />
      </motion.div>
      <p className="text-gray-500 font-medium">Đang chuẩn bị dữ liệu điều phối...</p>
    </div>
  );

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Điều phối & Theo dõi 🚛</h1>
        <p className="text-gray-500">Gán nhiệm vụ và theo dõi tiến độ thu gom của Collector trong thời gian thực.</p>
      </div>

      <div className="grid gap-6">
        <AnimatePresence mode="popLayout">
          {assignments.map((assignment) => (
            <motion.div
              key={assignment.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
            >
              <Card className="hover:shadow-hover transition-all duration-300 border-gray-100">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-primary-pale rounded-2xl flex items-center justify-center shrink-0 shadow-sm">
                      <Box className="text-primary w-7 h-7" />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <span className="font-display font-bold text-lg text-gray-900">Yêu cầu #{assignment.request_id}</span>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(assignment.status)}`}>
                          {assignment.status}
                        </span>
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-sm text-gray-500">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Truck className="w-4 h-4 text-primary" />
                          {assignment.request?.waste_type?.name || 'Chưa phân loại'}
                        </span>
                        <span className="hidden sm:inline text-gray-200">|</span>
                        <span className="flex items-center gap-1.5 italic">
                          <MapPin className="w-4 h-4 text-gray-400" />
                          {assignment.request?.address_detail}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 lg:border-l border-gray-100 lg:pl-8 py-2">
                    {assignment.collector ? (
                      <div className="flex items-center gap-4 bg-gray-50/50 p-3 rounded-2xl border border-gray-100 min-w-64">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                          <User className="text-primary w-6 h-6" />
                        </div>
                        <div>
                          <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">Đang phụ trách</p>
                          <p className="text-sm font-bold text-gray-900">{assignment.collector.user?.fullName}</p>
                          <p className="text-[10px] text-gray-500">{assignment.collector.vehicle_info || 'Không có thông tin xe'}</p>
                        </div>
                        <div className="ml-auto w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                          <Check className="text-white w-4 h-4" />
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
                        {isAssigning === assignment.request_id ? (
                          <div className="flex items-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl text-sm font-medium text-gray-500">
                            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
                              <Clock className="w-4 h-4" />
                            </motion.div>
                            Đang gán...
                          </div>
                        ) : (
                          <SearchableCollectorSelector 
                            collectors={collectors} 
                            onSelect={(cid: number) => handleAssign(assignment.request_id, cid)} 
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {assignments.length === 0 && !loading && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="text-center py-20 bg-gray-50/50 border-dashed border-2 border-gray-200">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
                <CheckCircle className="w-10 h-10 text-gray-200" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mọi thứ đã sẵn sàng!</h3>
              <p className="text-gray-500 max-w-md mx-auto">Chưa có yêu cầu nào mới cần điều phối. Các yêu cầu sau khi được bạn tiếp nhận sẽ xuất hiện tại đây.</p>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
