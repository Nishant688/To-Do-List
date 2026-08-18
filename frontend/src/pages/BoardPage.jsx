import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { BoardColumn } from '../components/board/BoardColumn';
import { TaskModal } from '../components/tasks/TaskModal';
import { useTasks } from '../context/TaskContext';

export const BoardPage = () => {
  const navigate = useNavigate();
  const { todoTasks, inProgressTasks, doneTasks, loading, updateTaskStatus } = useTasks();

  const [selectedTask, setSelectedTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setIsModalOpen(true);
  };

  const handleCreateNew = () => {
    setSelectedTask(null);
    setIsModalOpen(true);
  };

  const handleTaskDrop = (taskId, targetStatus) => {
    updateTaskStatus(taskId, targetStatus);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header with Switcher and New Task Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Board
          </h1>
          <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Drag cards between columns to update their status
          </p>
        </div>

        {/* View Switcher & Action Button */}
        <div className="flex items-center gap-3">
          {/* List / Board Switcher */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => navigate('/tasks')}
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white cursor-pointer transition-colors"
            >
              List
            </button>
            <button
              type="button"
              className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white cursor-pointer"
            >
              Board
            </button>
          </div>

          {/* New Task Button */}
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

      {/* Kanban Board Columns Grid */}
      <div className="flex flex-col md:flex-row gap-5 overflow-x-auto pb-4 pt-1">
        <BoardColumn
          id="todo"
          title="To Do"
          dotColor="bg-slate-400"
          tasks={todoTasks}
          loading={loading}
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
        />
        <BoardColumn
          id="in_progress"
          title="In Progress"
          dotColor="bg-amber-400"
          tasks={inProgressTasks}
          loading={loading}
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
        />
        <BoardColumn
          id="done"
          title="Done"
          dotColor="bg-emerald-500"
          tasks={doneTasks}
          loading={loading}
          onTaskDrop={handleTaskDrop}
          onEditTask={handleEditTask}
        />
      </div>

      {/* Task Create/Edit Modal */}
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
