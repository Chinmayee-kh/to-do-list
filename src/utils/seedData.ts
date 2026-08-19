import type { Task, Category, Folder, Project, Badge, AIInsight, ActivityLog, UserProfile } from '../types';

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-personal', name: 'Personal', color: '#000000', icon: 'Heart', isDefault: true },
  { id: 'cat-work', name: 'Work', color: '#000000', icon: 'Briefcase', isDefault: true },
  { id: 'cat-study', name: 'Study', color: '#000000', icon: 'BookOpen', isDefault: true },
  { id: 'cat-shopping', name: 'Shopping', color: '#000000', icon: 'ShoppingBag', isDefault: true },
  { id: 'cat-fitness', name: 'Wellness', color: '#000000', icon: 'Sparkles', isDefault: false },
];

export const INITIAL_FOLDERS: Folder[] = [
  { id: 'folder-work', name: 'Work & Projects', icon: 'Folder', isExpanded: true },
  { id: 'folder-lifestyle', name: 'Personal Goals', icon: 'FolderHeart', isExpanded: true },
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'proj-website', name: 'Core Project', color: '#000000', icon: 'Layout', folderId: 'folder-work' },
];

export const INITIAL_BADGES: Badge[] = [
  { id: 'badge-first', title: 'First Task', description: 'Completed your very first task', icon: 'Sparkle', category: 'completion' },
  { id: 'badge-streak-7', title: '7-Day Streak', description: 'Maintained a 7-day productivity streak', icon: 'Flame', category: 'streak' },
  { id: 'badge-100', title: '100 Tasks Completed', description: 'Completed 100 total tasks', icon: 'Trophy', category: 'completion' },
  { id: 'badge-master', title: 'Productivity Master', description: 'Reached Level 5 in Task Studio', icon: 'Crown', category: 'mastery' },
  { id: 'badge-early', title: 'Early Bird', description: 'Completed a task before 8:00 AM', icon: 'Sun', category: 'time' },
  { id: 'badge-night', title: 'Night Owl', description: 'Completed a task after 11:00 PM', icon: 'Moon', category: 'time' },
];

export const INITIAL_TASKS: Task[] = [];

export const INITIAL_AI_INSIGHTS: AIInsight[] = [];

export const INITIAL_ACTIVITY_LOGS: ActivityLog[] = [];

export const DEFAULT_USER: UserProfile | null = null;
