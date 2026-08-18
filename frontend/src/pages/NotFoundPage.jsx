import React from 'react';
import { Link } from 'react-router-dom';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <div className="w-16 h-16 rounded-2xl bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center text-2xl font-bold mb-4">
        404
      </div>
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">
        Page Not Found
      </h1>
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/dashboard"
        className="mt-6 px-4 py-2 bg-brand-500 hover:bg-brand-600 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
      >
        Back to Dashboard
      </Link>
    </div>
  );
};
