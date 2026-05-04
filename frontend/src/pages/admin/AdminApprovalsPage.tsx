import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { ShieldCheck, XCircle, ExternalLink, Building } from 'lucide-react';

interface Enterprise {
  id: number;
  enterprise_name: string;
  license_number: string;
  address: string;
  status: string;
  user?: {
    email: string;
  };
}

const AdminApprovalsPage: React.FC = () => {
  const { token } = useAuth();
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchPending = async () => {
    try {
      const res = await fetch('/api/admin/enterprises/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setEnterprises(data.data ?? data);
    } catch (e) {
      toast.error('Không thể tải danh sách chờ duyệt');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPending();
  }, [token]);

  const handleAction = async (id: number, action: 'approve' | 'suspend') => {
    try {
      const res = await fetch(`/api/admin/enterprises/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      toast.success(action === 'approve' ? 'Đã duyệt doanh nghiệp!' : 'Đã từ chối');
      fetchPending();
    } catch (e) {
      toast.error('Thao tác thất bại');
    }
  };

  if (loading) return <div className="flex justify-center p-12">Đang tải...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Duyệt Doanh nghiệp 🏢</h1>
        <p className="text-gray-500">Xem xét năng lực và giấy phép của các đơn vị đăng ký tham gia mạng lưới.</p>
      </div>

      <div className="grid gap-6">
        {enterprises.map((ent) => (
          <Card key={ent.id} className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center shrink-0">
                  <Building className="text-blue-500 w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{ent.enterprise_name}</h3>
                  <p className="text-sm text-gray-500">Giấy phép: {ent.license_number} · {ent.user?.email}</p>
                  <p className="text-sm text-gray-600 mt-1">{ent.address}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm" onClick={() => window.open('#')}>
                  <ExternalLink className="w-4 h-4 mr-2" /> Hồ sơ
                </Button>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => handleAction(ent.id, 'approve')}
                >
                  <ShieldCheck className="w-4 h-4 mr-2" /> Duyệt
                </Button>
                <Button 
                  variant="danger" 
                  size="sm"
                  onClick={() => handleAction(ent.id, 'suspend')}
                >
                  <XCircle className="w-4 h-4 mr-2" /> Từ chối
                </Button>
              </div>
            </div>
          </Card>
        ))}
        {enterprises.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Không có doanh nghiệp nào đang chờ duyệt.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminApprovalsPage;
