import React, { useState } from 'react';
import { Trash2 } from 'lucide-react';
import { PriorityDot, CategoryBadge, DueDateBadge } from '../common/Badge';
import { ConfirmModal } from '../common/ConfirmModal';
import { useTasks } from '../../context/TaskContext';

export const TaskRow = ({ task, onEdit }) => {
  const { toggleTaskComplete, deleteTask } = useTasks();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isCompleted = task.completed || task.status === 'done';

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
    toggleTaskComplete(task._id);
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteTask(task._id);
    setShowDeleteConfirm(false);
    setIsDeleting(false);
  };

  return (
    <>
      <div
        onClick={() => onEdit && onEdit(task)}
        className="group flex items-center justify-between px-4 py-3.5 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800/60 last:border-b-0 transition-colors cursor-pointer"
      >

        <div className="flex items-center gap-3 min-w-0 pr-4">

          <button
            type="button"
            onClick={handleCheckboxClick}
            className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors shrink-0 ${isCompleted
                ? 'bg-brand-500 border-brand-500 text-white'
                : 'border-slate-300 dark:border-slate-600 hover:border-brand-400 bg-white dark:bg-slate-900'
              }`}
            aria-label={isCompleted ? 'Mark task as active' : 'Mark task as complete'}
          >
            {isCompleted && (
              <svg
                className="w-2.5 h-2.5 stroke-[3]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  d="M5 13l4 4L19 7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>

          <PriorityDot
            priority={task.priority}
            className={isCompleted ? 'opacity-40' : ''}
          />

          <span
            className={`text-sm font-medium truncate transition-colors ${isCompleted
                ? 'line-through text-slate-400 dark:text-slate-500'
                : 'text-slate-800 dark:text-slate-200'
              }`}
          >
            {task.title}
          </span>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <CategoryBadge category={task.category} />
          <DueDateBadge dueDate={task.dueDate} completed={isCompleted} />

          <button
            type="button"
            onClick={handleDeleteClick}
            className="p-1 text-slate-300 hover:text-rose-600 dark:text-slate-600 dark:hover:text-rose-400 rounded-md transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Delete task"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <ConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Task"
        message={`Are you sure you want to permanently delete "${task.title}"?`}
        confirmText="Delete"
        loading={isDeleting}
      />
    </>
  );
};
