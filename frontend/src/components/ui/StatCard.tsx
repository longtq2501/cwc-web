import React from 'react';
import { TrendingUp } from 'lucide-react';

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  trend?: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon: Icon, label, value, trend, color }) => (
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

export default StatCard;
