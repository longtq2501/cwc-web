import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { AlertTriangle, CheckCircle, MessageSquare } from 'lucide-react';

const AdminComplaintsPage: React.FC = () => {
  const { token } = useAuth();
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/complaints', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Assuming Laravel pagination returns .data or direct array
        setComplaints(data.data || data);
      }
    } catch (e) {
      toast.error('Lỗi khi tải danh sách khiếu nại');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleResolve = async (id: number) => {
    try {
      const res = await fetch(`/api/admin/complaints/${id}/resolve`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ resolution_notes: 'Đã xử lý xong khiếu nại' })
      });
      if (res.ok) {
        toast.success('Đã giải quyết khiếu nại!');
        // Filter out the resolved complaint or refetch
        setComplaints(complaints.filter(c => c.id !== id));
      } else {
        toast.error('Lỗi khi giải quyết khiếu nại');
      }
    } catch (e) {
      toast.error('Lỗi kết nối máy chủ');
    }
  };

  if (loading) return <div className="flex justify-center p-12">Đang tải khiếu nại...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Giải quyết khiếu nại ⚖️</h1>
        <p className="text-gray-500">Xử lý các tranh chấp và phản hồi từ người dùng hệ thống.</p>
      </div>

      <div className="grid gap-6">
        {complaints.map((comp) => (
          <Card key={comp.id} className="border-l-4 border-red-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center shrink-0">
                  <AlertTriangle className="text-red-500 w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold uppercase rounded">
                      {comp.complaint_type || 'Khác'}
                    </span>
                    <h3 className="font-bold text-gray-900">Yêu cầu thu gom #{comp.request_id}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{comp.content}</p>
                  <p className="text-xs text-gray-400">Người gửi: {comp.citizen?.full_name || 'Khách'} · {new Date(comp.created_at).toLocaleString('vi-VN')}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {comp.status === 'pending' ? (
                  <>
                    <Button variant="outline" size="sm">
                      <MessageSquare className="w-4 h-4 mr-2" /> Liên hệ
                    </Button>
                    <Button variant="primary" size="sm" onClick={() => handleResolve(comp.id)}>
                      <CheckCircle className="w-4 h-4 mr-2" /> Giải quyết
                    </Button>
                  </>
                ) : (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1">
                    <CheckCircle className="w-4 h-4" /> Đã xử lý
                  </span>
                )}
              </div>
            </div>
          </Card>
        ))}
        {complaints.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Hiện không có khiếu nại nào cần xử lý.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminComplaintsPage;
