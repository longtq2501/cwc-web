import React from 'react';
import StatCard from '../../components/ui/StatCard';
import { FileText, Truck, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';

const EnterpriseDashboardPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Tổng quan Doanh nghiệp 🏢</h1>
        <p className="text-gray-500">Chào mừng trở lại. Đây là tình hình hoạt động hôm nay.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={FileText} label="Yêu cầu mới" value="8" trend="+2" color="bg-orange-500" />
        <StatCard icon={Truck} label="Collector đang chạy" value="12" color="bg-blue-500" />
        <StatCard icon={CheckCircle} label="Đã hoàn thành" value="45" trend="+5" color="bg-green-500" />
        <StatCard icon={AlertCircle} label="Khiếu nại" value="1" color="bg-red-500" />
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Yêu cầu thu gom gần đây</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div>
                  <p className="font-bold text-gray-900">Yêu cầu #{1230 + i}</p>
                  <p className="text-xs text-gray-500">24/05/2025 · Quận Liên Chiểu</p>
                </div>
                <span className="px-3 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded-full">PENDING</span>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-6">Hoạt động của Collector</h3>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-gray-50 border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-gray-100 font-bold text-primary">
                    C{i}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Nguyễn Văn {String.fromCharCode(64 + i)}</p>
                    <p className="text-xs text-gray-500">Đang thu gom tại Hòa Khánh</p>
                  </div>
                </div>
                <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">ON THE WAY</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default EnterpriseDashboardPage;
