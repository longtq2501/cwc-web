import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import { Users, ShieldCheck, FileText, AlertCircle, TrendingUp, Activity } from 'lucide-react';
import { toast } from 'react-hot-toast';

const AdminDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/overview', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setStats(data);
      } catch (e) {
        toast.error('Không thể tải thống kê hệ thống');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, [token]);

  if (loading) return <div className="flex justify-center p-12 text-primary">Đang tải dữ liệu hệ thống...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Quản trị hệ thống 🛡️</h1>
        <p className="text-gray-500">Giám sát hoạt động và quản lý các thực thể trong mạng lưới EcoCollect.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Tổng Citizen" value={stats?.citizens_count || 0} trend="+12" color="bg-primary" />
        <StatCard icon={ShieldCheck} label="Doanh nghiệp" value={stats?.enterprises_count || 0} color="bg-blue-500" />
        <StatCard icon={FileText} label="Tổng yêu cầu" value={stats?.requests_count || 0} trend="+150" color="bg-green-500" />
        <StatCard icon={AlertCircle} label="Khiếu nại mở" value={stats?.complaints_count || 0} color="bg-red-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Hoạt động hệ thống
            </h3>
            <span className="text-xs font-bold text-green-500 bg-green-50 px-2 py-1 rounded-lg flex items-center gap-1">
              Live
            </span>
          </div>
          <div className="h-64 flex items-center justify-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
            <p className="text-gray-400 text-sm">Biểu đồ hoạt động đang được cập nhật...</p>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Trạng thái Enterprise</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Đã duyệt</span>
              <span className="font-bold">{stats?.enterprises_approved || 0}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full" style={{ width: '85%' }}></div>
            </div>
            
            <div className="flex items-center justify-between mt-6">
              <span className="text-sm text-gray-600">Chờ duyệt</span>
              <span className="font-bold text-orange-500">{stats?.enterprises_pending || 0}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div className="bg-orange-500 h-full" style={{ width: '15%' }}></div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboardPage;
