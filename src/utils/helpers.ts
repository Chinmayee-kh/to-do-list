import confetti from 'canvas-confetti';
import type { Priority, Task } from '../types';

// Confetti burst for task completions & achievements
export const triggerConfetti = () => {
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#f43f5e', '#ec4899', '#a855f7', '#fb7185', '#ffd1dc']
  });
};

export const triggerLevelUpConfetti = () => {
  const duration = 2.5 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();
    if (timeLeft <= 0) {
      return clearInterval(interval);
    }
    const particleCount = 50 * (timeLeft / duration);
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
    confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
  }, 250);
};

// Date helpers
export const isDateToday = (dateStr?: string): boolean => {
  if (!dateStr) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr === today;
};

export const isDateOverdue = (dateStr?: string, isCompleted?: boolean): boolean => {
  if (!dateStr || isCompleted) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr < today;
};

export const isDateUpcoming = (dateStr?: string, isCompleted?: boolean): boolean => {
  if (!dateStr || isCompleted) return false;
  const today = new Date().toISOString().split('T')[0];
  return dateStr > today;
};

// Gamification calculations
export const XP_PER_TASK = 15;
export const XP_PER_SUBTASK = 5;
export const XP_PER_POMODORO = 25;

export const getXpForLevel = (level: number): number => {
  return level * 100;
};

export const getLevelTitle = (level: number): string => {
  if (level <= 1) return 'Bloom Beginner 🌸';
  if (level === 2) return 'Focus Novice ⚡';
  if (level === 3) return 'Productivity Goddess ✨';
  if (level === 4) return 'Flow Master 💅';
  if (level >= 5) return 'Task Empress 👑';
  return 'Productivity Goddess ✨';
};

// AI Task Breakdown generator
export const generateAITaskBreakdown = (goalTitle: string): Partial<Task> => {
  const normalized = goalTitle.toLowerCase();
  let subtaskTitles: string[] = [];
  let suggestedPriority: Priority = 'medium';

  if (normalized.includes('portfolio') || normalized.includes('website') || normalized.includes('app')) {
    subtaskTitles = [
      '🔍 Research competitors & benchmark UI designs',
      '🎨 Design Figma wireframes & pick pastel color palette',
      '💻 Set up React, Vite & Tailwind CSS workspace',
      '⚡ Build interactive components & glassmorphism views',
      '🧪 Test responsive design & run performance lighthouse audit',
      '🚀 Deploy to Vercel/Netlify with custom domain'
    ];
    suggestedPriority = 'high';
  } else if (normalized.includes('study') || normalized.includes('exam') || normalized.includes('course')) {
    subtaskTitles = [
      '📖 Review syllabus & highlight key chapters',
      '✍️ Summarize main concepts in rich notes',
      '⏱️ Complete 2 Pomodoro focus study sessions',
      '📝 Practice mock quiz questions & flashcards',
      '🧘 Take rest break and review summary'
    ];
    suggestedPriority = 'high';
  } else if (normalized.includes('party') || normalized.includes('event') || normalized.includes('trip')) {
    subtaskTitles = [
      '📋 Create budget & guest headcount list',
      '📍 Research and reserve aesthetic location/venue',
      '🛍️ Purchase decorations, refreshments & cute favors',
      '💌 Send out digital invitations',
      '🎵 Create high-energy playlist'
    ];
    suggestedPriority = 'medium';
  } else {
    subtaskTitles = [
      `🎯 Clarify scope & main objectives for "${goalTitle}"`,
      '📋 Break down major milestones into bite-sized steps',
      '⚡ Execute step 1 during morning peak focus hour',
      '🔍 Review progress and polish final deliverables'
    ];
  }

  return {
    title: goalTitle,
    priority: suggestedPriority,
    subtasks: subtaskTitles.map((stTitle, idx) => ({
      id: `ai-sub-${Date.now()}-${idx}`,
      title: stTitle,
      isCompleted: false,
    })),
    tags: ['AI-Generated', 'GoalBreakdown'],
  };
};

// Smart Priority Suggestion AI engine
export const calculateSmartPriority = (dueDate?: string, subtaskCount: number = 0): Priority => {
  if (!dueDate) return 'low';
  if (isDateOverdue(dueDate) || isDateToday(dueDate)) return 'high';
  if (subtaskCount >= 4) return 'high';
  return 'medium';
};
