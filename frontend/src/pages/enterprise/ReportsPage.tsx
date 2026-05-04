import React, { useState } from 'react';
import Card from '../../components/ui/Card';
import StatCard from '../../components/ui/StatCard';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area
} from 'recharts';
import { Layers, Recycle, TrendingUp, Calendar, Map } from 'lucide-react';

const volumeData = [
  { name: 'Thứ 2', volume: 400 },
  { name: 'Thứ 3', volume: 300 },
  { name: 'Thứ 4', volume: 600 },
  { name: 'Thứ 5', volume: 800 },
  { name: 'Thứ 6', volume: 500 },
  { name: 'Thứ 7', volume: 900 },
  { name: 'CN', volume: 700 },
];

const typeData = [
  { name: 'Nhựa', value: 400, color: '#10b981' },
  { name: 'Giấy', value: 300, color: '#3b82f6' },
  { name: 'Kim loại', value: 100, color: '#f59e0b' },
  { name: 'Khác', value: 200, color: '#6b7280' },
];

const regionData = [
  { name: 'Liên Chiểu', value: 1200 },
  { name: 'Thanh Khê', value: 800 },
  { name: 'Hải Châu', value: 1500 },
  { name: 'Cẩm Lệ', value: 400 },
  { name: 'Sơn Trà', value: 300 },
];

const ReportsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState('weekly');

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-gray-900">Báo cáo & Thống kê 📊</h1>
          <p className="text-gray-500">Phân tích khối lượng rác và hiệu suất thu gom theo khu vực.</p>
        </div>
        
        <div className="flex bg-white p-1 rounded-2xl border border-gray-100 shadow-sm">
          {['weekly', 'monthly', 'yearly'].map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                timeRange === range 
                  ? 'bg-primary text-white shadow-md' 
                  : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              {range === 'weekly' ? 'Tuần' : range === 'monthly' ? 'Tháng' : 'Năm'}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Layers} label="Tổng khối lượng" value="4.2 Tấn" trend="+12%" color="bg-primary" />
        <StatCard icon={Recycle} label="Đã tái chế" value="3.8 Tấn" trend="+5%" color="bg-green-500" />
        <StatCard icon={TrendingUp} label="Hiệu suất" value="92%" color="bg-blue-500" />
        <StatCard icon={Calendar} label="Yêu cầu/ngày" value="24" color="bg-purple-500" />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <Card className="lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 mb-8">Xu hướng thu gom (kg)</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Area type="monotone" dataKey="volume" stroke="#10b981" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-bold text-gray-900 mb-8">Phân loại rác</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={typeData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-3 mt-6">
            {typeData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                  <span className="text-sm font-medium text-gray-600">{item.name}</span>
                </div>
                <span className="text-sm font-bold">{item.value} kg</span>
              </div>
            ))}
          </div>
        </Card>

        <Card className="lg:col-span-3">
          <div className="flex items-center gap-3 mb-8">
            <Map className="text-primary w-5 h-5" />
            <h3 className="text-lg font-bold text-gray-900">Thống kê theo khu vực</h3>
          </div>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f3f4f6" />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{fill: '#9ca3af', fontSize: 12}} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#4b5563', fontSize: 12, fontWeight: 600}} width={100} />
                <Tooltip 
                  cursor={{fill: '#f9fafb'}}
                  contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)'}}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 6, 6, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ReportsPage;
