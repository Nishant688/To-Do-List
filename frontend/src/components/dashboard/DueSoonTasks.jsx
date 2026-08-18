import React from 'react';
import { TaskRow } from '../tasks/TaskRow';
import { TaskRowSkeleton } from '../common/LoadingSkeleton';
import { useTasks } from '../../context/TaskContext';

export const DueSoonTasks = ({ onEditTask }) => {
  const { dueSoonTasks, loading } = useTasks();

  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-slate-900 dark:text-white">
        Due soon
      </h2>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        {loading && dueSoonTasks.length === 0 ? (
          <>
            <TaskRowSkeleton />
            <TaskRowSkeleton />
          </>
        ) : dueSoonTasks.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              No upcoming tasks scheduled for the next 7 days.
            </p>
          </div>
        ) : (
          dueSoonTasks.map((task) => (
            <TaskRow key={task._id} task={task} onEdit={onEditTask} />
          ))
        )}
      </div>
    </div>
  );
};
