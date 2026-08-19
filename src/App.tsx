import { useState, useEffect } from 'react';
import { useStore } from './store/useStore';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { DashboardView } from './components/dashboard/DashboardView';
import { TaskListView } from './components/tasks/TaskListView';
import { TaskKanbanView } from './components/tasks/TaskKanbanView';
import { CalendarView } from './components/calendar/CalendarView';
import { ProjectsView } from './components/projects/ProjectsView';
import { PomodoroView } from './components/pomodoro/PomodoroView';
import { AchievementsView } from './components/gamification/AchievementsView';
import { CollaborationView } from './components/collaboration/CollaborationView';
import { TaskModal } from './components/tasks/TaskModal';
import { AIPanel } from './components/ai/AIPanel';
import { AuthModal } from './components/auth/AuthModal';
import { AuthScreen } from './components/auth/AuthScreen';
import { Plus } from 'lucide-react';

export function App() {
  const { activeView, openTaskModal, theme, currentUser } = useStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Auth gate: If user is not logged in / signed up, show AuthScreen first!
  if (!currentUser) {
    return <AuthScreen />;
  }

  const renderMainView = () => {
    switch (activeView) {
      case 'dashboard':
        return <DashboardView />;
      case 'tasks':
        return <TaskListView />;
      case 'kanban':
        return <TaskKanbanView />;
      case 'calendar':
        return <CalendarView />;
      case 'projects':
        return <ProjectsView />;
      case 'pomodoro':
        return <PomodoroView />;
      case 'achievements':
        return <AchievementsView />;
      case 'collaboration':
        return <CollaborationView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white dark:bg-black text-black dark:text-white font-sans selection:bg-black selection:text-white dark:selection:bg-white dark:selection:text-black">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72 h-screen sticky top-0 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Drawer Sidebar */}
      {isMobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div 
            className="fixed inset-0 bg-black/60"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="relative w-72 h-full z-10">
            <Sidebar onCloseMobileSidebar={() => setIsMobileSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        <Header onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderMainView()}
        </main>
      </div>

      {/* Floating Action Button (FAB) */}
      <button
        onClick={() => openTaskModal()}
        className="fixed bottom-6 right-6 z-40 p-4 border-2 border-black dark:border-white bg-black text-white dark:bg-white dark:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] hover:scale-105 active:scale-95 transition-all group flex items-center justify-center"
        title="Quick Add Task"
      >
        <Plus size={24} className="group-hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Modals & Slideover Panels */}
      <TaskModal />
      <AIPanel />
      <AuthModal />
    </div>
  );
}

export default App;
