import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState, Role } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('cwc_token');
      
      if (savedToken) {
        try {
          const res = await fetch('/api/auth/me', {
            headers: { Authorization: `Bearer ${savedToken}` },
          });
          
          if (res.ok) {
            const data = await res.json();
            const mappedUser: User = {
              id: data.user.id,
              fullName: data.user.full_name,
              email: data.user.email,
              phone: data.user.phone,
              role: data.user.role as Role,
              wardId: data.user.ward_id,
            };
            
            setAuthState({
              user: mappedUser,
              token: savedToken,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            throw new Error('Session expired');
          }
        } catch (e) {
          localStorage.removeItem('cwc_token');
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } else {
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };
    
    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (res.ok) {
      const mappedUser: User = {
        id: data.user.id,
        fullName: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role as Role,
        wardId: data.user.ward_id,
      };
      
      localStorage.setItem('cwc_token', data.token);
      
      setAuthState({
        user: mappedUser,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(data.message || 'Đăng nhập thất bại');
    }
  };

  const register = async (email: string, password: string, fullName: string, role: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        full_name: fullName,
        email,
        password,
        password_confirmation: password, // Simple confirmation
        role: role,
      }),
    });

    const data = await res.json();

    if (res.ok) {
      const mappedUser: User = {
        id: data.user.id,
        fullName: data.user.full_name,
        email: data.user.email,
        phone: data.user.phone,
        role: data.user.role as Role,
        wardId: data.user.ward_id,
      };
      
      localStorage.setItem('cwc_token', data.token);

      setAuthState({
        user: mappedUser,
        token: data.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error(data.message || 'Đăng ký thất bại');
    }
  };

  const logout = () => {
    fetch('/api/auth/logout', {
      method: 'POST',
      headers: { Authorization: `Bearer ${authState.token}` },
    });
    localStorage.removeItem('cwc_token');
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...authState, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
