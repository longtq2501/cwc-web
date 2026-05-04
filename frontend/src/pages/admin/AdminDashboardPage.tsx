import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Users, Building2, FileText, AlertTriangle, 
  TrendingUp, ArrowUpRight, ArrowDownRight,
  ShieldCheck, Loader2
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.data);
        }
      } catch (e) {
        toast.error('Không thể tải thống kê hệ thống');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
        <p className="text-gray-500">Đang tải dữ liệu hệ thống...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Hệ thống EcoCollect</h1>
        <p className="text-gray-500">Bảng điều khiển giám sát toàn bộ hoạt động của nền tảng.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          icon={Users} 
          label="Tổng yêu cầu" 
          value={stats?.total_requests || 0} 
          trend="+12%" 
          trendUp={true} 
        />
        <StatCard 
          icon={FileText} 
          label="Yêu cầu chờ" 
          value={stats?.pending_requests || 0} 
          trend="Cần xử lý" 
          color="amber"
        />
        <StatCard 
          icon={Building2} 
          label="Enterprise" 
          value={stats?.total_enterprises || 0} 
          trend="+2 mới" 
          trendUp={true} 
        />
        <StatCard 
          icon={ShieldCheck} 
          label="Chờ duyệt" 
          value={stats?.pending_enterprises || 0} 
          trend="Hồ sơ mới" 
          color="indigo"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card title="Phân bổ rác thải theo khu vực">
          <div className="h-64 flex items-center justify-center text-gray-300 italic">
            Biểu đồ đang được cập nhật...
          </div>
        </Card>
        
        <Card title="Hoạt động gần đây">
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">Báo cáo mới từ Quận 1</p>
                  <p className="text-xs text-gray-500">2 phút trước</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
