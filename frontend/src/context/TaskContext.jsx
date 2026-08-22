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

  const [filterStatus, setFilterStatus] = useState('all'); 
  const [filterPriority, setFilterPriority] = useState('all'); 
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('dueDate'); 

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

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]);
      setStats({ total: 0, completed: 0, pending: 0, overdue: 0, dueToday: 0, dueSoon: 0 });
    }
  }, [isAuthenticated, fetchTasks]);

  const createTask = async (taskData) => {
    try {
      const res = await taskService.createTask(taskData);
      if (res.success && res.data) {
        setTasks((prev) => [res.data, ...prev]);
        showSuccess('Task created successfully');

        taskService.getStats().then((s) => s.success && setStats(s.data));
        return res.data;
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to create task';
      showError(msg);
      throw err;
    }
  };

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

  const updateTaskStatus = async (id, newStatus) => {

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

      setTasks(previousTasks);
      showError('Failed to move task');
    }
  };

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

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {

        if (filterStatus === 'active') {
          if (task.completed || task.status === 'done') return false;
        } else if (filterStatus === 'completed') {
          if (!task.completed && task.status !== 'done') return false;
        }

        if (filterPriority !== 'all' && filterPriority !== 'All priorities') {
          if (task.priority?.toLowerCase() !== filterPriority.toLowerCase()) return false;
        }

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

  const todayTasks = useMemo(() => {
    return tasks.filter((task) => {
      const status = getDueStatus(task.dueDate, task.completed);
      if (!status) return false;
      return status.isToday || status.isOverdue;
    });
  }, [tasks]);

  const dueSoonTasks = useMemo(() => {
    return tasks.filter((task) => {
      if (task.completed || task.status === 'done') return false;
      const status = getDueStatus(task.dueDate, task.completed);
      if (!status) return false;
      return status.type === 'tomorrow' || status.type === 'future';
    });
  }, [tasks]);

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

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
