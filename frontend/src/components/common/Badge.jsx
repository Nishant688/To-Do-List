import React from 'react';
import { getDueStatus } from '../../utils/dateUtils';

// Category Badge (Pastel styling matching reference screenshots)
export const CategoryBadge = ({ category = 'Work' }) => {
  const cat = category.toLowerCase();

  let style = 'bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/40';

  if (cat === 'dev') {
    style = 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60';
  } else if (cat === 'personal') {
    style = 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/40';
  } else if (cat === 'design') {
    style = 'bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400 border border-purple-100 dark:border-purple-900/40';
  }

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium ${style}`}>
      {category}
    </span>
  );
};

// Priority Dot (Red, Amber, Green)
export const PriorityDot = ({ priority = 'medium', className = '' }) => {
  const p = priority.toLowerCase();
  let color = 'bg-amber-400';
  if (p === 'high') color = 'bg-rose-500';
  if (p === 'low') color = 'bg-emerald-500';

  return (
    <span
      className={`inline-block w-2 h-2 rounded-full shrink-0 ${color} ${className}`}
      title={`Priority: ${priority}`}
    />
  );
};

// Priority Badge for Board Cards (e.g. HIGH, MED, LOW)
export const PriorityBadge = ({ priority = 'medium' }) => {
  const p = priority.toLowerCase();

  if (p === 'high') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400">
        HIGH
      </span>
    );
  }

  if (p === 'low') {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400">
        LOW
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wider bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400">
      MED
    </span>
  );
};

// Due Date Badge (e.g. '1 day overdue', 'Today', 'Tomorrow', 'Sun, Jul 19')
export const DueDateBadge = ({ dueDate, completed = false, isBoard = false }) => {
  const status = getDueStatus(dueDate, completed);
  if (!status) return null;

  const text = isBoard ? (status.boardText || status.text) : status.text;

  if (status.isOverdue) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-red-50 text-red-600 dark:bg-red-950/40 dark:text-red-400 border border-red-100 dark:border-red-900/30">
        {text}
      </span>
    );
  }

  if (status.isToday) {
    return (
      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400 border border-blue-100 dark:border-blue-900/30">
        {text}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50">
      {text}
    </span>
  );
};
