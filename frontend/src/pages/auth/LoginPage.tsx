import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  User, Mail, Lock, LogIn, ShieldCheck, 
  ArrowRight, CheckCircle2, Building2 
} from 'lucide-react';
import { motion } from 'motion/react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      await login(email, password);
      toast.success('Chào mừng bạn quay trở lại!');
      
      // Redirect logic is usually handled in useEffect or AuthContext, 
      // but we can also do it here for immediate feedback.
      // The app will redirect via ProtectedRoute anyway if we go to '/'
      navigate('/'); 
    } catch (err: any) {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
      toast.error('Thông tin đăng nhập không chính xác');
    } finally {
      setIsLoading(false);
    }
  };

  const handleMockAdminLogin = () => {
    localStorage.setItem('cwc_token', 'mock_admin_token');
    const mockAdmin = {
      id: 1,
      fullName: 'Admin Test',
      email: 'admin@ecocollect.vn',
      role: 'admin'
    };
    localStorage.setItem('cwc_user', JSON.stringify(mockAdmin));
    toast.success('Đang vào chế độ Test Admin...');
    window.location.href = '/admin';
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg"
      >
        <Card className="p-8 md:p-12">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-pale rounded-2xl text-primary mb-6">
              <LogIn className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-gray-900 mb-2">Mừng bạn trở lại!</h1>
            <p className="text-gray-500">Đăng nhập để tiếp tục hành trình xanh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <Input
                required
                type="email"
                placeholder="Email của bạn"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <Input
                required
                type="password"
                placeholder="Mật khẩu"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary" />
                <span className="text-sm text-gray-500 group-hover:text-gray-700">Ghi nhớ đăng nhập</span>
              </label>
              <a href="#" className="text-sm font-bold text-primary hover:underline">Quên mật khẩu?</a>
            </div>

            {error && (
              <div className="p-4 bg-red-50 rounded-2xl text-red-500 text-sm font-medium text-center">
                {error}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Đăng nhập ngay
            </Button>

            <button
              type="button"
              onClick={handleMockAdminLogin}
              className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-xs font-bold text-gray-400 hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-2"
            >
              🚀 DEBUG: Vào nhanh giao diện Admin (UI Test)
            </button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default LoginPage;
