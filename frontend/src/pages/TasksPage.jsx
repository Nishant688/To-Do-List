import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { TaskFilterBar } from '../components/tasks/TaskFilterBar';
import { TaskRow } from '../components/tasks/TaskRow';
import { TaskModal } from '../components/tasks/TaskModal';
import { TaskRowSkeleton } from '../components/common/LoadingSkeleton';
import { useTasks } from '../context/TaskContext';

export const TasksPage = () => {
  const navigate = useNavigate();
  const { tasks, stats, filteredTasks, loading } = useTasks();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const totalCount = stats.total || tasks.length;
  const completedCount = stats.completed || 0;

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Tasks
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            {totalCount} {totalCount === 1 ? 'task' : 'tasks'} · {completedCount} completed
          </p>
        </div>

        <div className="flex items-center gap-3">

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white cursor-pointer"
            >
              List
            </button>
            <button
              type="button"
              onClick={() => navigate('/board')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
            >
              Board
            </button>
          </div>

          <button
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-1.5 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs sm:text-sm font-semibold rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>New task</span>
          </button>
        </div>
      </div>

      <TaskFilterBar />

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-card overflow-hidden">
        {loading && filteredTasks.length === 0 ? (
          <>
            <TaskRowSkeleton />
            <TaskRowSkeleton />
            <TaskRowSkeleton />
            <TaskRowSkeleton />
            <TaskRowSkeleton />
          </>
        ) : filteredTasks.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
              No tasks found
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => (
            <TaskRow key={task._id} task={task} onEdit={handleEditTask} />
          ))
        )}
      </div>

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
