import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import Input from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
import { Truck, MapPin, CheckCircle, Navigation, Camera, FileText, Clock } from 'lucide-react';

interface Task {
  id: number;
  status: string;
  request?: {
    id: number;
    waste_type: string;
    location: string;
    description: string;
  };
}

const CollectorTasksPage: React.FC = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCompleteModal, setShowCompleteModal] = useState<number | null>(null);
  
  // Completion form state
  const [completionData, setCompletionData] = useState({
    actual_weight_kg: '',
    proof_image_url: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=500', // Default placeholder
    collector_note: '',
  });

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/collector/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setTasks(data.data ?? data);
    } catch (e) {
      toast.error('Không thể tải danh sách nhiệm vụ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const handleStart = async (assignmentId: number) => {
    try {
      const res = await fetch(`/api/collector/tasks/${assignmentId}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success('Đã bắt đầu di chuyển!');
      fetchTasks();
    } catch (e) {
      toast.error('Thao tác thất bại');
    }
  };

  const handleComplete = async (assignmentId: number) => {
    try {
      const res = await fetch(`/api/collector/tasks/${assignmentId}/collect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(completionData),
      });
      if (!res.ok) throw new Error();
      toast.success('Nhiệm vụ hoàn thành!');
      setShowCompleteModal(null);
      fetchTasks();
    } catch (e) {
      toast.error('Lỗi khi xác nhận hoàn thành');
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'assigned': return { label: 'Chờ xử lý', color: 'bg-orange-100 text-orange-700' };
      case 'on_the_way': return { label: 'Đang di chuyển', color: 'bg-blue-100 text-blue-700' };
      case 'collected': return { label: 'Đã thu gom', color: 'bg-green-100 text-green-700' };
      default: return { label: status, color: 'bg-gray-100 text-gray-700' };
    }
  };

  if (loading) return <div className="flex justify-center p-12">Đang tải nhiệm vụ...</div>;

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="px-4">
        <h1 className="text-2xl font-display font-bold text-gray-900">Nhiệm vụ của tôi 🚛</h1>
        <p className="text-gray-500 text-sm">Chào Collector! Chúc bạn một ngày làm việc hiệu quả.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4">
        <StatCard 
          icon={Clock} 
          label="Chờ xử lý" 
          value={tasks.filter(t => t.status === 'assigned').length} 
          color="bg-orange-500" 
        />
        <StatCard 
          icon={Navigation} 
          label="Đang đi" 
          value={tasks.filter(t => t.status === 'on_the_way').length} 
          color="bg-blue-500" 
        />
      </div>

      <div className="space-y-4 px-2">
        {tasks.map((task) => (
          <Card key={task.id} className="relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-1 h-full ${task.status === 'on_the_way' ? 'bg-blue-500' : 'bg-orange-500'}`} />
            
            <div className="p-4 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase">Yêu cầu #{task.request?.id}</p>
                  <h3 className="font-bold text-gray-900">{task.request?.waste_type}</h3>
                </div>
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${getStatusLabel(task.status).color}`}>
                  {getStatusLabel(task.status).label}
                </span>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4 text-primary shrink-0" />
                  <span className="line-clamp-1">{task.request?.location}</span>
                </div>
                {task.request?.description && (
                  <div className="flex items-start gap-2 text-sm text-gray-500 bg-gray-50 p-2 rounded-lg">
                    <FileText className="w-4 h-4 mt-0.5 shrink-0" />
                    <p className="text-xs italic">"{task.request.description}"</p>
                  </div>
                )}
              </div>

              <div className="pt-2 border-t border-gray-100 flex gap-2">
                {task.status === 'assigned' && (
                  <Button 
                    fullWidth 
                    variant="primary" 
                    leftIcon={<Navigation className="w-4 h-4" />}
                    onClick={() => handleStart(task.id)}
                  >
                    Bắt đầu đi
                  </Button>
                )}
                {task.status === 'on_the_way' && (
                  <Button 
                    fullWidth 
                    variant="enterprise" 
                    leftIcon={<CheckCircle className="w-4 h-4" />}
                    onClick={() => setShowCompleteModal(task.id)}
                  >
                    Hoàn thành
                  </Button>
                )}
                <Button 
                  variant="outline" 
                  className="!px-4"
                  onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(task.request?.location || '')}`)}
                >
                  <Navigation className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {tasks.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Chưa có nhiệm vụ nào được phân công.</p>
          </Card>
        )}
      </div>

      {/* Completion Modal */}
      {showCompleteModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-[2rem] p-6 space-y-6 animate-in slide-in-from-bottom duration-300">
            <h3 className="text-xl font-bold text-gray-900">Xác nhận hoàn thành</h3>
            
            <div className="space-y-4">
              <Input 
                label="Khối lượng thực tế (kg)" 
                type="number" 
                placeholder="Ví dụ: 5.5"
                value={completionData.actual_weight_kg}
                onChange={e => setCompletionData({...completionData, actual_weight_kg: e.target.value})}
              />
              
              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Hình ảnh xác nhận</label>
                <div className="w-full aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-primary transition-all overflow-hidden relative group">
                  <img src={completionData.proof_image_url} alt="Proof" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                    <Camera className="text-white w-8 h-8" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-bold text-gray-700">Ghi chú (nếu có)</label>
                <textarea 
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm min-h-[80px]"
                  placeholder="Người dân nhiệt tình, rác đã phân loại tốt..."
                  value={completionData.collector_note}
                  onChange={e => setCompletionData({...completionData, collector_note: e.target.value})}
                />
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" fullWidth onClick={() => setShowCompleteModal(null)}>Hủy</Button>
              <Button variant="primary" fullWidth onClick={() => handleComplete(showCompleteModal)}>Xác nhận</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectorTasksPage;
