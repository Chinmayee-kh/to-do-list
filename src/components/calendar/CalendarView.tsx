import React, { useState } from 'react';
import { 
  ChevronLeft, ChevronRight, Calendar as CalendarIcon, 
  Plus 
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const CalendarView: React.FC = () => {
  const { tasks, categories, openTaskModal } = useStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month');

  // Month navigation helpers
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 = Sun

  const handlePrev = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNext = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Generate grid days for month view
  const daysGrid: ({ dayNumber: number; dateStr: string } | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    const formattedMonth = String(month + 1).padStart(2, '0');
    const formattedDay = String(d).padStart(2, '0');
    const dateStr = `${year}-${formattedMonth}-${formattedDay}`;
    daysGrid.push({ dayNumber: d, dateStr });
  }

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Calendar Header & View Selectors */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
            <CalendarIcon size={24} className="text-black dark:text-white" />
            <span>Interactive Calendar</span>
          </h2>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            Schedule and manage tasks across days.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* View Selector (Month, Week, Day) */}
          <div className="flex rounded-lg p-1 bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10">
            {(['month', 'week', 'day'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setViewMode(m)}
                className={`px-3 py-1 text-xs font-bold rounded-md uppercase transition ${
                  viewMode === m ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          {/* Month Nav Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={handlePrev}
              className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white bg-white dark:bg-black transition"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              onClick={handleToday}
              className="px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 text-xs font-bold text-black dark:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 bg-white dark:bg-black transition"
            >
              Today
            </button>
            <button
              onClick={handleNext}
              className="p-2 rounded-lg border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white bg-white dark:bg-black transition"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Month Year Title */}
      <h3 className="text-lg font-extrabold text-black dark:text-white tracking-wide">
        {monthNames[month]} {year}
      </h3>

      {/* Calendar Grid Container */}
      <div className="rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 p-4 overflow-x-auto">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-2 text-center pb-3 border-b border-black/10 dark:border-white/10 text-xs font-bold text-neutral-400 uppercase">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-2 pt-3">
          {daysGrid.map((item, index) => {
            if (!item) {
              return <div key={`empty-${index}`} className="min-h-[100px] p-2 bg-transparent" />;
            }

            const isToday = item.dateStr === new Date().toISOString().split('T')[0];
            const dayTasks = tasks.filter((t) => t.dueDate === item.dateStr);

            return (
              <div
                key={item.dateStr}
                onClick={() => openTaskModal({ dueDate: item.dateStr } as any)}
                className={`group min-h-[110px] p-2 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  isToday
                    ? 'bg-neutral-100 dark:bg-neutral-900 border-black dark:border-white'
                    : 'bg-white dark:bg-neutral-950 border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-xs font-extrabold w-6 h-6 rounded-full flex items-center justify-center ${
                      isToday ? 'bg-black text-white dark:bg-white dark:text-black font-bold' : 'text-neutral-500'
                    }`}>
                      {item.dayNumber}
                    </span>
                    <button
                      className="opacity-0 group-hover:opacity-100 p-0.5 text-neutral-500 hover:text-black dark:hover:text-white rounded transition"
                      title="Add task on this date"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  {/* Task Chips */}
                  <div className="space-y-1 overflow-y-auto max-h-[70px]">
                    {dayTasks.map((t) => {
                      return (
                        <div
                          key={t.id}
                          onClick={(e) => {
                            e.stopPropagation();
                            openTaskModal(t);
                          }}
                          className="p-1 px-1.5 rounded bg-neutral-50 dark:bg-neutral-900 border-l-2 border-black dark:border-white text-[10px] font-semibold text-black dark:text-white truncate flex items-center gap-1 hover:opacity-80 transition"
                        >
                          <span className="truncate">{t.title}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
