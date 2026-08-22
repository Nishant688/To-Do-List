import React from 'react';
import { Search, ChevronDown } from 'lucide-react';
import { useTasks } from '../../context/TaskContext';

export const TaskFilterBar = () => {
  const {
    tasks,
    stats,
    filterStatus,
    setFilterStatus,
    filterPriority,
    setFilterPriority,
    sortBy,
    setSortBy,
    searchQuery,
    setSearchQuery,
  } = useTasks();

  const totalCount = stats.total || tasks.length;
  const completedCount = stats.completed || 0;
  const activeCount = Math.max(0, totalCount - completedCount);

  return (
    <div className="space-y-4">

      <div className="flex flex-wrap items-center justify-between gap-3">

        <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === 'all'
                ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === 'active'
                ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Active ({activeCount})
          </button>
          <button
            type="button"
            onClick={() => setFilterStatus('completed')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${filterStatus === 'completed'
                ? 'bg-slate-900 text-white dark:bg-slate-700 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <div className="flex items-center gap-2.5">

          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs focus:outline-hidden cursor-pointer hover:border-slate-300"
            >
              <option value="all">All priorities</option>
              <option value="high">High priority</option>
              <option value="medium">Medium priority</option>
              <option value="low">Low priority</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl px-3.5 py-1.5 pr-8 text-xs font-medium text-slate-700 dark:text-slate-300 shadow-xs focus:outline-hidden cursor-pointer hover:border-slate-300"
            >
              <option value="dueDate">Sort: Due date</option>
              <option value="priority">Sort: Priority</option>
              <option value="title">Sort: Name</option>
              <option value="createdAt">Sort: Created date</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 shadow-xs focus:outline-hidden focus:border-brand-400 transition-colors"
        />
      </div>
    </div>
  );
};
