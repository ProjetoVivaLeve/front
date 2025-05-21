import React, { createContext, useState, useContext, useEffect } from 'react';
import { User, UserRole } from '@/types';
import { publicApi } from '@/api';
import { getToken, setToken, clearToken, setUserData, getUserData, clearUserData } from '@/storage'

type AuthContextType = {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = getToken();
    const userData = getUserData();
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        console.error('Erro ao carregar usuário');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await publicApi.post('/auth/login', { email, password });

      const token = response.data.token;

      const decoded: User = JSON.parse(atob(token.split('.')[1]));

      setToken(token);

      setUserData(JSON.stringify(decoded));

      setUser(decoded);

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao fazer login');

      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, role: UserRole): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await publicApi.post('/auth/register', { name, email, password, role });

      return true;
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao registrar usuário');

      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearToken();
    clearUserData();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, error, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
}
