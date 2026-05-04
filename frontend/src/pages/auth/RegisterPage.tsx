import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Mail, Lock, ShieldCheck, ArrowRight, 
  CheckCircle2, Building2, MapPin, Truck,
  ChevronLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'citizen' as 'citizen' | 'enterprise' | 'collector',
    phone: '',
    ward: '',
  });

  const handleRoleSelect = (role: any) => {
    setFormData({ ...formData, role });
    setStep(2);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.fullName, formData.role);
      toast.success('Đăng ký tài khoản thành công!');
      navigate('/'); // Redirect to dashboard redirector
    } catch (err: any) {
      setError(err.message || 'Đăng ký thất bại. Vui lòng thử lại.');
      toast.error(err.message || 'Lỗi đăng ký');
    } finally {
      setIsLoading(false);
    }
  };

  const ROLES = [
    { id: 'citizen', title: 'Người dân', desc: 'Báo cáo rác & nhận quà', icon: MapPin },
    { id: 'collector', title: 'Người thu gom', desc: 'Nhận nhiệm vụ thu gom', icon: Truck },
    { id: 'enterprise', title: 'Doanh nghiệp', desc: 'Quản lý & xử lý rác', icon: Building2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6 py-20">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl"
      >
        <Card className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-pale rounded-3xl text-primary mb-6 shadow-sm">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Gia nhập cộng đồng Xanh</h1>
            <p className="text-gray-500">Bước đầu tiên để bảo vệ hành tinh của chúng ta</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div
                key="step1"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 gap-4">
                  {ROLES.map((role) => (
                    <button
                      key={role.id}
                      onClick={() => handleRoleSelect(role.id)}
                      className="group flex items-center gap-6 p-6 rounded-3xl border-2 border-gray-100 hover:border-primary hover:bg-primary-pale/30 transition-all text-left"
                    >
                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-white group-hover:text-primary transition-all">
                        <role.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-900 group-hover:text-primary transition-colors">{role.title}</h3>
                        <p className="text-xs text-gray-400">{role.desc}</p>
                      </div>
                      <ArrowRight className="w-5 h-5 text-gray-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.form 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onSubmit={handleRegister} 
                className="space-y-6"
              >
                {/* Hiển thị vai trò đã chọn một cách tinh tế thay vì bộ chọn */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm">
                    {formData.role === 'citizen' && <MapPin className="w-5 h-5" />}
                    {formData.role === 'collector' && <Truck className="w-5 h-5" />}
                    {formData.role === 'enterprise' && <Building2 className="w-5 h-5" />}
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-gray-400 font-bold">Đang đăng ký vai trò</p>
                    <p className="text-sm font-bold text-gray-900">
                      {ROLES.find(r => r.id === formData.role)?.title}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Input 
                    label="Họ và tên" 
                    icon={User} 
                    required 
                    placeholder="Nhập họ tên của bạn"
                    value={formData.fullName}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  />
                  <Input 
                    label="Email" 
                    type="email" 
                    icon={Mail} 
                    required 
                    placeholder="email@vidu.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                  <Input 
                    label="Mật khẩu" 
                    type="password" 
                    icon={Lock} 
                    required 
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                  />
                </div>

                {error && (
                  <div className="p-4 bg-red-50 rounded-2xl text-red-500 text-sm font-medium text-center border border-red-100">
                    {error}
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    fullWidth 
                    onClick={() => setStep(1)}
                    leftIcon={<ChevronLeft className="w-5 h-5" />}
                  >
                    Quay lại
                  </Button>
                  <Button 
                    type="submit" 
                    fullWidth 
                    isLoading={isLoading}
                    rightIcon={<ArrowRight className="w-5 h-5" />}
                  >
                    Hoàn tất đăng ký
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Bạn đã có tài khoản?{' '}
              <Link to="/login" className="text-primary font-bold hover:underline">Đăng nhập ngay</Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default RegisterPage;
