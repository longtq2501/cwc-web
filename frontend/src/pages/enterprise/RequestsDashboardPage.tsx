import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../contexts/AuthContext';

interface RequestItem {
  id: number;
  citizenName: string;
  wasteType: string;
  quantity: number;
  status: string;
}

const RequestsDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<RequestItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/enterprise/requests/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setRequests(data.data || []);
    } catch (e) {
      toast.error('Không thể tải yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [token]);

  const handleAction = async (id: number, action: 'accept' | 'reject') => {
    try {
      const res = await fetch(`/api/enterprise/requests/${id}/${action}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Action failed');
      toast.success(`Yêu cầu ${action === 'accept' ? 'được chấp nhận' : 'đã bị từ chối'}`);
      fetchRequests();
    } catch (e) {
      toast.error('Thao tác thất bại');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Bảng quản lý yêu cầu</h2>
        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left">ID</th>
                <th className="px-4 py-2 text-left">Người dân</th>
                <th className="px-4 py-2 text-left">Loại rác</th>
                <th className="px-4 py-2 text-left">Số lượng</th>
                <th className="px-4 py-2 text-left">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id} className="border-t">
                  <td className="px-4 py-2">{req.id}</td>
                  <td className="px-4 py-2">{req.citizenName}</td>
                  <td className="px-4 py-2">{req.wasteType}</td>
                  <td className="px-4 py-2">{req.quantity}</td>
                  <td className="px-4 py-2 space-x-2">
                    <Button onClick={() => handleAction(req.id, 'accept')} className="bg-primary text-white">
                      Tiếp nhận
                    </Button>
                    <Button onClick={() => handleAction(req.id, 'reject')} className="bg-red-500 text-white">
                      Từ chối
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </div>
  );
};

export default RequestsDashboardPage;
