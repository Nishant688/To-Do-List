// Date helper functions for TaskFlow Mobile

export const getGreeting = (name: string = 'User'): string => {
  const hour = new Date().getHours();
  let timeGreeting = 'Good morning';
  if (hour >= 12 && hour < 17) {
    timeGreeting = 'Good afternoon';
  } else if (hour >= 17 || hour < 5) {
    timeGreeting = 'Good evening';
  }
  const firstName = name.split(' ')[0] || 'User';
  return `${timeGreeting}, ${firstName}`;
};

export const formatHeaderDate = (date: Date = new Date()): string => {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatMemberSince = (date?: string): string => {
  if (!date) return 'Member since March 2026';
  const d = new Date(date);
  return `Member since ${new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(d)}`;
};

export interface DueStatus {
  text: string;
  boardText: string;
  isOverdue: boolean;
  isToday: boolean;
  type: 'overdue' | 'today' | 'tomorrow' | 'future';
}

export const getDueStatus = (dueDate?: string | null, completed: boolean = false): DueStatus | null => {
  if (!dueDate) return null;

  const due = new Date(dueDate);
  const now = new Date();

  // Strip time for pure day difference comparison
  const dueDay = new Date(due.getFullYear(), due.getMonth(), due.getDate());
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  const diffTime = dueDay.getTime() - today.getTime();
  const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

  if (completed) {
    if (diffDays === 0) {
      return { text: 'Today', boardText: 'Today', isOverdue: false, isToday: true, type: 'today' };
    }
    const formatted = new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    }).format(due);
    return { text: formatted, boardText: formatted, isOverdue: false, isToday: false, type: 'future' };
  }

  if (diffDays < 0) {
    const daysOverdue = Math.abs(diffDays);
    return {
      text: daysOverdue === 1 ? '1 day overdue' : `${daysOverdue} days overdue`,
      boardText: `${daysOverdue}d overdue`,
      isOverdue: true,
      isToday: false,
      type: 'overdue',
    };
  }

  if (diffDays === 0) {
    return {
      text: 'Today',
      boardText: 'Today',
      isOverdue: false,
      isToday: true,
      type: 'today',
    };
  }

  if (diffDays === 1) {
    return {
      text: 'Tomorrow',
      boardText: 'Tomorrow',
      isOverdue: false,
      isToday: false,
      type: 'tomorrow',
    };
  }

  const formatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(due);

  const boardFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
  }).format(due);

  return {
    text: formatted,
    boardText: boardFormatted,
    isOverdue: false,
    isToday: false,
    type: 'future',
  };
};

export const formatIsoDateForPicker = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
