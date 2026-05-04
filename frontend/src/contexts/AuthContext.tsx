import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Role, AuthState } from '../types/auth';

interface AuthContextType extends AuthState {
  login: (email: string, role: Role) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  useEffect(() => {
    // Check for saved token in localStorage
    const savedToken = localStorage.getItem('auth_token');
    const savedUser = localStorage.getItem('auth_user');

    if (savedToken && savedUser) {
      setState({
        user: JSON.parse(savedUser),
        token: savedToken,
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      setState(s => ({ ...s, isLoading: false }));
    }
  }, []);

  const login = async (email: string, role: Role) => {
    setState(s => ({ ...s, isLoading: true }));
    
    // Simulate API call
    setTimeout(() => {
      const mockUser: User = {
        id: 1,
        fullName: email.split('@')[0],
        email: email,
        role: role,
      };
      const mockToken = 'mock-jwt-token';

      localStorage.setItem('auth_token', mockToken);
      localStorage.setItem('auth_user', JSON.stringify(mockUser));

      setState({
        user: mockUser,
        token: mockToken,
        isAuthenticated: true,
        isLoading: false,
      });
    }, 1000);
  };

  const register = async (data: any) => {
    setState(s => ({ ...s, isLoading: true }));
    // Simulate registration
    setTimeout(() => {
      login(data.email, data.role || 'citizen');
    }, 1000);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('auth_user');
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout }}>
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
