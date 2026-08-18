import React from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export const PreferencesCard = () => {
  const { user, updatePreferences } = useAuth();
  const { showSuccess, showError } = useToast();

  const preferences = user?.preferences || {
    theme: 'light',
    defaultView: 'list',
    weekStartsOn: 'monday',
    emailReminders: true,
  };

  const handlePreferenceChange = async (key, value) => {
    try {
      await updatePreferences({ [key]: value });
      showSuccess('Preference updated');
    } catch (err) {
      showError('Failed to update preference');
    }
  };

  return (
    <div className="space-y-3">
      <h3 className="text-sm font-bold text-slate-900 dark:text-white">
        Preferences
      </h3>

      <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-card divide-y divide-slate-100 dark:divide-slate-800">
        {/* Row 1: Theme */}
        <div className="flex items-center justify-between pb-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Theme
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Dark theme is coming to every screen
            </p>
          </div>
          {/* Segmented Light/Dark Control */}
          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => handlePreferenceChange('theme', 'light')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preferences.theme === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Light
            </button>
            <button
              type="button"
              onClick={() => handlePreferenceChange('theme', 'dark')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                preferences.theme === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              Dark
            </button>
          </div>
        </div>

        {/* Row 2: Default View */}
        <div className="flex items-center justify-between py-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Default view
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              What opens when you click Tasks
            </p>
          </div>
          <div className="relative">
            <select
              value={preferences.defaultView || 'list'}
              onChange={(e) => handlePreferenceChange('defaultView', e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs focus:outline-hidden cursor-pointer"
            >
              <option value="list">List</option>
              <option value="board">Board</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 3: Week Starts On */}
        <div className="flex items-center justify-between py-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Week starts on
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              Affects date pickers and the calendar
            </p>
          </div>
          <div className="relative">
            <select
              value={preferences.weekStartsOn || 'monday'}
              onChange={(e) => handlePreferenceChange('weekStartsOn', e.target.value)}
              className="appearance-none bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2 pr-9 text-xs font-semibold text-slate-700 dark:text-slate-200 shadow-xs focus:outline-hidden cursor-pointer"
            >
              <option value="monday">Monday</option>
              <option value="sunday">Sunday</option>
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Row 4: Email Reminders Toggle */}
        <div className="flex items-center justify-between pt-5">
          <div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Email reminders
            </h4>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
              A morning digest of what's due today
            </p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={preferences.emailReminders}
            onClick={() => handlePreferenceChange('emailReminders', !preferences.emailReminders)}
            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
              preferences.emailReminders ? 'bg-brand-500' : 'bg-slate-200 dark:bg-slate-700'
            }`}
          >
            <span
              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                preferences.emailReminders ? 'translate-x-5' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
