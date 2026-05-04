import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Mail, Lock, ShieldCheck, ArrowRight, 
  CheckCircle2, Building2, MapPin, Truck,
  ChevronLeft, KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    role: 'citizen' as 'citizen' | 'enterprise' | 'collector',
    phone: '',
    ward: '',
    businessId: '',
  });

  const validateEmail = (email: string) => {
    return String(email).toLowerCase().match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateEmail(formData.email)) {
      setError('Email không đúng định dạng. Vui lòng kiểm tra lại.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setStep(2);
    }, 1500);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await register(formData.email, formData.password, formData.fullName, formData.role);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Có lỗi xảy ra trong quá trình đăng ký.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 py-20 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-pale rounded-full blur-3xl opacity-50 -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-enterprise-lt/20 rounded-full blur-3xl opacity-50 -ml-48 -mb-48"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-xl z-10"
      >
        <Card padding="xl" className="shadow-2xl">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-primary rounded-3xl mb-6 shadow-lg shadow-primary/20">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Gia nhập cộng đồng Xanh</h1>
            <p className="text-gray-500">Bước đầu tiên để bảo vệ hành tinh của chúng ta</p>
          </div>

          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.form 
                key="step1"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                onSubmit={handleNextStep} 
                className="space-y-6"
              >
                {/* Role Switcher */}
                <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'citizen' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      formData.role === 'citizen' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <User className="w-4 h-4" /> Cá nhân
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: 'enterprise' })}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                      formData.role === 'enterprise' ? 'bg-white text-enterprise shadow-sm' : 'text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    <Building2 className="w-4 h-4" /> Doanh nghiệp
                  </button>
                </div>

                <div className="space-y-4">
                  <Input
                    required
                    placeholder={formData.role === 'citizen' ? "Họ và tên" : "Tên doanh nghiệp"}
                    icon={User}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />

                  <Input
                    required
                    type="email"
                    placeholder="Địa chỉ Email"
                    icon={Mail}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <Input
                    required
                    type="password"
                    placeholder="Mật khẩu"
                    icon={Lock}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  />

                  {formData.role === 'enterprise' ? (
                    <Input
                      required
                      placeholder="Số giấy phép kinh doanh"
                      icon={ShieldCheck}
                      value={formData.businessId}
                      onChange={(e) => setFormData({ ...formData, businessId: e.target.value })}
                    />
                  ) : (
                    <div className="space-y-2">
                      <div className="relative group">
                        <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-focus-within:text-primary transition-colors" />
                        <select
                          required
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all outline-none appearance-none text-sm"
                          value={formData.ward}
                          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                        >
                          <option value="">Chọn Phường/Xã cư trú</option>
                          <option value="p7">Phường 7</option>
                          <option value="p12">Phường 12</option>
                          <option value="p25">Phường 25</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
                )}

                <Button
                  type="submit"
                  fullWidth
                  size="lg"
                  isLoading={isLoading}
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                >
                  Tiếp tục
                </Button>
              </motion.form>
            ) : (
              <motion.form 
                key="step2"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                onSubmit={handleFinalSubmit} 
                className="space-y-8"
              >
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-primary-pale text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                    <KeyRound className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Xác thực Email</h3>
                  <p className="text-gray-500 text-sm">
                    Chúng tôi vừa gửi mã OTP gồm 6 chữ số đến <br/>
                    <span className="font-bold text-gray-900">{formData.email}</span>
                  </p>
                </div>

                <div className="flex justify-between gap-2 max-w-xs mx-auto">
                  {otp.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      className="w-12 h-14 text-center text-xl font-bold bg-gray-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary transition-all outline-none"
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                    />
                  ))}
                </div>

                <div className="text-center">
                  <button type="button" className="text-sm text-primary font-bold hover:underline">
                    Gửi lại mã (59s)
                  </button>
                </div>

                {error && (
                  <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
                )}

                <div className="flex gap-4">
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
                    disabled={otp.some(d => !d)}
                    rightIcon={<CheckCircle2 className="w-5 h-5" />}
                  >
                    Hoàn tất
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
