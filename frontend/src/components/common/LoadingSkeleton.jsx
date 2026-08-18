import React from 'react';

export const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card animate-pulse flex flex-col justify-between h-32">
    <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-800" />
    <div className="space-y-2">
      <div className="w-16 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-8 h-6 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
  </div>
);

export const TaskRowSkeleton = () => (
  <div className="flex items-center justify-between p-3.5 border-b border-slate-100 dark:border-slate-800/60 animate-pulse">
    <div className="flex items-center gap-3 w-2/3">
      <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="w-2 h-2 rounded-full bg-slate-200 dark:bg-slate-800" />
      <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
    </div>
    <div className="flex items-center gap-2">
      <div className="w-12 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
      <div className="w-16 h-5 bg-slate-200 dark:bg-slate-800 rounded-md" />
    </div>
  </div>
);

export const BoardCardSkeleton = () => (
  <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl p-4 shadow-card animate-pulse space-y-3">
    <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
    <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-full" />
    <div className="flex items-center gap-2 pt-2">
      <div className="w-10 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
      <div className="w-12 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
    </div>
  </div>
);
