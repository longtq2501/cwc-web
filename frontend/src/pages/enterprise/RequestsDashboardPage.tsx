import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { toast } from 'react-hot-toast';
interface WasteRequest {
  id: number;
  citizen_name: string;
  waste_type: string;
  location: string;
  created_at: string;
  status: string;
}

const RequestsDashboardPage: React.FC = () => {
  const { token } = useAuth();
  const [requests, setRequests] = useState<WasteRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await fetch('/api/enterprise/requests/pending', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      // API returns a Laravel pagination object; data.data contains the records
      setRequests(data.data ?? data);
    } catch (e) {
      toast.error('Unable to load requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    // optional realtime: you could poll every 30s
  }, [token]);

  const handleAccept = async (id: number) => {
    try {
      const res = await fetch(`/api/enterprise/requests/${id}/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Accept failed');
      toast.success('Request accepted');
      fetchRequests();
    } catch (e) {
      toast.error('Accept failed');
    }
  };

  const handleReject = async (id: number) => {
    const reason = prompt('Lý do từ chối (max 500 ký tự)') ?? '';
    if (!reason) return;
    try {
      const res = await fetch(`/api/enterprise/requests/${id}/reject`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) throw new Error('Reject failed');
      toast.success('Request rejected');
      fetchRequests();
    } catch (e) {
      toast.error('Reject failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-6">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Quản lý yêu cầu (Requests Dashboard)</h2>
        {requests.length === 0 ? (
          <p className="text-gray-500">Không có yêu cầu đang chờ.</p>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 text-left">#</th>
                <th className="p-2 text-left">Người dùng</th>
                <th className="p-2 text-left">Loại rác</th>
                <th className="p-2 text-left">Vị trí</th>
                <th className="p-2 text-left">Ưu tiên</th>
                <th className="p-2 text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r.id} className="border-b">
                  <td className="p-2">{r.id}</td>
                  <td className="p-2">{r.citizen_name}</td>
                  <td className="p-2">{r.waste_type}</td>
                  <td className="p-2">{r.location}</td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded-lg text-xs font-bold ${
                      r.waste_type.includes('Nguy hại') ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                    }`}>
                      {r.waste_type.includes('Nguy hại') ? 'Cao' : 'Thường'}
                    </span>
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <Button variant="primary" onClick={() => handleAccept(r.id)}>
                      Tiếp nhận
                    </Button>
                    <Button variant="danger" onClick={() => handleReject(r.id)}>
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
