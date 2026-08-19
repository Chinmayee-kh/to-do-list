import React, { useEffect, useState } from 'react';
import { Play, Pause, RotateCcw, Zap, Volume2, VolumeX } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const PomodoroView: React.FC = () => {
  const { 
    pomodoro, tickPomodoro, togglePomodoroActive, 
    setPomodoroMode, resetPomodoro 
  } = useStore();

  const [isSoundMuted, setIsSoundMuted] = useState(false);

  // Play serene chime sound using Web Audio API
  const playChime = () => {
    if (isSoundMuted) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      
      const freqs = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6 harmonic chord
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.12);
        
        gain.gain.setValueAtTime(0.15, ctx.currentTime + idx * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + idx * 0.12 + 1.2);
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.start(ctx.currentTime + idx * 0.12);
        osc.stop(ctx.currentTime + idx * 0.12 + 1.3);
      });
    } catch {
      // Ignore audio autoplay policies if blocked
    }
  };

  useEffect(() => {
    let interval: any = null;
    if (pomodoro.isActive) {
      interval = setInterval(() => {
        tickPomodoro();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [pomodoro.isActive, tickPomodoro]);

  const minutes = Math.floor(pomodoro.currentSeconds / 60);
  const seconds = pomodoro.currentSeconds % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const totalModeSeconds = (pomodoro.mode === 'work' ? pomodoro.workMinutes : pomodoro.breakMinutes) * 60;
  const progressPercent = Math.min(100, Math.round(((totalModeSeconds - pomodoro.currentSeconds) / totalModeSeconds) * 100));

  // Circular progress calculations
  const strokeDashoffset = 440 - (440 * progressPercent) / 100;

  return (
    <div className="max-w-xl mx-auto space-y-6 pb-12 animate-fadeIn text-center">
      {/* Title */}
      <div>
        <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center justify-center gap-2">
          <Zap size={24} className="text-black dark:text-white" />
          <span>Pomodoro Focus Studio</span>
        </h2>
        <p className="text-xs text-neutral-400 font-medium mt-0.5">
          Boost your productivity with timed focus sessions & reward XP
        </p>
      </div>

      {/* Main Focus Card */}
      <div className="p-8 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 space-y-6 relative overflow-hidden">
        {/* Mode Selector Tabs */}
        <div className="flex justify-center max-w-xs mx-auto p-1 rounded-lg bg-neutral-50 dark:bg-neutral-900 border border-black/10 dark:border-white/10">
          <button
            onClick={() => setPomodoroMode('work')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition ${
              pomodoro.mode === 'work' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Work 25m
          </button>
          <button
            onClick={() => setPomodoroMode('shortBreak')}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md uppercase transition ${
              pomodoro.mode === 'shortBreak' ? 'bg-black text-white dark:bg-white dark:text-black' : 'text-neutral-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Break 5m
          </button>
        </div>

        {/* Circular Countdown Timer */}
        <div className="relative w-64 h-64 mx-auto flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="128"
              cy="128"
              r="70"
              className="stroke-neutral-100 dark:stroke-neutral-900"
              strokeWidth="10"
              fill="transparent"
            />
            <circle
              cx="128"
              cy="128"
              r="70"
              className="stroke-black dark:stroke-white transition-all duration-1000"
              strokeWidth="10"
              strokeDasharray="440"
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          <div className="absolute flex flex-col items-center justify-center space-y-1">
            <span className="text-5xl font-black tracking-tighter text-black dark:text-white font-mono">
              {formattedTime}
            </span>
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
              {pomodoro.mode === 'work' ? 'Focus Mode' : 'Rest & Refresh'}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4 pt-2">
          <button
            onClick={resetPomodoro}
            className="p-3 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white transition"
            title="Reset Timer"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => {
              togglePomodoroActive();
              if (!pomodoro.isActive) playChime();
            }}
            className="gradient-pink-btn p-3.5 rounded-lg"
            title={pomodoro.isActive ? 'Pause Session' : 'Start Session'}
          >
            {pomodoro.isActive ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
          </button>

          <button
            onClick={() => {
              setIsSoundMuted(!isSoundMuted);
              if (isSoundMuted) playChime();
            }}
            className={`p-3 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 transition ${
              isSoundMuted ? 'text-neutral-400' : 'text-black dark:text-white'
            }`}
            title={isSoundMuted ? 'Unmute Focus Chimes' : 'Test Ambient Chimes'}
          >
            {isSoundMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
        </div>
      </div>

      {/* Pomodoro Focus Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl text-center">
          <p className="text-xs font-semibold text-neutral-400">Sessions Completed Today</p>
          <h4 className="text-2xl font-bold text-black dark:text-white mt-1">
            {pomodoro.completedSessions}
          </h4>
        </div>
        <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl text-center">
          <p className="text-xs font-semibold text-neutral-400">Total Focus Time</p>
          <h4 className="text-2xl font-bold text-black dark:text-white mt-1">
            {pomodoro.completedSessions * 25} mins
          </h4>
        </div>
      </div>
    </div>
  );
};
