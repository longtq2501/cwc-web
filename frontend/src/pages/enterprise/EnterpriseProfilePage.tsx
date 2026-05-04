import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Card } from '../../components/ui/Card';
import { toast } from 'react-hot-toast';

const EnterpriseProfilePage: React.FC = () => {
  const { token } = useAuth();
  const [profile, setProfile] = useState({
    wasteTypes: '' as string,
    capacity: '' as string,
    regions: '' as string,
    pointRule: '' as string,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch current enterprise profile
    fetch('/api/enterprise/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setProfile({
          wasteTypes: data.wasteTypes?.join(', ') ?? '',
          capacity: data.capacity?.toString() ?? '',
          regions: data.regions?.join(', ') ?? '',
          pointRule: data.pointRule ?? '',
        });
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/enterprise/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wasteTypes: profile.wasteTypes.split(',').map((s) => s.trim()),
          capacity: Number(profile.capacity),
          regions: profile.regions.split(',').map((s) => s.trim()),
          pointRule: profile.pointRule,
        }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success('Profile updated');
    } catch (err) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-">
      <Card className="p-6">
        <h2 className="text-2xl font-bold mb-4">Hồ sơ năng lực doanh nghiệp</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1" htmlFor="wasteTypes">
              Loại rác tiếp nhận (phân tách bằng dấu phẩy)
            </label>
            <Input
              id="wasteTypes"
              name="wasteTypes"
              value={profile.wasteTypes}
              onChange={handleChange}
              placeholder="Nhựa, Giấy, Kim loại"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="capacity">
              Công suất (kg/ngày)
            </label>
            <Input
              id="capacity"
              name="capacity"
              type="number"
              value={profile.capacity}
              onChange={handleChange}
              placeholder="500"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="regions">
              Khu vực hoạt động (phân tách bằng dấu phẩy)
            </label>
            <Input
              id="regions"
              name="regions"
              value={profile.regions}
              onChange={handleChange}
              placeholder="Hà Nội, Đà Nẵng"
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="pointRule">
              Quy tắc tính điểm (JSON string)
            </label>
            <Input
              id="pointRule"
              name="pointRule"
              value={profile.pointRule}
              onChange={handleChange}
              placeholder="{\"plastic\":10, \"paper\":5}"
            />
          </div>
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default EnterpriseProfilePage;
