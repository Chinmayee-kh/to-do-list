import React from 'react';
import { 
  Clock, AlertCircle, TrendingUp, 
  Award, Sparkles, Calendar as CalendarIcon, 
  Plus, ArrowRight, Activity, Zap, CheckSquare 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { useStore } from '../../store/useStore';
import { isDateToday, isDateUpcoming, isDateOverdue, getLevelTitle } from '../../utils/helpers';

export const DashboardView: React.FC = () => {
  const { 
    tasks, gamification, activityLogs, 
    openTaskModal, setActiveView, 
    currentUser, theme 
  } = useStore();

  // Metrics computation
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.isCompleted);
  const pendingTasks = tasks.filter(t => !t.isCompleted);
  
  const dueTodayTasks = pendingTasks.filter(t => isDateToday(t.dueDate));
  const upcomingTasks = pendingTasks.filter(t => isDateUpcoming(t.dueDate));
  const overdueTasks = pendingTasks.filter(t => isDateOverdue(t.dueDate));
  
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Chart data 1: Weekly productivity
  const weeklyData = [
    { day: 'Mon', completed: tasks.filter(t => t.isCompleted).length, goal: 5 },
    { day: 'Tue', completed: 0, goal: 5 },
    { day: 'Wed', completed: 0, goal: 5 },
    { day: 'Thu', completed: 0, goal: 5 },
    { day: 'Fri', completed: 0, goal: 5 },
    { day: 'Sat', completed: 0, goal: 5 },
    { day: 'Sun', completed: 0, goal: 5 },
  ];

  // Chart data 2: Priority Distribution
  const highCount = pendingTasks.filter(t => t.priority === 'high').length;
  const medCount = pendingTasks.filter(t => t.priority === 'medium').length;
  const lowCount = pendingTasks.filter(t => t.priority === 'low').length;

  const priorityData = [
    { name: 'High Priority', value: highCount, color: theme === 'dark' ? '#ffffff' : '#000000' },
    { name: 'Medium Priority', value: medCount, color: '#888888' },
    { name: 'Low Priority', value: lowCount, color: theme === 'dark' ? '#333333' : '#e5e5e5' },
  ];

  const currentLevelTitle = getLevelTitle(gamification.level);
  const xpCurrent = gamification.xp;
  const xpNext = gamification.level * 100;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNext) * 100));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn bg-white dark:bg-black text-black dark:text-white">
      {/* 1. Welcome Hero Banner */}
      <div className="py-6 border-b border-black/10 dark:border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
            <Sparkles size={13} />
            <span>{currentLevelTitle}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-black dark:text-white">
            Welcome, {currentUser?.name || 'User'}
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            You have <span className="font-bold text-black dark:text-white">{dueTodayTasks.length} tasks</span> due today.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => openTaskModal()}
            className="px-3.5 py-2 bg-black text-white dark:bg-white dark:text-black font-bold text-xs border border-black dark:border-white hover:opacity-90 transition-all rounded-lg flex items-center gap-1.5"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
          <button
            onClick={() => setActiveView('pomodoro')}
            className="px-3.5 py-2 bg-white text-black dark:bg-black dark:text-white font-semibold text-xs border border-black/10 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10 transition-all rounded-lg flex items-center gap-1.5"
          >
            <Zap size={14} />
            <span>Focus Timer</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Summary Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Due Today */}
        <div 
          onClick={() => setActiveView('tasks')}
          className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl cursor-pointer hover:border-black/35 dark:hover:border-white/35 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-wider">Due Today</p>
            <Clock size={18} />
          </div>
          <h3 className="text-3xl font-bold mt-2 text-black dark:text-white">{dueTodayTasks.length}</h3>
        </div>

        {/* Upcoming */}
        <div 
          onClick={() => setActiveView('tasks')}
          className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl cursor-pointer hover:border-black/35 dark:hover:border-white/35 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-wider">Upcoming</p>
            <CalendarIcon size={18} />
          </div>
          <h3 className="text-3xl font-bold mt-2 text-black dark:text-white">{upcomingTasks.length}</h3>
        </div>

        {/* Overdue */}
        <div 
          onClick={() => setActiveView('tasks')}
          className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl cursor-pointer hover:border-black/35 dark:hover:border-white/35 transition-all"
        >
          <div className="flex items-center justify-between text-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-wider">Overdue</p>
            <AlertCircle size={18} />
          </div>
          <h3 className="text-3xl font-bold mt-2 text-black dark:text-white">{overdueTasks.length}</h3>
        </div>

        {/* Completion % */}
        <div className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl">
          <div className="flex items-center justify-between text-neutral-400">
            <p className="text-xs font-semibold uppercase tracking-wider">Completion Rate</p>
            <TrendingUp size={18} />
          </div>
          <h3 className="text-3xl font-bold mt-2 text-black dark:text-white">{completionRate}%</h3>
        </div>
      </div>

      {/* 3. Level & XP Progress Bar */}
      <div className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-3">
        <div className="flex items-center justify-between text-xs font-semibold text-neutral-500">
          <div className="flex items-center gap-2 text-black dark:text-white font-bold">
            <Award size={16} />
            <span>Level {gamification.level}: {currentLevelTitle}</span>
          </div>
          <span>{xpCurrent} / {xpNext} XP ({xpPercent}%)</span>
        </div>
        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black dark:bg-white transition-all duration-300"
            style={{ width: `${xpPercent}%` }}
          />
        </div>
      </div>

      {/* 4. Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Productivity Overview */}
        <div className="lg:col-span-2 p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-4">
          <div className="flex items-center justify-between border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-black dark:text-white">
              <TrendingUp size={16} />
              Weekly Productivity Overview
            </h3>
            <span className="text-[11px] font-medium text-neutral-400">Tasks Completed</span>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyData}>
                <XAxis dataKey="day" stroke="currentColor" fontSize={11} tickLine={false} />
                <YAxis stroke="currentColor" fontSize={11} tickLine={false} axisLine={false} />
                <RechartsTooltip 
                  contentStyle={{ 
                    backgroundColor: theme === 'dark' ? '#ffffff' : '#000000', 
                    color: theme === 'dark' ? '#000000' : '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '11px',
                    fontWeight: 'bold',
                    textTransform: 'uppercase'
                  }} 
                />
                <Bar dataKey="completed" fill="currentColor" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="p-5 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl flex flex-col justify-between space-y-4">
          <div className="border-b border-black/10 dark:border-white/10 pb-3">
            <h3 className="font-bold text-sm uppercase tracking-wider flex items-center gap-2 text-black dark:text-white">
              <Activity size={16} />
              Priority Breakdown
            </h3>
          </div>
          
          {totalTasks === 0 ? (
            <div className="py-8 text-center space-y-2">
              <p className="text-xs font-bold text-neutral-400 uppercase">No active tasks</p>
              <p className="text-[11px] text-neutral-500">Metrics start at zero</p>
            </div>
          ) : (
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={priorityData} 
                    cx="50%" 
                    cy="50%" 
                    innerRadius={40} 
                    outerRadius={65} 
                    dataKey="value"
                    stroke={theme === 'dark' ? '#080808' : '#ffffff'}
                    strokeWidth={2}
                  >
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          <div className="flex justify-around text-[11px] font-bold text-neutral-400 uppercase pt-2 border-t border-black/10 dark:border-white/10">
            <span>High ({highCount})</span>
            <span>Med ({medCount})</span>
            <span>Low ({lowCount})</span>
          </div>
        </div>
      </div>

      {/* 5. Quick Task Creation Prompt if empty */}
      {totalTasks === 0 && (
        <div className="p-8 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 text-center space-y-4 rounded-xl">
          <div className="w-12 h-12 bg-black text-white dark:bg-white dark:text-black mx-auto flex items-center justify-center font-bold rounded-xl">
            <CheckSquare size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold uppercase text-black dark:text-white">Your Studio is Ready</h3>
            <p className="text-xs text-neutral-400 font-medium max-w-md mx-auto mt-1">
              Add your first task to start tracking metrics, earning XP, and building your daily productivity streak.
            </p>
          </div>
          <button
            onClick={() => openTaskModal()}
            className="px-5 py-2.5 bg-black text-white dark:bg-white dark:text-black font-bold text-xs border border-black dark:border-white hover:opacity-90 transition-all rounded-lg"
          >
            + Add First Task
          </button>
        </div>
      )}
    </div>
  );
};
