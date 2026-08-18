import api from './api';
import { ApiResponse, User, UserPreferences } from '../types';

export const userService = {
  // Get user profile
  getProfile: async (): Promise<ApiResponse<User>> => {
    const response = await api.get<ApiResponse<User>>('/users/profile');
    return response.data;
  },

  // Update profile info
  updateProfile: async (data: { name?: string; email?: string; avatar?: string }): Promise<ApiResponse<User>> => {
    const response = await api.put<ApiResponse<User>>('/users/profile', data);
    return response.data;
  },

  // Change password
  updatePassword: async (passwords: {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword?: string;
  }): Promise<ApiResponse<null>> => {
    const response = await api.put<ApiResponse<null>>('/users/password', passwords);
    return response.data;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<ApiResponse<UserPreferences>> => {
    const response = await api.put<ApiResponse<UserPreferences>>('/users/preferences', preferences);
    return response.data;
  },

  // Delete account
  deleteAccount: async (): Promise<ApiResponse<null>> => {
    const response = await api.delete<ApiResponse<null>>('/users/account');
    return response.data;
  },
};
