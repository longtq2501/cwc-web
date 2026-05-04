import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { toast } from 'react-hot-toast';
import { CheckCircle, Calendar, Layers, MapPin } from 'lucide-react';

interface Task {
  id: number;
  status: string;
  collected_at: string;
  actual_weight_kg: number;
  request?: {
    waste_type: string;
    location: string;
  };
}

const CollectorHistoryPage: React.FC = () => {
  const { token } = useAuth();
  const [history, setHistory] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch('/api/collector/tasks', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        const allTasks = data.data ?? data;
        // Filter only collected tasks
        setHistory(allTasks.filter((t: Task) => t.status === 'collected'));
      } catch (e) {
        toast.error('Không thể tải lịch sử');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [token]);

  if (loading) return <div className="flex justify-center p-12">Đang tải lịch sử...</div>;

  const totalWeight = history.reduce((sum, t) => sum + (Number(t.actual_weight_kg) || 0), 0);

  return (
    <div className="max-w-md mx-auto space-y-6 pb-20">
      <div className="px-4">
        <h1 className="text-2xl font-display font-bold text-gray-900">Lịch sử công việc 📋</h1>
        <p className="text-gray-500 text-sm">Xem lại các yêu cầu bạn đã hoàn thành.</p>
      </div>

      <div className="grid grid-cols-2 gap-4 px-4">
        <StatCard 
          icon={CheckCircle} 
          label="Đã hoàn thành" 
          value={history.length} 
          color="bg-green-500" 
        />
        <StatCard 
          icon={Layers} 
          label="Tổng khối lượng" 
          value={`${totalWeight.toFixed(1)} kg`} 
          color="bg-primary" 
        />
      </div>

      <div className="space-y-4 px-2">
        {history.map((task) => (
          <Card key={task.id} className="p-4">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{task.request?.waste_type}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(task.collected_at).toLocaleDateString('vi-VN')}
                </div>
              </div>
              <span className="text-sm font-bold text-primary">+{task.actual_weight_kg}kg</span>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 p-2 rounded-lg">
              <MapPin className="w-4 h-4 text-primary shrink-0" />
              <span className="line-clamp-1">{task.request?.location}</span>
            </div>
          </Card>
        ))}
        {history.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Bạn chưa hoàn thành nhiệm vụ nào.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollectorHistoryPage;
