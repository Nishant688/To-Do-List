import React from 'react';
import { AlignLeft, Check, Clock, AlertTriangle } from 'lucide-react';

export const StatCard = ({ type, count = 0 }) => {
  const configs = {
    total: {
      label: 'Total tasks',
      icon: AlignLeft,
      iconBg: 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400',
    },
    completed: {
      label: 'Completed',
      icon: Check,
      iconBg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400',
    },
    pending: {
      label: 'Pending',
      icon: Clock,
      iconBg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400',
    },
    overdue: {
      label: 'Overdue',
      icon: AlertTriangle,
      iconBg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400',
    },
  };

  const config = configs[type] || configs.total;
  const Icon = config.icon;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-5 shadow-card flex flex-col justify-between h-32 transition-all duration-150 hover:border-slate-300 dark:hover:border-slate-700">
      <div className={`w-8 h-8 rounded-lg ${config.iconBg} flex items-center justify-center`}>
        <Icon className="w-4 h-4 stroke-[2.5]" />
      </div>
      <div>
        <span className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1">
          {config.label}
        </span>
        <span className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
          {count}
        </span>
      </div>
    </div>
  );
};
