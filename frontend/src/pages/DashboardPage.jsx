import React, { useState } from 'react';
import { StatCard } from '../components/dashboard/StatCard';
import { QuickAddTask } from '../components/dashboard/QuickAddTask';
import { TodayTasks } from '../components/dashboard/TodayTasks';
import { DueSoonTasks } from '../components/dashboard/DueSoonTasks';
import { TaskModal } from '../components/tasks/TaskModal';
import { useAuth } from '../context/AuthContext';
import { useTasks } from '../context/TaskContext';
import { formatHeaderDate, getGreeting } from '../utils/dateUtils';

export const DashboardPage = () => {
  const { user } = useAuth();
  const { stats, todayTasks } = useTasks();
  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const dueTodayCount = stats.dueToday ?? todayTasks.length;

  return (
    <div className="space-y-7 animate-in fade-in duration-200">

      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider block mb-1">
            {formatHeaderDate()}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {getGreeting(user?.name || 'Maya')}
          </h1>
        </div>
        <span className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">
          {dueTodayCount} {dueTodayCount === 1 ? 'task' : 'tasks'} due today
        </span>
      </div>

      <QuickAddTask />

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard type="total" count={stats.total} />
        <StatCard type="completed" count={stats.completed} />
        <StatCard type="pending" count={stats.pending} />
        <StatCard type="overdue" count={stats.overdue} />
      </div>

      <TodayTasks onEditTask={handleEditTask} />

      <DueSoonTasks onEditTask={handleEditTask} />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTask(null);
        }}
        taskToEdit={selectedTask}
      />
    </div>
  );
};
