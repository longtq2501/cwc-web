import React, { useState } from 'react';
import { useNavigate, useLocation, Link, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Recycle, LayoutDashboard, FileText, BarChart3, 
  Users, Settings, LogOut, Menu, X, Bell, 
  Search, User, Award, ShieldCheck, Truck, AlertTriangle
} from 'lucide-react';

const SidebarItem = ({ icon: Icon, label, path, active, onClick, className = '' }: any) => (
  <button
    onClick={onClick}
    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
      active 
        ? 'bg-primary text-white shadow-md' 
        : 'text-gray-500 hover:bg-primary-pale hover:text-primary'
    } ${className}`}
  >
    <Icon className="w-5 h-5" />
    <span className="font-medium">{label}</span>
  </button>
);

interface MenuItem {
  icon: React.ElementType;
  label: string;
  path: string;
  primary?: boolean;
}

const MainLayout = () => {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems: Record<string, MenuItem[]> = {
    citizen: [
      { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
      { icon: Recycle, label: 'Tạo báo cáo', path: '/report/create', primary: true },
      { icon: FileText, label: 'Báo cáo của tôi', path: '/reports' },
      { icon: Award, label: 'Điểm thưởng', path: '/rewards' },
      { icon: Users, label: 'Bảng xếp hạng', path: '/leaderboard' },
    ],
    enterprise: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
      { icon: FileText, label: 'Quản lý yêu cầu', path: '/requests' },
      { icon: Truck, label: 'Đội ngũ thu gom', path: '/collectors' },
      { icon: BarChart3, label: 'Báo cáo thống kê', path: '/analytics' },
    ],
    collector: [
      { icon: LayoutDashboard, label: 'Nhiệm vụ', path: '/dashboard' },
      { icon: FileText, label: 'Lịch sử công việc', path: '/history' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Tổng quan', path: '/dashboard' },
      { icon: ShieldCheck, label: 'Duyệt Enterprise', path: '/approvals' },
      { icon: Users, label: 'Quản lý người dùng', path: '/users' },
      { icon: AlertTriangle, label: 'Giải quyết khiếu nại', path: '/complaints' },
      { icon: Settings, label: 'Cấu hình hệ thống', path: '/settings' },
    ]
  };

  const currentMenuItems = user ? menuItems[user.role] : [];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-gray-100 transition-transform duration-300 transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:relative lg:translate-x-0`}
      >
        <div className="h-full flex flex-col p-6">
          <div className="flex items-center gap-3 mb-10">
            <div className="bg-primary p-2 rounded-lg">
              <Recycle className="text-white w-6 h-6" />
            </div>
            <span className="font-display font-bold text-xl text-primary">EcoCollect</span>
          </div>

          <nav className="flex-1 space-y-2">
            {currentMenuItems.map((item) => (
              <SidebarItem
                key={item.path}
                {...item}
                active={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                className={item.primary ? 'bg-primary-mid text-white hover:bg-primary mb-4' : ''}
              />
            ))}
          </nav>

          <div className="mt-auto pt-6 border-t border-gray-100">
            <SidebarItem
              icon={Settings}
              label="Cài đặt"
              path="/settings"
              active={location.pathname === '/settings'}
              onClick={() => navigate('/settings')}
            />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all mt-2"
            >
              <LogOut className="w-5 h-5" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-6 lg:px-10 sticky top-0 z-40">
          <button 
            className="lg:hidden text-gray-500"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X /> : <Menu />}
          </button>

          <div className="hidden md:flex items-center bg-gray-50 px-4 py-2 rounded-xl border border-gray-100 w-96">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm báo cáo, địa điểm..." 
              className="bg-transparent border-none focus:ring-0 text-sm ml-2 w-full"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-gray-500 hover:bg-gray-50 rounded-full transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>

            <div className="h-10 w-px bg-gray-100 mx-2"></div>

            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-gray-900">{user?.fullName}</p>
                <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
              </div>
              <div className="w-10 h-10 bg-primary-pale rounded-xl flex items-center justify-center text-primary">
                {user?.avatarUrl ? (
                  <img src={user.avatarUrl} alt="" className="w-full h-full rounded-xl object-cover" />
                ) : (
                  <User className="w-6 h-6" />
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
