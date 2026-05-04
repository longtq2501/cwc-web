import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  Building2, CheckCircle2, XCircle, 
  Clock, MapPin, ShieldCheck, ExternalLink,
  Loader2, Search, Filter
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const AdminApprovalsPage = () => {
  const { token } = useAuth();
  const [enterprises, setEnterprises] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEnterprises = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/enterprises/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEnterprises(data.data || []);
      }
    } catch (e) {
      toast.error('Không thể tải danh sách phê duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnterprises();
  }, []);

  const handleApprove = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/enterprises/${id}/approve`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Đã phê duyệt doanh nghiệp thành công!');
        fetchEnterprises();
      }
    } catch (e) {
      toast.error('Lỗi khi phê duyệt');
    }
  };

  const handleSuspend = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/enterprises/${id}/suspend`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ reason: 'Hồ sơ không hợp lệ' })
      });
      if (res.ok) {
        toast.error('Đã từ chối/đình chỉ doanh nghiệp');
        fetchEnterprises();
      }
    } catch (e) {
      toast.error('Lỗi khi đình chỉ');
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Phê duyệt Enterprise</h1>
        <p className="text-gray-500">Xem xét và cấp quyền hoạt động cho các doanh nghiệp tái chế mới.</p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
          <p className="text-gray-500">Đang tải hồ sơ...</p>
        </div>
      ) : enterprises.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {enterprises.map((ent: any) => (
            <Card key={ent.id} className="border-gray-100 hover:shadow-lg transition-all">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 rounded-3xl bg-primary-pale flex items-center justify-center text-primary">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{ent.enterprise_name}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4" /> GP: {ent.license_number}</span>
                      <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {ent.address}</span>
                      <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {new Date(ent.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button variant="outline" onClick={() => handleSuspend(ent.id)} className="text-red-500 border-red-100 hover:bg-red-50" leftIcon={<XCircle className="w-5 h-5" />}>
                    Từ chối
                  </Button>
                  <Button onClick={() => handleApprove(ent.id)} leftIcon={<CheckCircle2 className="w-5 h-5" />}>
                    Phê duyệt ngay
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
          <p className="text-gray-500 font-medium">Tất cả hồ sơ đã được xử lý xong.</p>
        </div>
      )}
    </div>
  );
};

export default AdminApprovalsPage;
