import React, { useState } from 'react';
import { 
  LayoutDashboard, CheckSquare, Kanban, Calendar, 
  FolderKanban, Timer, Trophy, Users, Sparkles, 
  ChevronRight, ChevronDown, Plus, LogOut, X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { ViewMode } from '../../types';
import { Icon } from '../common/Icon';

interface SidebarProps {
  onCloseMobileSidebar?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ onCloseMobileSidebar }) => {
  const { 
    activeView, setActiveView, 
    categories, selectedCategoryFilter, setCategoryFilter, 
    folders, projects, selectedProjectFilter, setProjectFilter, 
    toggleFolderExpand, tasks, openTaskModal, logoutUser, currentUser 
  } = useStore();

  const [isAddingProject, setIsAddingProject] = useState(false);
  const [newProjName, setNewProjName] = useState('');
  const { addProject } = useStore();

  const navItems: { id: ViewMode; label: string; icon: any; badge?: number }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'My Tasks', icon: CheckSquare, badge: tasks.filter(t => !t.isCompleted).length },
    { id: 'kanban', label: 'Kanban Board', icon: Kanban },
    { id: 'calendar', label: 'Calendar View', icon: Calendar },
    { id: 'projects', label: 'Projects & Folders', icon: FolderKanban },
    { id: 'pomodoro', label: 'Pomodoro Timer', icon: Timer },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'collaboration', label: 'Collaboration', icon: Users },
  ];

  const handleAddProjectSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    addProject(newProjName.trim(), '#000000', 'Folder', folders[0]?.id);
    setNewProjName('');
    setIsAddingProject(false);
  };

  return (
    <aside className="h-full flex flex-col justify-between p-4 glass-sidebar overflow-y-auto bg-white dark:bg-black text-black dark:text-white font-sans border-r border-black/10 dark:border-white/10">
      <div className="space-y-6">
        {/* Logo & Brand Header */}
        <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => setActiveView('dashboard')}>
            <div className="w-8 h-8 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold rounded-lg">
              <CheckSquare size={16} strokeWidth={2.5} />
            </div>
            <div>
              <h1 className="font-extrabold text-sm tracking-tight text-black dark:text-white">
                Task Studio
              </h1>
              <p className="text-[10px] text-neutral-400 font-medium">Minimalist Workspace</p>
            </div>
          </div>
          {onCloseMobileSidebar && (
            <button 
              onClick={onCloseMobileSidebar}
              className="lg:hidden p-1.5 border border-black/10 dark:border-white/10 text-black dark:text-white hover:bg-black/5 dark:hover:bg-white/10 rounded-lg"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* Main Navigation Menu */}
        <nav className="space-y-1">
          <p className="px-2 text-[10px] font-bold tracking-widest text-neutral-400 uppercase mb-2">
            Navigation
          </p>
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveView(item.id);
                  onCloseMobileSidebar?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-semibold rounded-lg transition-all ${
                  isActive
                    ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-bold'
                    : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-black dark:hover:text-white'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <IconComponent size={15} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && item.badge > 0 && (
                  <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded-md ${
                    isActive ? 'bg-black text-white dark:bg-white dark:text-black' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Categories Section */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              Categories
            </p>
            {selectedCategoryFilter && (
              <button 
                onClick={() => setCategoryFilter(null)}
                className="text-[10px] font-bold text-neutral-400 hover:text-black dark:hover:text-white underline uppercase"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-1">
            {categories.map((cat) => {
              const isCatActive = selectedCategoryFilter === cat.id;
              const catTasksCount = tasks.filter(t => t.categoryId === cat.id && !t.isCompleted).length;
              return (
                <button
                  key={cat.id}
                  onClick={() => {
                    setCategoryFilter(isCatActive ? null : cat.id);
                    setActiveView('tasks');
                    onCloseMobileSidebar?.();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    isCatActive
                      ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-bold'
                      : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-black dark:hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-black dark:bg-white" />
                    <span>{cat.name}</span>
                  </span>
                  <span className="text-[10px] opacity-60">{catTasksCount}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Folders & Projects Tree */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
              Projects
            </p>
            <button
              onClick={() => setIsAddingProject(true)}
              className="p-1 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-md"
              title="Add New Project"
            >
              <Plus size={12} />
            </button>
          </div>

          {isAddingProject && (
            <form onSubmit={handleAddProjectSubmit} className="mb-2 px-1">
              <input
                type="text"
                value={newProjName}
                onChange={(e) => setNewProjName(e.target.value)}
                placeholder="Project Name..."
                autoFocus
                className="w-full px-2 py-1 text-xs font-semibold bg-white dark:bg-black border border-black/10 dark:border-white/10 focus:outline-none rounded-md"
              />
            </form>
          )}

          <div className="space-y-1">
            {folders.map((folder) => {
              const folderProjects = projects.filter((p) => p.folderId === folder.id);
              return (
                <div key={folder.id} className="space-y-1">
                  <button
                    onClick={() => toggleFolderExpand(folder.id)}
                    className="w-full flex items-center justify-between px-2 py-1 text-xs font-bold text-neutral-600 dark:text-neutral-400 hover:text-black dark:hover:text-white"
                  >
                    <div className="flex items-center gap-1.5">
                      {folder.isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                      <span className="truncate">{folder.name}</span>
                    </div>
                  </button>

                  {folder.isExpanded && (
                    <div className="pl-4 space-y-1 border-l border-black/10 dark:border-white/10 ml-3">
                      {folderProjects.map((proj) => {
                        const isProjActive = selectedProjectFilter === proj.id;
                        return (
                          <button
                            key={proj.id}
                            onClick={() => {
                              setProjectFilter(isProjActive ? null : proj.id);
                              setActiveView('tasks');
                              onCloseMobileSidebar?.();
                            }}
                            className={`w-full text-left px-2.5 py-1 text-[11px] font-semibold rounded-md transition-all ${
                              isProjActive
                                ? 'bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white font-bold'
                                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-900/60 hover:text-black dark:hover:text-white'
                            }`}
                          >
                            # {proj.name}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Logout & Info at Bottom */}
      <div className="pt-4 mt-6 border-t border-black/10 dark:border-white/10">
        <button
          onClick={logoutUser}
          className="w-full py-2 bg-black text-white dark:bg-white dark:text-black font-semibold text-xs border border-black dark:border-white hover:opacity-90 transition-all flex items-center justify-center gap-2 rounded-lg"
        >
          <LogOut size={13} />
          <span>Sign Out ({currentUser?.name || 'User'})</span>
        </button>
      </div>
    </aside>
  );
};
