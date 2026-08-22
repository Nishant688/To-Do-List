import React, { useState } from 'react';
import { BoardCard } from './BoardCard';
import { BoardCardSkeleton } from '../common/LoadingSkeleton';

export const BoardColumn = ({
  id,
  title,
  dotColor = 'bg-slate-400',
  tasks = [],
  loading = false,
  onTaskDrop,
  onEditTask,
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (!isOver) setIsOver(true);
  };

  const handleDragLeave = () => {
    setIsOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsOver(false);
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && onTaskDrop) {
      onTaskDrop(taskId, id);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`kanban-column flex-1 min-w-[280px] sm:min-w-[300px] bg-slate-50/70 dark:bg-slate-900/50 border border-slate-200/70 dark:border-slate-800/80 rounded-2xl p-4 flex flex-col transition-colors duration-150 ${isOver ? 'is-over ring-2 ring-brand-400 dark:ring-brand-500' : ''
        }`}
    >

      <div className="flex items-center justify-between mb-4 px-1">
        <div className="flex items-center gap-2.5">
          <span className={`w-2.5 h-2.5 rounded-full ${dotColor}`} />
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 tracking-tight">
            {title}
          </h3>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-400">
          {tasks.length}
        </span>
      </div>

      <div className="flex-1 space-y-3 min-h-[300px] overflow-y-auto">
        {loading && tasks.length === 0 ? (
          <>
            <BoardCardSkeleton />
            <BoardCardSkeleton />
          </>
        ) : tasks.length === 0 ? (
          <div className="h-32 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl flex items-center justify-center text-xs text-slate-400">
            Drop tasks here
          </div>
        ) : (
          tasks.map((task) => (
            <BoardCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
            />
          ))
        )}
      </div>
    </div>
  );
};
