export type Priority = 'low' | 'medium' | 'high';

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'document' | 'other';
  size?: string;
}

export interface RecurringSettings {
  frequency: 'none' | 'daily' | 'weekly' | 'monthly' | 'custom';
  intervalDays?: number;
  intervalWeeks?: number;
  repeatOnDays?: number[]; // 0 = Sun, 1 = Mon, etc.
}

export interface ReminderSettings {
  timing: '10m' | '30m' | '1h' | '1d' | 'custom';
  customMinutes?: number;
  isBrowserEnabled: boolean;
  isPopupEnabled: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  richNotes?: string;
  dueDate?: string; // YYYY-MM-DD
  dueTime?: string; // HH:mm
  priority: Priority;
  categoryId: string;
  projectId?: string;
  tags: string[];
  isFavorite: boolean;
  isPinned: boolean;
  isCompleted: boolean;
  completedAt?: string;
  subtasks: Subtask[];
  attachments: Attachment[];
  assignedMembers: string[]; // user IDs or names
  recurring: RecurringSettings;
  reminder?: ReminderSettings;
  kanbanStatus?: 'todo' | 'inprogress' | 'completed';
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string; // Tailwind color or HEX
  icon: string; // Lucide icon name
  isDefault?: boolean;
}

export interface Folder {
  id: string;
  name: string;
  icon?: string;
  isExpanded: boolean;
}

export interface Project {
  id: string;
  name: string;
  color: string;
  icon: string;
  folderId?: string;
  isCollapsed?: boolean;
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'streak' | 'completion' | 'time' | 'mastery';
  unlockedAt?: string;
}

export interface DailyGoal {
  targetTasks: number;
  targetFocusHours: number;
  completedTasksToday: number;
  focusMinutesToday: number;
}

export interface GamificationState {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  dailyGoal: DailyGoal;
  badges: Badge[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  type: 'created' | 'edited' | 'deleted' | 'completed' | 'category' | 'reminder' | 'achievement' | 'level_up';
  description: string;
  icon?: string;
  taskId?: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: 'Owner' | 'Admin' | 'Member';
  isOnline?: boolean;
}

export interface AIInsight {
  id: string;
  title: string;
  content: string;
  type: 'insight' | 'scheduling' | 'breakdown' | 'priority' | 'productivity' | 'recurring';
  createdAt: string;
}

export type ViewMode = 'dashboard' | 'tasks' | 'kanban' | 'calendar' | 'projects' | 'pomodoro' | 'achievements' | 'collaboration';

export type TaskFilterType = 
  | 'all' 
  | 'active' 
  | 'completed' 
  | 'today' 
  | 'upcoming' 
  | 'overdue' 
  | 'favorites' 
  | 'pinned' 
  | 'high' 
  | 'medium' 
  | 'low';

export type TaskSortType = 
  | 'dueDate' 
  | 'priority' 
  | 'alphabetical' 
  | 'recentlyAdded' 
  | 'recentlyUpdated';
