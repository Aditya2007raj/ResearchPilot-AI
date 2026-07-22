import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('rp_auth_token') || null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const userData = await api.getMe();
      setUser(userData);
      return userData;
    } catch {
      localStorage.removeItem('rp_auth_token');
      setToken(null);
      setUser(null);
      return null;
    }
  };

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('rp_auth_token');
      if (storedToken) {
        await refreshUser();
      }
      setIsLoading(false);
    }
    loadUser();
  }, []);

  const login = async (email, password) => {
    const data = await api.login({ email, password });
    localStorage.setItem('rp_auth_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const register = async (fullName, email, password) => {
    const data = await api.register({ full_name: fullName, email, password });
    localStorage.setItem('rp_auth_token', data.access_token);
    setToken(data.access_token);
    setUser(data.user);
    return data;
  };

  const updateUserData = (newUserData) => {
    setUser(newUserData);
  };

  const logout = async () => {
    await api.logout();
    localStorage.removeItem('rp_auth_token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
        updateUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
