import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { taskService } from '../services/taskService';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { getDueStatus } from '../utils/dateUtils';

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { showSuccess, showError } = useToast();

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    dueToday: 0,
    dueSoon: 0,
  });
  const [loading, setLoading] = useState(false);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState('all'); // 'all' | 'active' | 'completed'
  const [filterPriority, setFilterPriority] = useState('all'); // 'all' | 'low' | 'medium' | 'high'
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate'); // 'dueDate' | 'priority' | 'title' | 'createdAt'

  // Fetch all tasks and stats
  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;
    try {
      setLoading(true);
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
      console.error('[Tasks] Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0, overdue: 0, dueToday: 0, dueSoon: 0 });
    }
  }, [isAuthenticated, fetchTasks]);

  // Create Task
  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success && res.data) {
        setTasks((prev) => [res.data, ...prev]);
        showSuccess('Task created successfully');
        // Refresh stats
        taskService.getStats().then((s) => s.success && setStats(s.data));
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task';
      showError(msg);
      throw err;
    }
  };

  // Quick Add Task (for Dashboard)
  const quickAddTask = async (title) => {
    if (!title || !title.trim()) return;
    return createTask({
      title: title.trim(),
      dueDate: new Date(),
      status: 'todo',
      priority: 'medium',
      category: 'Work',
    });
  };

  // Update Task
  const updateTask = async (id, taskData) => {
    try {
      const res = await taskService.updateTask(id, taskData);
      if (res.success && res.data) {
        setTasks((prev) => prev.map((t) => (t._id === id ? res.data : t)));
        showSuccess('Task updated successfully');
        taskService.getStats().then((s) => s.success && setStats(s.data));
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to update task';
      showError(msg);
      throw err;
    }
  };

  // Update Status (Kanban Drag and Drop)
  const updateTaskStatus = async (id, newStatus) => {
    // Optimistic UI update
    const previousTasks = [...tasks];
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
      // Rollback
      setTasks(previousTasks);
      showError('Failed to move task');
    }
  };

  // Toggle Complete (Checkbox)
  const toggleTaskComplete = async (id) => {
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
      showError('Failed to update task');
    }
  };

  // Delete Task
  const deleteTask = async (id) => {
    const previousTasks = [...tasks];
    setTasks((prev) => prev.filter((t) => t._id !== id));

    try {
      const res = await taskService.deleteTask(id);
      if (res.success) {
        showSuccess('Task deleted');
        taskService.getStats().then((s) => s.success && setStats(s.data));
      }
    } catch (err) {
      setTasks(previousTasks);
      showError('Failed to delete task');
    }
  };

  // Derived: Filtered & Sorted Tasks for Tasks Page
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

        // Search filter
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
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        if (sortBy === 'priority') {
          const map = { high: 3, medium: 2, low: 1 };
          return (map[b.priority] || 0) - (map[a.priority] || 0);
        }
        if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        }
        if (sortBy === 'createdAt') {
          return new Date(b.createdAt) - new Date(a.createdAt);
        }
        return 0;
      });
  }, [tasks, filterStatus, filterPriority, searchQuery, sortBy]);

  // Derived: Dashboard "Today" Tasks
  // Tasks due today, or overdue tasks that are not done, or tasks marked completed today
  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {
      const status = getDueStatus(task.dueDate, task.completed);
      if (!status) return false;
      return status.isToday || status.isOverdue;
    });
  }, [tasks]);

  // Derived: Dashboard "Due Soon" Tasks
  // Tasks due in future days (tomorrow, etc.)
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
        fetchTasks,
        createTask,
        quickAddTask,
        updateTask,
        updateTaskStatus,
        toggleTaskComplete,
        deleteTask,
        // Filters
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
        // Lists
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

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
