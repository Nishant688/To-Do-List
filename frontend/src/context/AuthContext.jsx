import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('taskflow_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('taskflow_token') || null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const theme = user?.preferences?.theme || 'light';
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user?.preferences?.theme]);

  useEffect(() => {
    const loadUser = async () => {
      const storedToken = localStorage.getItem('taskflow_token');
      if (storedToken) {
        try {
          const res = await authService.getMe();
          if (res.success && res.data) {
            setUser(res.data);
            localStorage.setItem('taskflow_user', JSON.stringify(res.data));
          }
        } catch (err) {
          console.error('[Auth] Failed to load current user:', err);
          logout();
        }
      }
      setLoading(false);
    };

    loadUser();

    const handleAuthError = () => {
      setUser(null);
      setToken(null);
    };
    window.addEventListener('taskflow_auth_error', handleAuthError);
    return () => window.removeEventListener('taskflow_auth_error', handleAuthError);
  }, []);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('taskflow_token', res.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData) => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      setUser(res.data);
      setToken(res.data.token);
      localStorage.setItem('taskflow_token', res.data.token);
      localStorage.setItem('taskflow_user', JSON.stringify(res.data));
      return res.data;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {

    } finally {
      setUser(null);
      setToken(null);
      localStorage.removeItem('taskflow_token');
      localStorage.removeItem('taskflow_user');
      document.documentElement.classList.remove('dark');
    }
  };

  const updateProfile = async (data) => {
    const res = await userService.updateProfile(data);
    if (res.success && res.data) {
      setUser((prev) => ({ ...prev, ...res.data }));
      localStorage.setItem('taskflow_user', JSON.stringify({ ...user, ...res.data }));
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const updatePreferences = async (preferences) => {
    const res = await userService.updatePreferences(preferences);
    if (res.success && res.data) {
      setUser((prev) => {
        const updated = { ...prev, preferences: res.data };
        localStorage.setItem('taskflow_user', JSON.stringify(updated));
        return updated;
      });
      return res.data;
    }
    throw new Error(res.message || 'Failed to update preferences');
  };

  const updatePassword = async (passwords) => {
    const res = await userService.updatePassword(passwords);
    return res;
  };

  const deleteAccount = async () => {
    await userService.deleteAccount();
    logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        login,
        register,
        logout,
        updateProfile,
        updatePreferences,
        updatePassword,
        deleteAccount,
      }}
    >
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
