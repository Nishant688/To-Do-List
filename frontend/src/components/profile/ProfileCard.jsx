import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { formatMemberSince } from '../../utils/dateUtils';

export const ProfileCard = ({ onEditProfile }) => {
  const { user } = useAuth();

  const initials = user?.name
    ? user.name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
    : 'MC';

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">

        <div className="w-16 h-16 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 font-bold text-xl flex items-center justify-center shrink-0 border-2 border-brand-200/60 dark:border-brand-800/60 shadow-xs">
          {initials}
        </div>

        <div>
          <h2 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight">
            {user?.name || 'Maya Chen'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {user?.email || 'maya.chen@example.com'}
          </p>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {formatMemberSince(user?.createdAt)}
          </p>
        </div>
      </div>

      <button
        type="button"
        onClick={onEditProfile}
        className="self-start sm:self-center px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
      >
        Edit profile
      </button>
    </div>
  );
};
