import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';
import { Truck, User, Clock, CheckCircle } from 'lucide-react';

interface Assignment {
  id: number;
  request_id: number;
  status: string;
  request?: {
    waste_type: string;
    location: string;
  };
  collector?: {
    id: number;
    user?: {
      fullName: string;
    }
  };
}

interface Collector {
  id: number;
  user?: {
    fullName: string;
  };
}

const AssignmentPage: React.FC = () => {
  const { token } = useAuth();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [collectors, setCollectors] = useState<Collector[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [assignRes, collectorRes] = await Promise.all([
        fetch('/api/enterprise/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/enterprise/collectors', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const assignData = await assignRes.json();
      const collectorData = await collectorRes.json();

      setAssignments(assignData.data ?? assignData);
      setCollectors(collectorData.data ?? collectorData);
    } catch (e) {
      toast.error('Không thể tải dữ liệu điều phối');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const handleAssign = async (requestId: number, collectorId: number) => {
    try {
      const res = await fetch(`/api/enterprise/requests/${requestId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ collector_id: collectorId }),
      });

      if (!res.ok) throw new Error('Failed to assign');
      toast.success('Đã gán nhiệm vụ thành công');
      fetchData();
    } catch (e) {
      toast.error('Thao tác thất bại');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'bg-blue-100 text-blue-700';
      case 'assigned': return 'bg-yellow-100 text-yellow-700';
      case 'on_the_way': return 'bg-purple-100 text-purple-700';
      case 'collected': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  if (loading) return <div className="flex justify-center p-12">Đang tải...</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Điều phối & Theo dõi 🚛</h1>
        <p className="text-gray-500">Gán nhiệm vụ và theo dõi tiến độ thu gom của Collector.</p>
      </div>

      <div className="grid gap-6">
        {assignments.map((assignment) => (
          <Card key={assignment.id} className="overflow-hidden">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary-pale rounded-2xl flex items-center justify-center shrink-0">
                  <Truck className="text-primary w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-gray-900">Yêu cầu #{assignment.request_id}</span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(assignment.status)}`}>
                      {assignment.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">{assignment.request?.waste_type} · {assignment.request?.location}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 border-t md:border-t-0 md:border-l border-gray-100 pt-4 md:pt-0 md:pl-6">
                {assignment.collector ? (
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <User className="text-gray-400 w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Collector phụ trách</p>
                      <p className="text-sm font-bold">{assignment.collector.user?.fullName}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 w-full">
                    <select
                      className="bg-gray-50 border-2 border-transparent focus:border-primary rounded-xl px-4 py-2 text-sm outline-none transition-all"
                      onChange={(e) => handleAssign(assignment.request_id, Number(e.target.value))}
                      defaultValue=""
                    >
                      <option value="" disabled>Chọn Collector...</option>
                      {collectors.map(c => (
                        <option key={c.id} value={c.id}>{c.user?.fullName}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>
            </div>
          </Card>
        ))}
        {assignments.length === 0 && (
          <Card className="text-center py-12">
            <p className="text-gray-500">Chưa có yêu cầu nào được tiếp nhận để điều phối.</p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AssignmentPage;
