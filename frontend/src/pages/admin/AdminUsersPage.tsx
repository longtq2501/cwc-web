import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Users, Search, Shield, ShieldOff, Edit2, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const AdminUsersPage: React.FC = () => {
  const { token } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal states
  const [editingUser, setEditingUser] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedRole, setSelectedRole] = useState<number>(0);
  const [isActive, setIsActive] = useState<boolean>(true);

  // Note: Hardcoded roles mapping based on backend seeders (Citizen=2, Enterprise=3, Collector=4)
  // Ideally, this should come from a /api/admin/roles endpoint.
  const ROLES = [
    { id: 1, name: 'Admin', badge: 'bg-purple-100 text-purple-700' },
    { id: 2, name: 'Citizen', badge: 'bg-blue-100 text-blue-700' },
    { id: 3, name: 'Enterprise', badge: 'bg-emerald-100 text-emerald-700' },
    { id: 4, name: 'Collector', badge: 'bg-amber-100 text-amber-700' },
  ];

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.data || data); // handle pagination wrapper
      } else {
        toast.error('Lỗi khi tải danh sách người dùng');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user: any) => {
    setEditingUser(user);
    setSelectedRole(user.role_id);
    setIsActive(user.is_active);
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/users/${editingUser.id}/role`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ 
          role_id: selectedRole,
          is_active: isActive
        })
      });

      if (res.ok) {
        toast.success('Cập nhật người dùng thành công!');
        fetchUsers();
        setEditingUser(null);
      } else {
        const data = await res.json();
        toast.error(data.message || 'Lỗi khi cập nhật người dùng');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredUsers = users.filter(user => 
    (user.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
     user.email?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-display font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Users className="w-8 h-8 text-primary" /> Quản lý người dùng
          </h1>
          <p className="text-gray-500">Xem danh sách, phân quyền và khoá/mở khoá tài khoản trên hệ thống.</p>
        </div>
      </div>

      <Card className="p-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6 items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Tìm kiếm theo tên hoặc email..." 
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-primary focus:border-primary text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
            <p className="text-gray-500 text-sm">Đang tải dữ liệu...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-l-xl">Người dùng</th>
                  <th className="px-6 py-4 font-bold">Email / SĐT</th>
                  <th className="px-6 py-4 font-bold">Vai trò</th>
                  <th className="px-6 py-4 font-bold">Trạng thái</th>
                  <th className="px-6 py-4 font-bold text-right rounded-r-xl">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                      Không tìm thấy người dùng nào phù hợp.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-pale flex items-center justify-center text-primary font-bold">
                            {user.full_name?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-400">ID: {user.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-gray-900">{user.email}</p>
                        <p className="text-gray-500 text-xs">{user.phone || 'Chưa cập nhật'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${ROLES.find(r => r.id === user.role_id)?.badge || 'bg-gray-100 text-gray-600'}`}>
                          {user.role?.name || ROLES.find(r => r.id === user.role_id)?.name || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {user.is_active ? (
                          <span className="flex items-center gap-1.5 text-emerald-600 text-xs font-bold">
                            <CheckCircle className="w-4 h-4" /> Hoạt động
                          </span>
                        ) : (
                          <span className="flex items-center gap-1.5 text-red-500 text-xs font-bold">
                            <XCircle className="w-4 h-4" /> Đã khoá
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditClick(user)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Edit User Modal */}
      <AnimatePresence>
        {editingUser && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Cập nhật tài khoản</h3>
                <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-900 transition-colors">
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="mb-6">
                <div className="flex items-center gap-3 mb-6 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                  <div className="w-12 h-12 rounded-full bg-primary-pale flex items-center justify-center text-primary font-bold text-lg">
                    {editingUser.full_name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{editingUser.full_name}</p>
                    <p className="text-sm text-gray-500">{editingUser.email}</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Vai trò hệ thống</label>
                    <div className="grid grid-cols-2 gap-3">
                      {ROLES.map((role) => (
                        <button
                          key={role.id}
                          onClick={() => setSelectedRole(role.id)}
                          className={`p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                            selectedRole === role.id 
                              ? 'border-primary bg-primary-pale text-primary' 
                              : 'border-gray-100 text-gray-500 hover:border-gray-200'
                          }`}
                        >
                          {role.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Trạng thái tài khoản</label>
                    <div className="flex gap-3">
                      <button
                        onClick={() => setIsActive(true)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          isActive 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700' 
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <Shield className="w-4 h-4" /> Hoạt động
                      </button>
                      <button
                        onClick={() => setIsActive(false)}
                        className={`flex-1 flex items-center justify-center gap-2 p-3 rounded-xl border-2 text-sm font-bold transition-all ${
                          !isActive 
                            ? 'border-red-500 bg-red-50 text-red-700' 
                            : 'border-gray-100 text-gray-500 hover:border-gray-200'
                        }`}
                      >
                        <ShieldOff className="w-4 h-4" /> Khoá
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setEditingUser(null)}>
                  Hủy bỏ
                </Button>
                <Button variant="primary" fullWidth onClick={handleUpdateUser} isLoading={isUpdating}>
                  Lưu thay đổi
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminUsersPage;
