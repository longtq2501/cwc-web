import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { 
  FileText, TrendingUp, Users, Award, 
  Clock, CheckCircle2, AlertCircle, ArrowUpRight 
} from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, trend, color }: any) => (
  <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-2xl ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      {trend && (
        <span className="flex items-center text-green-500 text-xs font-bold">
          <TrendingUp className="w-4 h-4 mr-1" /> {trend}
        </span>
      )}
    </div>
    <p className="text-gray-500 text-sm font-medium">{label}</p>
    <p className="text-2xl font-display font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

const DashboardPage = () => {
  const { user } = useAuth();

  const citizenStats = [
    { icon: FileText, label: 'Tổng báo cáo', value: '12', trend: '+2 tuần này', color: 'bg-primary' },
    { icon: Award, label: 'Điểm EcoPoint', value: '1,240', trend: '+150', color: 'bg-yellow-500' },
    { icon: CheckCircle2, label: 'Đã hoàn thành', value: '10', trend: '85%', color: 'bg-green-500' },
    { icon: Clock, label: 'Đang xử lý', value: '2', color: 'bg-blue-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Chào buổi sáng, {user?.fullName}! 👋</h1>
        <p className="text-gray-500">Đây là tóm tắt hoạt động thu gom rác của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {citizenStats.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-gray-900">Báo cáo gần đây</h3>
            <button className="text-primary text-sm font-bold flex items-center gap-1">
              Xem tất cả <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-gray-100">
                    <Recycle className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Rác tái chế - Giấy & Nhựa</p>
                    <p className="text-xs text-gray-500">24/05/2025 · 08:30 AM</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full">COLLECTED</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Thông báo</h3>
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Yêu cầu #1234 đã được gán</p>
                <p className="text-xs text-gray-500 mt-1">Collector Nguyễn Văn B đang đến.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Chúc mừng! Bạn nhận +15đ</p>
                <p className="text-xs text-gray-500 mt-1">Vì đã phân loại rác nguy hại đúng cách.</p>
              </div>
            </div>
          </div>
          <button className="w-full mt-8 py-3 rounded-xl border-2 border-gray-100 text-gray-500 font-bold text-sm hover:bg-gray-50 transition-all">
            Xem tất cả thông báo
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
import { Recycle } from 'lucide-react';
