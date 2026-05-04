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

  useEffect(() => {
    // Simulated fetch for complaints
    setTimeout(() => {
      setComplaints([
        { id: 1, type: 'dispute', title: 'Sai lệch khối lượng', body: 'Collector báo 5kg nhưng tôi cân chỉ 3kg.', user: 'Lê Văn A', status: 'pending' },
        { id: 2, type: 'complaint', title: 'Thu gom trễ', body: 'Quá 2 tiếng so với thời gian hẹn.', user: 'Trần Thị B', status: 'pending' },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  const handleResolve = (id: number) => {
    toast.success('Đã giải quyết khiếu nại!');
    setComplaints(complaints.filter(c => c.id !== id));
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
                      {comp.type}
                    </span>
                    <h3 className="font-bold text-gray-900">{comp.title}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{comp.body}</p>
                  <p className="text-xs text-gray-400">Người gửi: {comp.user} · 10 phút trước</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Button variant="outline" size="sm">
                  <MessageSquare className="w-4 h-4 mr-2" /> Liên hệ
                </Button>
                <Button variant="primary" size="sm" onClick={() => handleResolve(comp.id)}>
                  <CheckCircle className="w-4 h-4 mr-2" /> Giải quyết
                </Button>
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
