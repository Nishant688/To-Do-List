import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { Task, TaskStats, TaskStatus, TaskPriority } from '../types';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { getDueStatus } from '../utils/dateUtils';

interface TaskContextType {
  tasks: Task[];
  stats: TaskStats;
  loading: boolean;
  refreshing: boolean;
  fetchTasks: () => Promise<void>;
  createTask: (taskData: Partial<Task>) => Promise<Task>;
  quickAddTask: (title: string) => Promise<Task | undefined>;
  updateTask: (id: string, taskData: Partial<Task>) => Promise<Task>;
  updateTaskStatus: (id: string, status: TaskStatus) => Promise<void>;
  toggleTaskComplete: (id: string) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
  
  // Filters & Search
  filterStatus: 'all' | 'active' | 'completed';
  setFilterStatus: (status: 'all' | 'active' | 'completed') => void;
  filterPriority: string;
  setFilterPriority: (priority: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  sortBy: 'dueDate' | 'priority' | 'title' | 'createdAt';
  setSortBy: (sort: 'dueDate' | 'priority' | 'title' | 'createdAt') => void;

  // Derived lists
  filteredTasks: Task[];
  todayTasks: Task[];
  dueSoonTasks: Task[];
  todoTasks: Task[];
  inProgressTasks: Task[];
  doneTasks: Task[];
}

const initialStats: TaskStats = {
  total: 0,
  completed: 0,
  pending: 0,
  overdue: 0,
  dueToday: 0,
  dueSoon: 0,
};

const TaskContext = createContext<TaskContextType | null>(null);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>(initialStats);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Filters & Search
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed'>('all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title' | 'createdAt'>('dueDate');

  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setRefreshing(true);
      const [tasksRes, statsRes] = await Promise.all([
        taskService.getTasks(),
        taskService.getStats(),
      ]);

      if (tasksRes.success) {
        setTasks(tasksRes.data);
      }
      if (statsRes.success) {
        setStats(statsRes.data);
      }
    } catch (err) {
      console.error('[Tasks] Error loading tasks & stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      fetchTasks();
    } else {
      setTasks([]);
      setStats(initialStats);
    }
  }, [isAuthenticated, fetchTasks]);

  const createTask = async (taskData: Partial<Task>): Promise<Task> => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success && res.data) {
        setTasks((prev) => [res.data, ...prev]);
        taskService.getStats().then((s) => s.success && setStats(s.data));
        return res.data;
      }
      throw new Error(res.message || 'Failed to create task');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task';
      throw new Error(msg);
    }
  };

  const quickAddTask = async (title: string): Promise<Task | undefined> => {
    if (!title || !title.trim()) return;
    return createTask({
      title: title.trim(),
      dueDate: new Date().toISOString(),
      status: 'todo',
      priority: 'medium',
      category: 'Work',
    });
  };

  const updateTask = async (id: string, taskData: Partial<Task>): Promise<Task> => {
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        taskService.getStats().then((s) => s.success && setStats(s.data));
        return res.data;
      }
      throw new Error(res.message || 'Failed to update task');
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task';
      throw new Error(msg);
    }
  };

  const updateTaskStatus = async (id: string, newStatus: TaskStatus): Promise<void> => {
    const previousTasks = [...tasks];
    // Optimistic UI update
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === id) {
          return {
            ...t,
            status: newStatus,
            completed: newStatus === 'done',
          };
        }
        return t;
      })
    );

    try {
      const res = await taskService.updateStatus(id, newStatus);
      if (res.success && res.data) {
        taskService.getStats().then((s) => s.success && setStats(s.data));
      }
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  const toggleTaskComplete = async (id: string): Promise<void> => {
    const previousTasks = [...tasks];
    setTasks((prev) =>
      prev.map((t) => {
        if (t._id === id) {
          const nextCompleted = !t.completed;
          return {
            ...t,
            completed: nextCompleted,
            status: nextCompleted ? 'done' : 'todo',
          };
        }
        return t;
      })
    );

    try {
      const res = await taskService.toggleComplete(id);
      if (res.success && res.data) {
        taskService.getStats().then((s) => s.success && setStats(s.data));
      }
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  const deleteTask = async (id: string): Promise<void> => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      const res = await taskService.deleteTask(id);
      if (res.success) {
        taskService.getStats().then((s) => s.success && setStats(s.data));
      }
    } catch (err) {
      setTasks(previousTasks);
      throw err;
    }
  };

  // Derived: Filtered and Sorted Tasks
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (filterStatus === 'active') {
          if (task.completed || task.status === 'done') return false;
        } else if (filterStatus === 'completed') {
          if (!task.completed && task.status !== 'done') return false;
        }

        // Priority filter
        if (filterPriority !== 'all' && filterPriority !== 'All priorities') {
          if (task.priority?.toLowerCase() !== filterPriority.toLowerCase()) return false;
        }

        // Category filter
        if (filterCategory !== 'all' && filterCategory !== 'All categories') {
          if (task.category?.toLowerCase() !== filterCategory.toLowerCase()) return false;
        }

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = task.title?.toLowerCase().includes(q);
          const matchDesc = task.description?.toLowerCase().includes(q);
          const matchCat = task.category?.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchCat) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'dueDate') {
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
        if (sortBy === 'priority') {
          const map: Record<TaskPriority, number> = { high: 3, medium: 2, low: 1 };
          return (map[b.priority] || 0) - (map[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        return 0;
      });
  }, [tasks, filterStatus, filterPriority, filterCategory, searchQuery, sortBy]);

  // Derived: Today's Tasks
  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {
      const status = getDueStatus(task.dueDate, task.completed);
      if (!status) return false;
      return status.isToday || status.isOverdue;
    });
  }, [tasks]);

  // Derived: Due Soon Tasks (Tomorrow & future 7 days)
  const dueSoonTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.completed || task.status === 'done') return false;
      const status = getDueStatus(task.dueDate, task.completed);
      if (!status) return false;
      return status.type === 'tomorrow' || status.type === 'future';
    });
  }, [tasks]);

  // Derived: Board columns
  const todoTasks = useMemo(() => tasks.filter((t) => t.status === 'todo'), [tasks]);
  const inProgressTasks = useMemo(() => tasks.filter((t) => t.status === 'in_progress'), [tasks]);
  const doneTasks = useMemo(() => tasks.filter((t) => t.status === 'done' || t.completed), [tasks]);

  return (
    <TaskContext.Provider
      value={{
        tasks,
        stats,
        loading,
        refreshing,
        fetchTasks,
        createTask,
        quickAddTask,
        updateTask,
        updateTaskStatus,
        toggleTaskComplete,
        deleteTask,
        filterStatus,
        setFilterStatus,
        filterPriority,
        setFilterPriority,
        filterCategory,
        setFilterCategory,
        searchQuery,
        setSearchQuery,
        sortBy,
        setSortBy,
        filteredTasks,
        todayTasks,
        dueSoonTasks,
        todoTasks,
        inProgressTasks,
        doneTasks,
      }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
