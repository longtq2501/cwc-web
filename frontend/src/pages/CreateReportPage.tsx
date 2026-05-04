import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  Camera, MapPin, Info, Send, Loader2, 
  Leaf, Recycle, BatteryWarning, Sofa, Laptop, Box,
  CheckCircle2, AlertCircle, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import toast from 'react-hot-toast';

const WASTE_TYPES = [
  { id: 1, name: 'Rác Hữu Cơ', icon: Leaf, color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-100', slug: 'organic' },
  { id: 2, name: 'Rác Tái Chế', icon: Recycle, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100', slug: 'recyclable' },
  { id: 3, name: 'Rác Nguy Hại', icon: BatteryWarning, color: 'text-red-500', bg: 'bg-red-50', border: 'border-red-100', slug: 'hazardous' },
  { id: 4, name: 'Rác Cồng Kềnh', icon: Sofa, color: 'text-amber-700', bg: 'bg-amber-50', border: 'border-amber-100', slug: 'bulky' },
  { id: 5, name: 'Rác Điện Tử', icon: Laptop, color: 'text-gray-700', bg: 'bg-gray-50', border: 'border-gray-100', slug: 'electronic' },
  { id: 6, name: 'Loại Khác', icon: Box, color: 'text-gray-400', bg: 'bg-gray-50', border: 'border-gray-100', slug: 'other' },
];

const CreateReportPage = () => {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const [formData, setFormData] = useState({
    imageUrl: null as string | null,
    previewUrl: null as string | null,
    wasteTypeId: null as number | null,
    description: '',
    address: '',
    latitude: null as number | null,
    longitude: null as number | null,
    estimatedWeight: '',
  });

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Preview
      setFormData(prev => ({ ...prev, previewUrl: URL.createObjectURL(file) }));
      setStep(2);

      // Analyze image
      setIsAnalyzing(true);
      const formDataUpload = new FormData();
      formDataUpload.append('image', file);

      try {
        const res = await fetch('/api/citizen/analyze-image', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formDataUpload,
        });

        if (res.ok) {
          const data = await res.json();
          setFormData(prev => ({ 
            ...prev, 
            imageUrl: data.data.image_url,
            wasteTypeId: data.data.waste_type_id 
          }));
          toast.success(`Hệ thống nhận diện: ${data.data.predicted_type_name}`);
        }
      } catch (error) {
        toast.error('Không thể phân tích ảnh. Vui lòng chọn loại rác thủ công.');
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            address: `Toạ độ: ${position.coords.latitude.toFixed(6)}, ${position.coords.longitude.toFixed(6)}`
          });
        },
        (error) => {
          console.error("Error getting location", error);
          toast.error('Không thể lấy vị trí. Vui lòng nhập địa chỉ thủ công.');
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.imageUrl) {
      toast.error('Vui lòng chờ ảnh tải lên hoàn tất.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/citizen/requests', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({
          waste_type_id: formData.wasteTypeId,
          ward_id: user?.wardId || 1, // Fallback to 1 if not set
          address_detail: formData.address,
          latitude: formData.latitude,
          longitude: formData.longitude,
          description: formData.description,
          estimated_weight_kg: parseFloat(formData.estimatedWeight) || null,
          image_urls: [formData.imageUrl]
        }),
      });

      if (res.ok) {
        toast.success('Báo cáo đã được gửi thành công!');
        navigate('/reports', { state: { success: true } });
      } else {
        const data = await res.json();
        toast.error(data.message || 'Gửi báo cáo thất bại.');
      }
    } catch (error) {
      toast.error('Lỗi kết nối máy chủ.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Tạo báo cáo rác mới</h1>
        <p className="text-gray-500">Chụp ảnh và phân loại rác để nhận điểm thưởng EcoPoint.</p>
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
        <form onSubmit={handleSubmit}>
          {/* Step 1: Photo Upload */}
          <div className={`p-8 ${step !== 1 && 'hidden'}`}>
            <div className="text-center">
              <div className="mb-6 flex justify-center">
                <div className="w-24 h-24 bg-primary-pale rounded-full flex items-center justify-center text-primary">
                  <Camera className="w-10 h-10" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bước 1: Chụp ảnh hiện trường</h3>
              <p className="text-gray-500 mb-8 max-w-xs mx-auto">Hình ảnh rõ nét giúp Enterprise xác nhận nhanh hơn và cộng điểm chính xác.</p>
              
              <label className="cursor-pointer bg-primary text-white font-bold px-8 py-4 rounded-2xl hover:bg-primary-mid transition-all inline-flex items-center gap-2">
                <Camera className="w-5 h-5" />
                Chụp ảnh ngay
                <input type="file" accept="image/*" capture="environment" className="hidden" onChange={handleImageChange} />
              </label>
              <p className="mt-4 text-xs text-gray-400">Hoặc chọn từ thư viện ảnh</p>
            </div>
          </div>

          {/* Step 2: Form Details */}
          <div className={`${step !== 2 && 'hidden'}`}>
            {formData.previewUrl && (
              <div className="relative h-64 w-full">
                <img src={formData.previewUrl} alt="Waste" className="w-full h-full object-cover" />
                <button 
                  type="button"
                  onClick={() => { setFormData({...formData, previewUrl: null, imageUrl: null}); setStep(1); }}
                  className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/70"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6">
                  {isAnalyzing ? (
                    <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-2 w-fit">
                      <Loader2 className="w-3 h-3 animate-spin" /> Đang nhận diện rác bằng AI...
                    </span>
                  ) : (
                    <span className="bg-primary text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1 w-fit">
                      <CheckCircle2 className="w-3 h-3" /> Ảnh đã sẵn sàng
                    </span>
                  )}
                </div>
              </div>
            )}

            <div className="p-8 space-y-8">
              {/* Waste Type Grid */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-4 flex items-center gap-2">
                  <Recycle className="w-5 h-5 text-primary" /> 1. Phân loại loại rác *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {WASTE_TYPES.map((type) => {
                    const Icon = type.icon;
                    const isSelected = formData.wasteTypeId === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, wasteTypeId: type.id })}
                        className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                          isSelected 
                            ? `border-primary ${type.bg} ${type.color}` 
                            : 'border-gray-100 hover:border-gray-200 text-gray-500'
                        }`}
                      >
                        <Icon className={`w-8 h-8 mb-2 ${isSelected ? type.color : 'text-gray-400'}`} />
                        <span className="text-xs font-bold">{type.name}</span>
                      </button>
                    );
                  })}
                </div>
                {formData.wasteTypeId === 3 && (
                  <div className="mt-4 bg-red-50 border border-red-100 p-4 rounded-xl flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 leading-relaxed">
                      <strong>Lưu ý:</strong> Báo cáo rác nguy hại đúng cách giúp bạn nhận được <strong>+15 EcoPoints</strong>. Hãy đảm bảo rác được để ở nơi an toàn.
                    </p>
                  </div>
                )}
              </div>

              {/* Location & Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" /> 2. Vị trí thu gom *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="Số nhà, tên đường, phường..."
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary text-sm"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                    <button 
                      type="button"
                      onClick={getLocation}
                      className="absolute right-2 top-1.5 p-2 text-primary hover:bg-primary-pale rounded-lg transition-colors"
                      title="Lấy vị trí hiện tại"
                    >
                      <MapPin className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                    <Box className="w-5 h-5 text-primary" /> 3. Khối lượng ước tính (kg)
                  </label>
                  <input
                    type="number"
                    placeholder="Ví dụ: 2.5"
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary text-sm"
                    value={formData.estimatedWeight}
                    onChange={(e) => setFormData({ ...formData, estimatedWeight: e.target.value })}
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" /> 4. Ghi chú thêm
                </label>
                <textarea
                  rows={3}
                  placeholder="Mô tả cụ thể (ví dụ: rác để cạnh cột điện, trong túi xanh...)"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-primary focus:border-primary text-sm"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 py-4 border-2 border-gray-100 rounded-2xl font-bold text-gray-500 hover:bg-gray-50 transition-all"
                >
                  Quay lại
                </button>
                <button
                  type="submit"
                  disabled={isLoading || !formData.wasteTypeId || !formData.address || !formData.imageUrl}
                  className="flex-[2] bg-primary text-white font-bold py-4 rounded-2xl hover:bg-primary-mid transition-all shadow-lg hover:shadow-primary/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Gửi báo cáo ngay <Send className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      <div className="mt-8 p-6 bg-blue-50 border border-blue-100 rounded-3xl flex items-start gap-4">
        <div className="bg-blue-500 p-2 rounded-xl text-white shrink-0">
          <Info className="w-5 h-5" />
        </div>
        <div>
          <h4 className="font-bold text-blue-900 mb-1">Cách tính điểm EcoPoint</h4>
          <p className="text-sm text-blue-700 leading-relaxed">
            Hệ thống sẽ cộng <strong>+10 điểm</strong> khi báo cáo được Enterprise xác nhận hợp lệ. 
            Nếu bạn phân loại đúng (được kiểm chứng khi thu gom), bạn sẽ nhận thêm <strong>+5 điểm</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreateReportPage;
