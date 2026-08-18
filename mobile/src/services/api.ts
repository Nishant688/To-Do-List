import axios, { AxiosError } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const STORAGE_TOKEN_KEY = 'taskflow_mobile_token';
const STORAGE_USER_KEY = 'taskflow_mobile_user';
const STORAGE_API_URL_KEY = 'taskflow_mobile_custom_api_url';

// Default API URL resolution
const getDefaultApiUrl = (): string => {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }
  // Local network IP of host machine for physical device testing
  const localNetworkUrl = 'http://192.168.11.125:5000/api';
  
  if (Platform.OS === 'android') {
    // 10.0.2.2 is the special alias to host loopback interface on Android emulator
    return localNetworkUrl;
  }
  return localNetworkUrl;
};

export const API_BASE_URL = getDefaultApiUrl();

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Event listener callback for 401 unauthenticated
let onUnauthorizedCallback: (() => void) | null = null;
export const setOnUnauthorizedCallback = (cb: () => void) => {
  onUnauthorizedCallback = cb;
};

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  async (config) => {
    try {
      // Check if user set a custom API URL override
      const customUrl = await AsyncStorage.getItem(STORAGE_API_URL_KEY);
      if (customUrl && config.baseURL !== customUrl) {
        config.baseURL = customUrl;
      }
      
      const token = await AsyncStorage.getItem(STORAGE_TOKEN_KEY);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (e) {
      console.warn('[API] Failed to retrieve token from storage', e);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Handle 401 and parse errors
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<{ message?: string }>) => {
    if (error.response?.status === 401) {
      try {
        await AsyncStorage.removeItem(STORAGE_TOKEN_KEY);
        await AsyncStorage.removeItem(STORAGE_USER_KEY);
      } catch {
        // ignore
      }
      if (onUnauthorizedCallback) {
        onUnauthorizedCallback();
      }
    }
    return Promise.reject(error);
  }
);

export { STORAGE_TOKEN_KEY, STORAGE_USER_KEY, STORAGE_API_URL_KEY };
export default api;
