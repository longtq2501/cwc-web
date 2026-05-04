import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Truck, MapPin, CheckCircle, Navigation, 
  Camera, FileText, Clock, X, Loader2 
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import toast from 'react-hot-toast';

const CollectorTasksPage = () => {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [completeData, setCompleteData] = useState({
    actualWeight: '',
    note: '',
    proofImage: null as string | null,
    proofFile: null as File | null
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/collector/tasks', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setReports(data.data || []);
      }
    } catch (e) {
      toast.error('Không thể tải danh sách nhiệm vụ');
    } finally {
      setLoading(false);
    }
  };

  const setReports = (data: any) => {
    setTasks(data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStartTask = async (id: number) => {
    try {
      const res = await fetch(`/api/collector/tasks/${id}/start`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Đang di chuyển tới điểm thu gom!');
        fetchTasks();
      }
    } catch (e) {
      toast.error('Lỗi khi bắt đầu nhiệm vụ');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCompleteData({
        ...completeData,
        proofFile: file,
        proofImage: URL.createObjectURL(file)
      });
    }
  };

  const handleCompleteTask = async () => {
    if (!completeData.proofFile) {
      toast.error('Vui lòng chụp ảnh bằng chứng thu gom');
      return;
    }

    setIsSubmitting(true);
    try {
      // 1. Upload proof image
      const formData = new FormData();
      formData.append('image', completeData.proofFile);
      
      const uploadRes = await fetch('/api/citizen/analyze-image', { // Reuse the image uploader
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!uploadRes.ok) throw new Error('Upload ảnh thất bại');
      const uploadData = await uploadRes.json();
      const proofUrl = uploadData.data.image_url;

      // 2. Mark as collected
      const res = await fetch(`/api/collector/tasks/${selectedTask.id}/collect`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          actual_weight_kg: parseFloat(completeData.actualWeight) || 0,
          proof_image_url: proofUrl,
          collector_note: completeData.note
        })
      });

      if (res.ok) {
        toast.success('Nhiệm vụ hoàn thành!');
        setShowCompleteModal(false);
        setSelectedTask(null);
        setCompleteData({ actualWeight: '', note: '', proofImage: null, proofFile: null });
        fetchTasks();
      }
    } catch (e) {
      toast.error('Lỗi khi hoàn thành nhiệm vụ');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="flex items-center justify-between px-2">
        <h1 className="text-2xl font-display font-bold text-gray-900">Nhiệm vụ của tôi</h1>
        <div className="bg-primary-pale text-primary px-3 py-1 rounded-full text-xs font-bold">
          {tasks.length} Đang chờ
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Đang tìm nhiệm vụ...</p>
        </div>
      ) : tasks.length > 0 ? (
        <div className="space-y-4">
          {tasks.map((task: any) => (
            <Card key={task.id} className="border-gray-100 hover:border-primary transition-all">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center">
                      <Clock className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 capitalize">{task.request?.waste_type?.name || 'Rác'}</h4>
                      <p className="text-[10px] text-gray-400">#{task.request?.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                    task.status === 'on_the_way' ? 'bg-purple-100 text-purple-600' : 'bg-blue-100 text-blue-600'
                  }`}>
                    {task.status === 'on_the_way' ? 'Đang di chuyển' : 'Mới gán'}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span className="font-medium">{task.request?.address_detail}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span>{task.request?.estimated_weight_kg || 0} kg ước tính</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  {task.status === 'accepted' || task.status === 'assigned' ? (
                    <Button fullWidth onClick={() => handleStartTask(task.id)} leftIcon={<Navigation className="w-4 h-4" />}>
                      Bắt đầu đi
                    </Button>
                  ) : (
                    <Button fullWidth className="bg-green-500 hover:bg-green-600" onClick={() => { setSelectedTask(task); setShowCompleteModal(true); }} leftIcon={<CheckCircle className="w-4 h-4" />}>
                      Đã thu gom
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Truck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Tuyệt vời! Không còn nhiệm vụ nào.</p>
        </div>
      )}

      {/* Complete Task Modal */}
      <AnimatePresence>
        {showCompleteModal && (
          <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm">
            <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} transition={{ type: 'spring', damping: 25 }} className="bg-white w-full max-w-lg rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 pb-10">
              <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl font-bold text-gray-900">Xác nhận thu gom</h3>
                <button onClick={() => setShowCompleteModal(false)} className="p-2 bg-gray-50 rounded-full"><X className="w-5 h-5" /></button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-4">Chụp ảnh bằng chứng *</label>
                  <div className="relative aspect-video rounded-3xl bg-gray-50 border-2 border-dashed border-gray-200 overflow-hidden group">
                    {completeData.proofImage ? (
                      <img src={completeData.proofImage} alt="Proof" className="w-full h-full object-cover" />
                    ) : (
                      <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer">
                        <Camera className="w-10 h-10 text-gray-300 mb-2 group-hover:text-primary transition-colors" />
                        <span className="text-xs text-gray-400">Click để chụp/tải ảnh</span>
                        <input type="file" capture="environment" className="hidden" onChange={handleImageChange} />
                      </label>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Khối lượng thực tế (kg)</label>
                    <input
                      type="number"
                      className="w-full px-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 rounded-2xl outline-none text-sm font-bold"
                      placeholder="0.0"
                      value={completeData.actualWeight}
                      onChange={(e) => setCompleteData({ ...completeData, actualWeight: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Ghi chú</label>
                    <input
                      type="text"
                      className="w-full px-4 py-4 bg-gray-50 border-transparent focus:bg-white focus:border-primary border-2 rounded-2xl outline-none text-sm"
                      placeholder="Ghi chú thêm..."
                      value={completeData.note}
                      onChange={(e) => setCompleteData({ ...completeData, note: e.target.value })}
                    />
                  </div>
                </div>

                <Button fullWidth size="lg" isLoading={isSubmitting} onClick={handleCompleteTask}>
                  Hoàn tất thu gom
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollectorTasksPage;
