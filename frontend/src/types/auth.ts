export type Role = 'citizen' | 'collector' | 'enterprise' | 'admin';

export interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  role: Role;
  avatarUrl?: string;
  wardId?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
