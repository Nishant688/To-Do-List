import React from 'react';
import { Link } from 'react-router-dom';
import { TaskRow } from '../tasks/TaskRow';
import { TaskRowSkeleton } from '../common/LoadingSkeleton';
import { useTasks } from '../../context/TaskContext';

export const TodayTasks = ({ onEditTask }) => {
  const { todayTasks, loading } = useTasks();

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-slate-900 dark:text-white">
          Today
        </h2>
        <Link
          to="/tasks"
          className="text-xs font-semibold text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 transition-colors"
        >
          View all tasks
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        {loading && todayTasks.length === 0 ? (
          <>
            <TaskRowSkeleton />
            <TaskRowSkeleton />
            <TaskRowSkeleton />
          </>
        ) : todayTasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No tasks due today. You're all caught up!
            </p>
          </div>
        ) : (
          todayTasks.map((task) => (
            <TaskRow key={task._id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>
    </div>
  );
};
