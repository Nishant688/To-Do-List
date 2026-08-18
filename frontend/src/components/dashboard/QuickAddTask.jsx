import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const QuickAddTask = () => {
  const [title, setTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { quickAddTask } = useTasks();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      await quickAddTask(title.trim());
      setTitle('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-2 pl-4 flex items-center gap-3 shadow-card focus-within:border-brand-400 dark:focus-within:border-brand-500 transition-colors"
    >
      <Plus className="w-5 h-5 text-slate-400 shrink-0" />
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a task for today... press Enter to save"
        className="w-full bg-transparent text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden py-2"
        disabled={isSubmitting}
      />
      <button
        type="submit"
        disabled={!title.trim() || isSubmitting}
        className="px-4 py-2 bg-brand-500 hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium text-sm rounded-xl transition-all duration-150 shrink-0 shadow-xs cursor-pointer"
      >
        {isSubmitting ? 'Adding...' : 'Add task'}
      </button>
    </form>
  );
};
