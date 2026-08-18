import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, UserPreferences } from '../types';
import { authService } from '../services/authService';
import { userService } from '../services/userService';
import {
  STORAGE_TOKEN_KEY,
  STORAGE_USER_KEY,
  setOnUnauthorizedCallback,
} from '../services/api';
import { useTheme } from './ThemeContext';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (credentials: { email: string; password: string }) => Promise<User>;
  register: (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }) => Promise<User>;
  logout: () => Promise<void>;
  updateProfile: (data: { name?: string; email?: string; avatar?: string }) => Promise<User>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<UserPreferences>;
  updatePassword: (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword?: string;
  }) => Promise<void>;
  deleteAccount: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const { syncWithUserPreference } = useTheme();

  // Handle 401 callback from Axios
  useEffect(() => {
    setOnUnauthorizedCallback(() => {
      setUser(null);
      setToken(null);
    });
  }, []);

  // Check stored token and load user on startup
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(STORAGE_USER_KEY);

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            const parsedUser = JSON.parse(storedUser) as User;
            setUser(parsedUser);
            syncWithUserPreference(parsedUser.preferences?.theme);
          }

          // Validate token and get latest user data from server
          try {
            const res = await authService.getMe();
            if (res.success && res.data) {
              setUser(res.data);
              await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data));
              syncWithUserPreference(res.data.preferences?.theme);
            }
          } catch (apiErr) {
            console.warn('[Auth] Token validation error on startup:', apiErr);
          }
        }
      } catch (err) {
        console.error('[Auth] Error during initialization:', err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }): Promise<User> => {
    const res = await authService.login(credentials);
    if (res.success && res.data) {
      const { token: userToken, ...userData } = res.data;
      setUser(userData as User);
      setToken(userToken);
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, userToken);
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userData));
      syncWithUserPreference(userData.preferences?.theme);
      return userData as User;
    }
    throw new Error(res.message || 'Login failed');
  };

  const register = async (userData: {
    name: string;
    email: string;
    password: string;
    confirmPassword?: string;
  }): Promise<User> => {
    const res = await authService.register(userData);
    if (res.success && res.data) {
      const { token: userToken, ...userObj } = res.data;
      setUser(userObj as User);
      setToken(userToken);
      await AsyncStorage.setItem(STORAGE_TOKEN_KEY, userToken);
      await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(userObj));
      syncWithUserPreference(userObj.preferences?.theme);
      return userObj as User;
    }
    throw new Error(res.message || 'Registration failed');
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // ignore
    } finally {
      setUser(null);
      setToken(null);
      await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
      await AsyncStorage.removeItem(STORAGE_USER_KEY);
    }
  };

  const updateProfile = async (data: {
    name?: string;
    email?: string;
    avatar?: string;
  }): Promise<User> => {
    const res = await userService.updateProfile(data);
    if (res.success && res.data) {
      setUser((prev) => {
        const updated = { ...(prev as User), ...res.data };
        AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
        return updated;
      });
      return res.data;
    }
    throw new Error(res.message || 'Failed to update profile');
  };

  const updatePreferences = async (
    preferences: Partial<UserPreferences>
  ): Promise<UserPreferences> => {
    const res = await userService.updatePreferences(preferences);
    if (res.success && res.data) {
      setUser((prev) => {
        if (!prev) return null;
        const updated = { ...prev, preferences: res.data };
        AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(updated));
        return updated;
      });
      syncWithUserPreference(res.data.theme);
      return res.data;
    }
    throw new Error(res.message || 'Failed to update preferences');
  };

  const updatePassword = async (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword?: string;
  }) => {
    const res = await userService.updatePassword(passwords);
    if (!res.success) {
      throw new Error(res.message || 'Failed to change password');
    }
  };

  const deleteAccount = async () => {
    await userService.deleteAccount();
    await logout();
  };

  const refreshUser = async () => {
    try {
      const res = await authService.getMe();
      if (res.success && res.data) {
        setUser(res.data);
        await AsyncStorage.setItem(STORAGE_USER_KEY, JSON.stringify(res.data));
      }
    } catch (e) {
      console.warn('Failed to refresh user profile', e);
    }
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
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
