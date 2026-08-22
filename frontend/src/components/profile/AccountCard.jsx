import React from 'react';

export const AccountCard = ({
  onChangePassword,
  onLogout,
  onDeleteAccount,
}) => {
  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Account
      </h3>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card divide-y divide-slate-100 dark:divide-slate-800">

        <div className="flex items-center justify-between pb-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Change password
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Last changed 3 months ago
            </p>
          </div>
          <button
            type="button"
            onClick={onChangePassword}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            Change
          </button>
        </div>

        <div className="flex items-center justify-between py-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Log out
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Signs you out on this device only
            </p>
          </div>
          <button
            type="button"
            onClick={onLogout}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 transition-colors shadow-xs cursor-pointer"
          >
            Log out
          </button>
        </div>

        <div className="flex items-center justify-between pt-5">
          <div>
            <h4 className="text-sm font-semibold text-rose-600 dark:text-rose-400">
              Delete account
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Permanently removes your data — no undo
            </p>
          </div>
          <button
            type="button"
            onClick={onDeleteAccount}
            className="px-4 py-2 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 transition-colors shadow-xs cursor-pointer"
          >
            Delete...
          </button>
        </div>
      </div>
    </div>
  );
};
