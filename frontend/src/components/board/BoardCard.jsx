import React from 'react';
import { PriorityBadge, CategoryBadge, DueDateBadge } from '../common/Badge';

export const BoardCard = ({ task, onEdit, onDragStart }) => {
  const isCompleted = task.status === 'done' || task.completed;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('text/plain', task._id);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(task._id);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onClick={() => onEdit && onEdit(task)}
      className="kanban-card group bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-4 shadow-card hover:shadow-card-hover hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-150 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Title */}
      <h4
        className={`text-sm font-bold tracking-tight mb-1.5 leading-snug ${
          isCompleted
            ? 'line-through text-slate-400 dark:text-slate-500'
            : 'text-slate-900 dark:text-slate-100'
        }`}
      >
        {task.title}
      </h4>

      {/* Description Snippet */}
      {task.description && (
        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3 leading-relaxed">
          {task.description}
        </p>
      )}

      {/* Footer Badges: Priority + Due Date + Category */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <PriorityBadge priority={task.priority} />
        {task.dueDate && (
          <DueDateBadge
            dueDate={task.dueDate}
            completed={isCompleted}
            isBoard={true}
          />
        )}
        <CategoryBadge category={task.category} />
      </div>
    </div>
  );
};
