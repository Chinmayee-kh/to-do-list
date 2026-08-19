import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { 
  Task, Category, Folder, Project, GamificationState, 
  ActivityLog, AIInsight, UserProfile, ViewMode, TaskFilterType, 
  TaskSortType 
} from '../types';
import { 
  INITIAL_TASKS, INITIAL_CATEGORIES, INITIAL_FOLDERS, 
  INITIAL_PROJECTS, INITIAL_BADGES, INITIAL_AI_INSIGHTS, 
  INITIAL_ACTIVITY_LOGS, DEFAULT_USER 
} from '../utils/seedData';
import { 
  XP_PER_TASK, XP_PER_SUBTASK, triggerConfetti, 
  triggerLevelUpConfetti, getLevelTitle 
} from '../utils/helpers';

interface AppState {
  // User & Auth
  currentUser: UserProfile | null;
  isDemoMode: boolean;
  theme: 'light' | 'dark';
  
  // UI Navigation & Filters
  activeView: ViewMode;
  searchQuery: string;
  selectedCategoryFilter: string | null;
  selectedProjectFilter: string | null;
  taskFilter: TaskFilterType;
  taskSort: TaskSortType;
  
  // Modals & Panels
  isAiPanelOpen: boolean;
  isTaskModalOpen: boolean;
  editingTask: Task | null;
  isAuthModalOpen: boolean;
  
  // Core Entities
  tasks: Task[];
  categories: Category[];
  folders: Folder[];
  projects: Project[];
  gamification: GamificationState;
  activityLogs: ActivityLog[];
  aiInsights: AIInsight[];
  
  // Pomodoro Timer State
  pomodoro: {
    mode: 'work' | 'shortBreak' | 'longBreak';
    workMinutes: number;
    breakMinutes: number;
    currentSeconds: number;
    isActive: boolean;
    completedSessions: number;
  };

  // Actions
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveView: (view: ViewMode) => void;
  setSearchQuery: (query: string) => void;
  setCategoryFilter: (catId: string | null) => void;
  setProjectFilter: (projId: string | null) => void;
  setTaskFilter: (filter: TaskFilterType) => void;
  setTaskSort: (sort: TaskSortType) => void;
  toggleAiPanel: () => void;
  openTaskModal: (task?: Task | null) => void;
  closeTaskModal: () => void;
  setAuthModalOpen: (open: boolean) => void;
  
  // Task CRUD
  addTask: (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'>) => void;
  updateTask: (taskId: string, partial: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  clearCompletedTasks: () => void;
  duplicateTask: (taskId: string) => void;
  toggleTaskComplete: (taskId: string) => void;
  moveTaskKanban: (taskId: string, newStatus: 'todo' | 'inprogress' | 'completed') => void;
  reorderTasks: (newTasks: Task[]) => void;
  
  // Subtasks
  addSubtask: (taskId: string, title: string) => void;
  toggleSubtask: (taskId: string, subtaskId: string) => void;
  deleteSubtask: (taskId: string, subtaskId: string) => void;

  // Categories & Projects & Folders
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, partial: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addFolder: (name: string, icon?: string) => void;
  addProject: (name: string, color: string, icon: string, folderId?: string) => void;
  toggleFolderExpand: (folderId: string) => void;
  
  // Gamification
  addXp: (amount: number) => void;
  
  // Pomodoro Actions
  tickPomodoro: () => void;
  togglePomodoroActive: () => void;
  setPomodoroMode: (mode: 'work' | 'shortBreak' | 'longBreak') => void;
  resetPomodoro: () => void;
  
  // Activity Log
  addActivityLog: (type: ActivityLog['type'], description: string, icon?: string, taskId?: string) => void;

  // AI Actions
  addAiInsight: (insight: Omit<AIInsight, 'id' | 'createdAt'>) => void;

  // Auth
  setUser: (user: UserProfile | null) => void;
  loginAsDemoUser: () => void;
  logoutUser: () => void;
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isDemoMode: false,
      theme: 'light',
      activeView: 'dashboard',
      searchQuery: '',
      selectedCategoryFilter: null,
      selectedProjectFilter: null,
      taskFilter: 'all',
      taskSort: 'dueDate',
      isAiPanelOpen: false,
      isTaskModalOpen: false,
      editingTask: null,
      isAuthModalOpen: false,

      tasks: INITIAL_TASKS,
      categories: INITIAL_CATEGORIES,
      folders: INITIAL_FOLDERS,
      projects: INITIAL_PROJECTS,
      gamification: {
        xp: 0,
        level: 1,
        currentStreak: 0,
        longestStreak: 0,
        lastActiveDate: new Date().toISOString().split('T')[0],
        dailyGoal: {
          targetTasks: 5,
          targetFocusHours: 4,
          completedTasksToday: 0,
          focusMinutesToday: 0,
        },
        badges: INITIAL_BADGES,
      },
      activityLogs: INITIAL_ACTIVITY_LOGS,
      aiInsights: INITIAL_AI_INSIGHTS,

      pomodoro: {
        mode: 'work',
        workMinutes: 25,
        breakMinutes: 5,
        currentSeconds: 25 * 60,
        isActive: false,
        completedSessions: 0,
      },

      setTheme: (theme) => {
        set({ theme });
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      },
      setActiveView: (view) => set({ activeView: view }),
      setSearchQuery: (searchQuery) => set({ searchQuery }),
      setCategoryFilter: (catId) => set({ selectedCategoryFilter: catId, selectedProjectFilter: null }),
      setProjectFilter: (projId) => set({ selectedProjectFilter: projId, selectedCategoryFilter: null }),
      setTaskFilter: (taskFilter) => set({ taskFilter }),
      setTaskSort: (taskSort) => set({ taskSort }),
      toggleAiPanel: () => set((state) => ({ isAiPanelOpen: !state.isAiPanelOpen })),
      openTaskModal: (task = null) => set({ isTaskModalOpen: true, editingTask: task }),
      closeTaskModal: () => set({ isTaskModalOpen: false, editingTask: null }),
      setAuthModalOpen: (isAuthModalOpen) => set({ isAuthModalOpen }),

      // Task CRUD
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          order: get().tasks.length,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [newTask, ...state.tasks] }));
        get().addActivityLog('created', `Created task "${newTask.title}"`, 'Plus', newTask.id);
      },

      updateTask: (taskId, partial) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, ...partial, updatedAt: new Date().toISOString() } : t)),
        }));
        get().addActivityLog('edited', `Updated task details`, 'Edit3', taskId);
      },

      deleteTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== taskId),
        }));
        if (task) {
          get().addActivityLog('deleted', `Deleted task "${task.title}"`, 'Trash2');
        }
      },

      clearCompletedTasks: () => {
        const completedCount = get().tasks.filter((t) => t.isCompleted).length;
        set((state) => ({
          tasks: state.tasks.filter((t) => !t.isCompleted),
        }));
        if (completedCount > 0) {
          get().addActivityLog('deleted', `Cleared ${completedCount} completed task(s)`, 'Sparkles');
        }
      },

      duplicateTask: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const dup: Task = {
          ...task,
          id: `task-dup-${Date.now()}`,
          title: `${task.title} (Copy)`,
          isCompleted: false,
          completedAt: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        set((state) => ({ tasks: [dup, ...state.tasks] }));
        get().addActivityLog('created', `Duplicated task "${task.title}"`, 'Copy', dup.id);
      },

      toggleTaskComplete: (taskId) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;
        const willBeCompleted = !task.isCompleted;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  isCompleted: willBeCompleted,
                  kanbanStatus: willBeCompleted ? 'completed' : (t.kanbanStatus === 'completed' ? 'todo' : t.kanbanStatus || 'todo'),
                  completedAt: willBeCompleted ? new Date().toISOString() : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));

        if (willBeCompleted) {
          triggerConfetti();
          get().addXp(XP_PER_TASK);
          get().addActivityLog('completed', `Completed "${task.title}" 🎉`, 'CheckCircle', taskId);
          // Update daily goal
          set((state) => ({
            gamification: {
              ...state.gamification,
              dailyGoal: {
                ...state.gamification.dailyGoal,
                completedTasksToday: state.gamification.dailyGoal.completedTasksToday + 1,
              },
            },
          }));
        }
      },

      reorderTasks: (newTasks) => set({ tasks: newTasks }),

      moveTaskKanban: (taskId, newStatus) => {
        const task = get().tasks.find((t) => t.id === taskId);
        if (!task) return;

        const isNowCompleted = newStatus === 'completed';
        const wasCompleted = task.isCompleted;

        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  kanbanStatus: newStatus,
                  isCompleted: isNowCompleted,
                  completedAt: isNowCompleted ? (t.completedAt || new Date().toISOString()) : undefined,
                  updatedAt: new Date().toISOString(),
                }
              : t
          ),
        }));

        if (isNowCompleted && !wasCompleted) {
          triggerConfetti();
          get().addXp(XP_PER_TASK);
          get().addActivityLog('completed', `Moved "${task.title}" to Completed 🎉`, 'CheckCircle', taskId);
          set((state) => ({
            gamification: {
              ...state.gamification,
              dailyGoal: {
                ...state.gamification.dailyGoal,
                completedTasksToday: state.gamification.dailyGoal.completedTasksToday + 1,
              },
            },
          }));
        } else {
          get().addActivityLog('edited', `Moved "${task.title}" to ${newStatus === 'todo' ? 'To Do' : 'In Progress'}`, 'Kanban', taskId);
        }
      },

      // Subtasks
      addSubtask: (taskId, title) => {
        const newSub: Task['subtasks'][0] = {
          id: `sub-${Date.now()}`,
          title,
          isCompleted: false,
        };
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === taskId ? { ...t, subtasks: [...t.subtasks, newSub] } : t)),
        }));
      },

      toggleSubtask: (taskId, subtaskId) => {
        let isDoneNow = false;
        set((state) => ({
          tasks: state.tasks.map((t) => {
            if (t.id !== taskId) return t;
            const updatedSubs = t.subtasks.map((s) => {
              if (s.id === subtaskId) {
                isDoneNow = !s.isCompleted;
                return { ...s, isCompleted: isDoneNow };
              }
              return s;
            });
            return { ...t, subtasks: updatedSubs };
          }),
        }));
        if (isDoneNow) {
          get().addXp(XP_PER_SUBTASK);
        }
      },

      deleteSubtask: (taskId, subtaskId) => {
        set((state) => ({
          tasks: state.tasks.map((t) =>
            t.id === taskId ? { ...t, subtasks: t.subtasks.filter((s) => s.id !== subtaskId) } : t
          ),
        }));
      },

      // Categories & Projects & Folders
      addCategory: (catData) => {
        const newCat: Category = { ...catData, id: `cat-${Date.now()}` };
        set((state) => ({ categories: [...state.categories, newCat] }));
        get().addActivityLog('category', `Created category "${newCat.name}"`, 'Tag');
      },

      updateCategory: (id, partial) => {
        set((state) => ({
          categories: state.categories.map((c) => (c.id === id ? { ...c, ...partial } : c)),
        }));
      },

      deleteCategory: (id) => {
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== id),
        }));
      },

      addFolder: (name, icon = 'Folder') => {
        const newFolder: Folder = { id: `folder-${Date.now()}`, name, icon, isExpanded: true };
        set((state) => ({ folders: [...state.folders, newFolder] }));
      },

      addProject: (name, color, icon, folderId) => {
        const newProj: Project = { id: `proj-${Date.now()}`, name, color, icon, folderId, isCollapsed: false };
        set((state) => ({ projects: [...state.projects, newProj] }));
      },

      toggleFolderExpand: (folderId) => {
        set((state) => ({
          folders: state.folders.map((f) => (f.id === folderId ? { ...f, isExpanded: !f.isExpanded } : f)),
        }));
      },

      // Gamification
      addXp: (amount) => {
        set((state) => {
          const currentXp = state.gamification.xp + amount;
          const nextLevelThreshold = state.gamification.level * 100;
          let level = state.gamification.level;
          let leveledUp = false;

          if (currentXp >= nextLevelThreshold) {
            level += 1;
            leveledUp = true;
          }

          if (leveledUp) {
            triggerLevelUpConfetti();
            const levelTitle = getLevelTitle(level);
            setTimeout(() => {
              get().addActivityLog('level_up', `Leveled up to Level ${level}: ${levelTitle}! ✨`, 'Sparkles');
            }, 300);
          }

          return {
            gamification: {
              ...state.gamification,
              xp: currentXp,
              level,
            },
          };
        });
      },

      // Pomodoro Timer
      tickPomodoro: () => {
        set((state) => {
          const p = state.pomodoro;
          if (!p.isActive) return state;
          if (p.currentSeconds <= 1) {
            const nextSessions = p.mode === 'work' ? p.completedSessions + 1 : p.completedSessions;
            const nextMode = p.mode === 'work' ? 'shortBreak' : 'work';
            const nextSecs = (nextMode === 'work' ? p.workMinutes : p.breakMinutes) * 60;
            
            if (p.mode === 'work') {
              get().addXp(25);
              get().addActivityLog('completed', `Completed a 25-minute Pomodoro session! ⏱️`);
            }

            return {
              pomodoro: {
                ...p,
                mode: nextMode,
                currentSeconds: nextSecs,
                isActive: false,
                completedSessions: nextSessions,
              },
            };
          }
          return {
            pomodoro: {
              ...p,
              currentSeconds: p.currentSeconds - 1,
            },
          };
        });
      },

      togglePomodoroActive: () => {
        set((state) => ({
          pomodoro: { ...state.pomodoro, isActive: !state.pomodoro.isActive },
        }));
      },

      setPomodoroMode: (mode) => {
        set((state) => {
          const mins = mode === 'work' ? state.pomodoro.workMinutes : state.pomodoro.breakMinutes;
          return {
            pomodoro: {
              ...state.pomodoro,
              mode,
              currentSeconds: mins * 60,
              isActive: false,
            },
          };
        });
      },

      resetPomodoro: () => {
        set((state) => {
          const mins = state.pomodoro.mode === 'work' ? state.pomodoro.workMinutes : state.pomodoro.breakMinutes;
          return {
            pomodoro: {
              ...state.pomodoro,
              currentSeconds: mins * 60,
              isActive: false,
            },
          };
        });
      },

      // Activity Log
      addActivityLog: (type, description, icon = 'Activity', taskId) => {
        const newLog: ActivityLog = {
          id: `act-${Date.now()}`,
          timestamp: new Date().toISOString(),
          type,
          description,
          icon,
          taskId,
        };
        set((state) => ({ activityLogs: [newLog, ...state.activityLogs.slice(0, 40)] }));
      },

      addAiInsight: (insight) => {
        const newInsight: AIInsight = {
          ...insight,
          id: `insight-${Date.now()}`,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ aiInsights: [newInsight, ...state.aiInsights] }));
      },

      // Auth
      setUser: (user) => set({ currentUser: user, isDemoMode: false }),
      loginAsDemoUser: () => set({ currentUser: { id: 'guest-user', name: 'Guest User', email: 'guest@minimalist.app', role: 'Owner', isOnline: true }, isDemoMode: true }),
      logoutUser: () => set({ currentUser: null }),
    }),
    {
      name: 'minimalist-blackwhite-todo-v2',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        tasks: state.tasks,
        categories: state.categories,
        folders: state.folders,
        projects: state.projects,
        gamification: state.gamification,
        activityLogs: state.activityLogs,
        aiInsights: state.aiInsights,
        theme: state.theme,
        currentUser: state.currentUser,
        isDemoMode: state.isDemoMode,
      }),
    }
  )
);
