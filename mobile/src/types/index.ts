// TypeScript interfaces and types for TaskFlow Mobile

export interface UserPreferences {
  theme: 'light' | 'dark';
  defaultView: 'list' | 'board';
  weekStartsOn: 'monday' | 'sunday';
  emailReminders: boolean;
}

export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  plan?: string;
  preferences: UserPreferences;
  createdAt: string;
  updatedAt?: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'done';
export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  _id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  category: string;
  dueDate: string | null;
  userId: string;
  completed: boolean;
  order: number;
  createdAt: string;
  updatedAt?: string;
}

export interface TaskStats {
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  dueToday: number;
  dueSoon: number;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  data: User & { token: string };
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  count?: number;
  data: T;
}

// Navigation types
export type RootStackParamList = {
  Auth: undefined;
  Main: undefined;
  TaskDetail: { taskId: string };
  CreateTask: { initialDate?: string; initialCategory?: string };
  EditTask: { taskId: string };
  EditProfile: undefined;
  ChangePassword: undefined;
};

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type MainTabParamList = {
  Dashboard: undefined;
  Tasks: undefined;
  Board: undefined;
  Profile: undefined;
};
