import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { ApiClient } from '../lib/api-client';
import { User, AuthResponse } from '../lib/types';
import { toast } from 'react-hot-toast';
import { AUTH_TOKEN_KEY } from '../lib/config';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = Cookies.get(AUTH_TOKEN_KEY);
        if (token) {
          await refreshUser();
        }
      } finally {
        setIsLoading(false);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user_info, access_token }: AuthResponse = await ApiClient.login(email, password);
      setUser({
        id: user_info.id,
        name: user_info.name,
        email: user_info.email,
        createdAt: (user_info as any).created_at,
      });
      Cookies.set(AUTH_TOKEN_KEY, access_token);
      navigate('/dashboard');
      toast.success('Logged in');
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      await ApiClient.register(name, email, password);
      navigate('/login');
      toast.success('Account created');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await ApiClient.logout();
      setUser(null);
      Cookies.remove(AUTH_TOKEN_KEY);
      navigate('/login');
      toast.success('Logged out');
    } catch (err: any) {
      toast.error(err.message || 'Logout failed');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const current = await ApiClient.getCurrentUser();
      setUser(current);
    } catch (err) {
      setUser(null);
      Cookies.remove(AUTH_TOKEN_KEY);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
