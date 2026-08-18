import api from './api';
import { ApiResponse, Task, TaskStats, TaskStatus } from '../types';

export const taskService = {
  // Get all tasks with query params
  getTasks: async (params?: {
    status?: string;
    priority?: string;
    category?: string;
    search?: string;
    view?: string;
    sort?: string;
    order?: string;
  }): Promise<ApiResponse<Task[]>> => {
    const response = await api.get<ApiResponse<Task[]>>('/tasks', { params });
    return response.data;
  },

  // Get calculated dashboard stats
  getStats: async (): Promise<ApiResponse<TaskStats>> => {
    const response = await api.get<ApiResponse<TaskStats>>('/tasks/stats');
    return response.data;
  },

  // Get single task
  getTaskById: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await api.get<ApiResponse<Task>>(`/tasks/${id}`);
    return response.data;
  },

  // Create task
  createTask: async (taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    const response = await api.post<ApiResponse<Task>>('/tasks', taskData);
    return response.data;
  },

  // Update full task
  updateTask: async (id: string, taskData: Partial<Task>): Promise<ApiResponse<Task>> => {
    const response = await api.put<ApiResponse<Task>>(`/tasks/${id}`, taskData);
    return response.data;
  },

  // Update status (e.g. for Kanban board transitions)
  updateStatus: async (id: string, status: TaskStatus, order?: number): Promise<ApiResponse<Task>> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/status`, { status, order });
    return response.data;
  },

  // Toggle complete checkbox
  toggleComplete: async (id: string): Promise<ApiResponse<Task>> => {
    const response = await api.patch<ApiResponse<Task>>(`/tasks/${id}/complete`);
    return response.data;
  },

  // Delete task
  deleteTask: async (id: string): Promise<ApiResponse<{ id: string }>> => {
    const response = await api.delete<ApiResponse<{ id: string }>>(`/tasks/${id}`);
    return response.data;
  },
};
