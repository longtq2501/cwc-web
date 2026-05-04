import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, AuthState } from '../types/auth';

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
    const savedUser = localStorage.getItem('cwc_user');
    const savedToken = localStorage.getItem('cwc_token');
    
    if (savedUser && savedToken) {
      setAuthState({
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const login = async (email: string, password: string) => {
    // Simulating API call
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Get users from localStorage
    const users = JSON.parse(localStorage.getItem('cwc_registered_users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);

    if (foundUser) {
      const { password, ...userWithoutPassword } = foundUser;
      const mockToken = 'mock-jwt-token-' + Math.random();
      
      localStorage.setItem('cwc_user', JSON.stringify(userWithoutPassword));
      localStorage.setItem('cwc_token', mockToken);
      
      setAuthState({
        user: userWithoutPassword,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      throw new Error('Email hoặc mật khẩu không chính xác.');
    }
  };

  const register = async (email: string, password: string, fullName: string, role: any) => {
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if email already exists
    const users = JSON.parse(localStorage.getItem('cwc_registered_users') || '[]');
    if (users.some((u: any) => u.email === email)) {
      throw new Error('Email này đã được đăng ký.');
    }

    const newUser = {
      id: Math.random().toString(36).substr(2, 9),
      email,
      password, // In real app, never store plain text
      fullName,
      role,
      avatarUrl: '',
    };

    // Save to the "database" of users
    users.push(newUser);
    localStorage.setItem('cwc_registered_users', JSON.stringify(users));

    // Also auto-login the user after registration
    const { password: _, ...userWithoutPassword } = newUser;
    const mockToken = 'mock-jwt-token-' + Math.random();
    
    localStorage.setItem('cwc_user', JSON.stringify(userWithoutPassword));
    localStorage.setItem('cwc_token', mockToken);

    setAuthState({
      user: userWithoutPassword,
      token: mockToken,
      isAuthenticated: true,
      isLoading: false,
    });
  };

  const logout = () => {
    localStorage.removeItem('cwc_user');
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
