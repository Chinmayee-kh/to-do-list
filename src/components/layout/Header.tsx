import React from 'react';
import { 
  Search, Plus, Sparkles, Moon, Sun, Flame, 
  User, Menu, Award, Bell, LogOut 
} from 'lucide-react';
import { useStore } from '../../store/useStore';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenMobileSidebar }) => {
  const { 
    searchQuery, setSearchQuery, 
    theme, setTheme, 
    gamification, 
    toggleAiPanel, isAiPanelOpen, 
    openTaskModal, 
    currentUser, 
    logoutUser,
    setAuthModalOpen 
  } = useStore();

  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 glass-header px-4 lg:px-8 py-3 flex items-center justify-between gap-4 transition-all">
      {/* Left section: Mobile menu & Search */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button 
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 transition rounded-lg"
          aria-label="Open navigation menu"
        >
          <Menu size={20} />
        </button>

        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-black/50 dark:text-white/50" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks, tags, or categories..."
            className="w-full pl-9 pr-4 py-1.5 text-xs font-medium bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10 text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-white/40 focus:outline-none focus:border-black dark:focus:border-white focus:bg-white dark:focus:bg-black transition-all rounded-lg"
          />
        </div>
      </div>

      {/* Right section: Gamification, AI, Theme & User */}
      <div className="flex items-center gap-2">
        {/* Daily Streak Pill */}
        <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 text-xs font-medium rounded-lg bg-neutral-50 dark:bg-neutral-900/40">
          <Flame size={14} className="fill-black/80 dark:fill-white/80" />
          <span>{gamification.currentStreak}d Streak</span>
        </div>

        {/* XP Level Badge */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 text-xs font-medium rounded-lg bg-neutral-50 dark:bg-neutral-900/40">
          <Award size={14} />
          <span>Lvl {gamification.level} • {gamification.xp} XP</span>
        </div>

        {/* AI Assistant Button */}
        <button
          onClick={toggleAiPanel}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium transition-all border rounded-lg ${
            isAiPanelOpen 
              ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white' 
              : 'bg-white text-black dark:bg-black dark:text-white border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
          }`}
          title="Toggle AI Assistant"
        >
          <Sparkles size={14} />
          <span className="hidden sm:inline">AI Studio</span>
        </button>

        {/* Quick Add Task Button */}
        <button
          onClick={() => openTaskModal()}
          className="flex items-center gap-1.5 px-3.5 py-1.5 bg-black text-white dark:bg-white dark:text-black font-bold text-xs border border-black dark:border-white hover:bg-neutral-900 dark:hover:bg-neutral-100 transition-all rounded-lg"
        >
          <Plus size={15} />
          <span className="hidden sm:inline">New Task</span>
        </button>

        {/* Desktop Reminders & Notification Bell */}
        <button
          onClick={() => {
            if ('Notification' in window) {
              Notification.requestPermission().then((permission) => {
                if (permission === 'granted') {
                  new Notification('Task Studio Reminders Active', {
                    body: 'Notifications enabled.',
                    icon: '/favicon.ico'
                  });
                } else {
                  alert('Notifications permission: ' + permission);
                }
              });
            } else {
              alert('Desktop notifications active!');
            }
          }}
          className="p-2 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 transition rounded-lg"
          title="Enable Notifications"
        >
          <Bell size={15} />
        </button>

        {/* Dark/Light Mode Toggle */}
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="p-2 border border-black/10 dark:border-white/10 text-black/70 dark:text-white/70 hover:bg-black/5 dark:hover:bg-white/10 transition rounded-lg"
          title={isDark ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
        >
          {isDark ? <Sun size={15} /> : <Moon size={15} />}
        </button>

        {/* Logout / User Info */}
        <button
          onClick={logoutUser}
          className="flex items-center gap-1.5 px-2.5 py-1.5 border border-black/10 dark:border-white/10 text-black/80 dark:text-white/80 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-medium transition rounded-lg"
          title="Log Out"
        >
          <User size={14} />
          <span className="hidden md:inline font-semibold">{currentUser?.name || 'Account'}</span>
          <LogOut size={13} className="opacity-70" />
        </button>
      </div>
    </header>
  );
};
