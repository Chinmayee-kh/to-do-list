import React from 'react';
import { Trophy, Award, Flame, Sparkles, Lock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { getLevelTitle } from '../../utils/helpers';
import { Icon } from '../common/Icon';

export const AchievementsView: React.FC = () => {
  const { gamification } = useStore();
  const currentTitle = getLevelTitle(gamification.level);
  const xpCurrent = gamification.xp;
  const xpNext = gamification.level * 100;
  const xpPercent = Math.min(100, Math.round((xpCurrent / xpNext) * 100));

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
          <Trophy size={26} className="text-black dark:text-white" />
          <span>Achievements & Gamification</span>
        </h2>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          Level up, earn badges, and stay motivated on your growth journey
        </p>
      </div>

      {/* Top Banner Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Level Banner */}
        <div className="md:col-span-2 p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-4 text-black dark:text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-black dark:text-white">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Level {gamification.level}</h3>
                <p className="text-xs text-neutral-400 font-semibold">{currentTitle}</p>
              </div>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400">
              {xpCurrent} / {xpNext} XP
            </span>
          </div>

          <div className="space-y-1.5">
            <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
              <div 
                className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
                style={{ width: `${xpPercent}%` }}
              />
            </div>
            <p className="text-[10px] text-neutral-400 text-right font-medium">
              {xpNext - xpCurrent} XP to reach Level {gamification.level + 1}
            </p>
          </div>
        </div>

        {/* Daily Streak Card */}
        <div className="p-6 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <h4 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
              <Flame className="text-black dark:text-white" size={18} />
              <span>Daily Streak</span>
            </h4>
            <span className="text-xs font-semibold text-neutral-500">Streak</span>
          </div>

          <div className="text-center py-2">
            <span className="text-4xl font-black text-black dark:text-white">
              {gamification.currentStreak}
            </span>
            <span className="text-sm font-semibold text-neutral-500 ml-1">Days</span>
            <p className="text-xs text-neutral-400 font-medium mt-1">
              Personal Best: {gamification.longestStreak} Days
            </p>
          </div>
        </div>
      </div>

      {/* Badges Showcase Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-lg text-black dark:text-white flex items-center gap-2">
          <Award size={20} className="text-black dark:text-white" />
          <span>Badge Showcase ({gamification.badges.filter(b => b.unlockedAt).length}/{gamification.badges.length})</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {gamification.badges.map((badge) => {
            const isUnlocked = Boolean(badge.unlockedAt);
            return (
              <div 
                key={badge.id}
                className={`p-5 rounded-xl border transition-all flex items-start gap-4 ${
                  isUnlocked 
                    ? 'border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950' 
                    : 'opacity-40 border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 grayscale'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0 ${
                  isUnlocked ? 'bg-black text-white dark:bg-white dark:text-black shadow-sm' : 'bg-neutral-100 dark:bg-neutral-900 text-neutral-400'
                }`}>
                  {isUnlocked ? <Icon name={badge.icon} size={20} /> : <Lock size={16} />}
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-extrabold text-black dark:text-white">
                      {badge.title}
                    </h4>
                    {isUnlocked && (
                      <span className="px-2 py-0.2 rounded border border-black/15 dark:border-white/15 text-black dark:text-white text-[9px] font-bold">
                        Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {badge.description}
                  </p>
                  {badge.unlockedAt && (
                    <p className="text-[10px] text-neutral-400 font-semibold pt-1">
                      Unlocked on {new Date(badge.unlockedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
