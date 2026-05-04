import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Mail, Lock, LogIn, User, Building2, ShieldCheck } from 'lucide-react';
import { motion } from 'motion/react';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Card from '../../components/ui/Card';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [role, setRole] = useState<'citizen' | 'enterprise' | 'collector' | 'admin'>('citizen');
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
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Email hoặc mật khẩu không chính xác.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-pale rounded-full blur-3xl opacity-50 -ml-48 -mt-48"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-primary-pale rounded-full blur-3xl opacity-50 -mr-48 -mb-48"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <Card padding="xl" className="shadow-2xl">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center p-4 bg-primary rounded-3xl mb-6 shadow-lg shadow-primary/20">
              <LogIn className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-display font-extrabold text-gray-900 mb-2">Mừng bạn trở lại!</h1>
            <p className="text-gray-500">Đăng nhập để tiếp tục hành trình xanh</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role Switcher */}
            <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
              <button
                type="button"
                onClick={() => setRole('citizen')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  role === 'citizen' ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <User className="w-4 h-4" /> Cá nhân
              </button>
              <button
                type="button"
                onClick={() => setRole('enterprise')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
                  role === 'enterprise' ? 'bg-white text-enterprise shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Building2 className="w-4 h-4" /> Doanh nghiệp
              </button>
            </div>

            <div className="space-y-4">
              <Input
                required
                type="email"
                placeholder="Email của bạn"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={error ? ' ' : undefined} // Just highlighting the field
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

            {error && (
              <p className="text-red-500 text-sm font-medium text-center bg-red-50 py-2 rounded-lg">{error}</p>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-500 cursor-pointer">
                <input type="checkbox" className="rounded border-gray-300 text-primary focus:ring-primary" />
                Ghi nhớ đăng nhập
              </label>
              <a href="#" className="text-primary font-bold hover:underline">Quên mật khẩu?</a>
            </div>

            <Button
              type="submit"
              fullWidth
              size="lg"
              isLoading={isLoading}
              variant={role === 'enterprise' ? 'enterprise' : 'primary'}
              rightIcon={<LogIn className="w-5 h-5" />}
            >
              Đăng nhập ngay
            </Button>
          </form>

          <div className="mt-10 pt-10 border-t border-gray-100 text-center">
            <p className="text-gray-500 text-sm">
              Chưa có tài khoản?{' '}
              <Link to="/register" className="text-primary font-bold hover:underline">Đăng ký ngay</Link>
            </p>
          </div>
        </Card>
        
        {/* Quick Login Info (Optional/Demo) */}
        <div className="mt-8 flex justify-center gap-4">
          <button 
            onClick={() => setRole('collector')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${role === 'collector' ? 'bg-collector text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            Collector Mode
          </button>
          <button 
            onClick={() => setRole('admin')}
            className={`text-xs font-bold px-3 py-1.5 rounded-full transition-all ${role === 'admin' ? 'bg-gray-800 text-white' : 'bg-white text-gray-400 border border-gray-100'}`}
          >
            Admin Panel
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
