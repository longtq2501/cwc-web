import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import { toast } from 'react-hot-toast';
import { Settings, Award, Shield, MapPin } from 'lucide-react';

interface PointRule {
  id?: number;
  condition_type: string;
  points: number;
  is_active: boolean;
}

const EnterpriseProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  
  const [profile, setProfile] = useState({
    enterprise_name: '',
    description: '',
    address: '',
    max_capacity_kg: 1000,
  });

  const [pointRules, setPointRules] = useState<PointRule[]>([
    { condition_type: 'correct_classification', points: 10, is_active: true },
    { condition_type: 'fast_collection', points: 5, is_active: true },
  ]);

  useEffect(() => {
    // Simulated fetch
    setTimeout(() => {
      setProfile({
        enterprise_name: 'Công ty Môi trường Xanh',
        description: 'Chuyên thu gom và tái chế rác thải nhựa, giấy.',
        address: '123 Đường ABC, Quận Liên Chiểu, Đà Nẵng',
        max_capacity_kg: 2000,
      });
      setLoading(false);
    }, 500);
  }, [token]);

  const handleAddRule = () => {
    setPointRules([...pointRules, { condition_type: 'other', points: 0, is_active: true }]);
  };

  const handleRuleChange = (index: number, field: keyof PointRule, value: any) => {
    const newRules = [...pointRules];
    newRules[index] = { ...newRules[index], [field]: value };
    setPointRules(newRules);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // In a real app, you would call your API here
      toast.success('Cấu hình đã được lưu thành công!');
    } catch (err) {
      toast.error('Lỗi khi lưu cấu hình');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12 text-primary">Đang tải cấu hình...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-display font-bold text-gray-900">Hồ sơ & Cấu hình ⚙️</h1>
        <p className="text-gray-500">Quản lý năng lực doanh nghiệp và quy tắc tính điểm cho Citizen.</p>
      </div>

      <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* General Info */}
          <Card className="space-y-6">
            <div className="flex items-center gap-3 mb-2">
              <Shield className="text-primary w-5 h-5" />
              <h3 className="text-lg font-bold">Năng lực xử lý</h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-6">
              <Input 
                label="Tên doanh nghiệp" 
                value={profile.enterprise_name} 
                onChange={e => setProfile({...profile, enterprise_name: e.target.value})}
              />
              <Input 
                label="Công suất xử lý (kg/ngày)" 
                type="number"
                value={profile.max_capacity_kg} 
                onChange={e => setProfile({...profile, max_capacity_kg: Number(e.target.value)})}
              />
            </div>
            <Input 
              label="Địa chỉ trụ sở" 
              value={profile.address} 
              onChange={e => setProfile({...profile, address: e.target.value})}
            />
            <div className="space-y-2">
              <label className="block text-sm font-bold text-gray-700">Mô tả hoạt động</label>
              <textarea 
                className="w-full px-4 py-3 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none text-sm min-h-[100px]"
                value={profile.description}
                onChange={e => setProfile({...profile, description: e.target.value})}
              />
            </div>
          </Card>

          {/* Point Rules */}
          <Card className="space-y-6">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <Award className="text-yellow-500 w-5 h-5" />
                <h3 className="text-lg font-bold">Quy tắc tính điểm thưởng</h3>
              </div>
              <Button type="button" variant="secondary" size="sm" onClick={handleAddRule}>
                + Thêm quy tắc
              </Button>
            </div>

            <div className="space-y-4">
              {pointRules.map((rule, idx) => (
                <div key={idx} className="flex flex-col md:flex-row gap-4 p-4 rounded-2xl bg-gray-50 border border-gray-100">
                  <div className="flex-1">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Điều kiện</label>
                    <select 
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none"
                      value={rule.condition_type}
                      onChange={e => handleRuleChange(idx, 'condition_type', e.target.value)}
                    >
                      <option value="correct_classification">Phân loại đúng</option>
                      <option value="fast_collection">Thu gom nhanh</option>
                      <option value="valid_request">Báo cáo hợp lệ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  <div className="w-32">
                    <label className="block text-xs font-bold text-gray-500 mb-1 uppercase">Số điểm</label>
                    <Input 
                      type="number" 
                      value={rule.points} 
                      onChange={e => handleRuleChange(idx, 'points', Number(e.target.value))}
                      className="!py-2"
                    />
                  </div>
                  <div className="flex items-end pb-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={rule.is_active}
                        onChange={e => handleRuleChange(idx, 'is_active', e.target.checked)}
                        className="w-4 h-4 rounded text-primary focus:ring-primary"
                      />
                      <span className="text-sm font-medium">Kích hoạt</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="space-y-8">
          <Card className="bg-primary text-white">
            <h3 className="font-bold mb-2">Trạng thái hồ sơ</h3>
            <div className="flex items-center gap-2 text-sm opacity-90 mb-4">
              <CheckCircleIcon className="w-4 h-4" />
              Đã được duyệt bởi Admin
            </div>
            <Button variant="secondary" fullWidth className="!bg-white/20 !text-white hover:!bg-white/30 border-none">
              Xem chứng chỉ số
            </Button>
          </Card>

          <Card>
            <div className="flex items-center gap-3 mb-6">
              <MapPin className="text-red-500 w-5 h-5" />
              <h3 className="text-lg font-bold">Khu vực phục vụ</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {['Quận Liên Chiểu', 'Quận Thanh Khê', 'Quận Hải Châu'].map(region => (
                <span key={region} className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-bold">
                  {region}
                </span>
              ))}
              <button className="px-3 py-1 border-2 border-dashed border-gray-200 text-gray-400 rounded-full text-xs font-bold hover:border-primary hover:text-primary transition-all">
                + Thêm khu vực
              </button>
            </div>
          </Card>

          <div className="sticky top-24">
            <Button type="submit" variant="primary" fullWidth size="lg" isLoading={loading}>
              Lưu tất cả thay đổi
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default EnterpriseProfilePage;
