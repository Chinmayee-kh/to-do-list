import React, { useState } from 'react';
import { Sparkles, X, Lightbulb, Layers, Plus } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { generateAITaskBreakdown } from '../../utils/helpers';

export const AIPanel: React.FC = () => {
  const { 
    isAiPanelOpen, toggleAiPanel, aiInsights, 
    addTask, categories 
  } = useStore();

  const [goalInput, setGoalInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [breakdownResult, setBreakdownResult] = useState<any>(null);

  if (!isAiPanelOpen) return null;

  const handleGenerateBreakdown = (e: React.FormEvent) => {
    e.preventDefault();
    if (!goalInput.trim()) return;
    setIsGenerating(true);

    setTimeout(() => {
      const generated = generateAITaskBreakdown(goalInput.trim());
      setBreakdownResult(generated);
      setIsGenerating(false);
    }, 600);
  };

  const handleAddBreakdownToTasks = () => {
    if (!breakdownResult) return;
    addTask({
      title: breakdownResult.title,
      description: `AI-generated task breakdown for goal: "${breakdownResult.title}"`,
      priority: breakdownResult.priority || 'medium',
      categoryId: categories[0]?.id || 'cat-work',
      tags: breakdownResult.tags || ['AI-Generated'],
      isFavorite: false,
      isPinned: false,
      isCompleted: false,
      subtasks: breakdownResult.subtasks || [],
      attachments: [],
      assignedMembers: ['Sophia Miller (You)'],
      recurring: { frequency: 'none' },
    });
    setBreakdownResult(null);
    setGoalInput('');
    toggleAiPanel();
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white/95 dark:bg-neutral-950/95 backdrop-blur-2xl border-l border-black/10 dark:border-white/10 shadow-2xl p-6 overflow-y-auto space-y-6 animate-slideLeft">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-black/10 dark:border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-black text-white dark:bg-white dark:text-black flex items-center justify-center">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-black dark:text-white tracking-tight">
              Sparkle AI Assistant
            </h3>
            <p className="text-[11px] text-neutral-400 font-medium">Smart Breakdown & Productivity Insights</p>
          </div>
        </div>

        <button
          onClick={toggleAiPanel}
          className="p-1.5 rounded-lg text-neutral-400 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 transition"
        >
          <X size={18} />
        </button>
      </div>

      {/* 1. AI Task Breakdown Generator Card */}
      <div className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-900 space-y-4">
        <div className="flex items-center gap-2 text-xs font-bold text-black dark:text-white uppercase tracking-wide">
          <Layers size={15} />
          <span>AI Task Breakdown</span>
        </div>

        <p className="text-xs text-neutral-500">
          Enter any big goal or project, and Sparkle AI will instantly generate an actionable step-by-step subtask checklist!
        </p>

        <form onSubmit={handleGenerateBreakdown} className="space-y-3">
          <input
            type="text"
            value={goalInput}
            onChange={(e) => setGoalInput(e.target.value)}
            placeholder="e.g. Build React Portfolio, Plan Study Routine..."
            className="w-full px-4 py-2.5 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-xs font-semibold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
          />

          <button
            type="submit"
            disabled={isGenerating}
            className="gradient-pink-btn w-full py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <span>Sparkling...</span>
            ) : (
              <>
                <Sparkles size={14} />
                <span>Generate Subtasks</span>
              </>
            )}
          </button>
        </form>

        {/* Breakdown Results */}
        {breakdownResult && (
          <div className="p-4 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 space-y-3 animate-fadeIn">
            <h4 className="font-bold text-xs text-black dark:text-white">
              Suggested Subtask Plan:
            </h4>
            <ul className="space-y-1.5 text-xs text-neutral-600 dark:text-neutral-300">
              {breakdownResult.subtasks.map((st: any) => (
                <li key={st.id} className="flex items-start gap-2 font-medium">
                  <span className="text-black dark:text-white">•</span>
                  <span>{st.title}</span>
                </li>
              ))}
            </ul>
            <button
              onClick={handleAddBreakdownToTasks}
              className="w-full py-2 rounded-lg bg-black hover:bg-neutral-900 dark:bg-white dark:hover:bg-neutral-100 text-white dark:text-black text-xs font-bold flex items-center justify-center gap-1.5 transition"
            >
              <Plus size={14} /> Add to My Task List
            </button>
          </div>
        )}
      </div>

      {/* 2. AI Productivity Insights Section */}
      <div className="space-y-3">
        <h4 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
          <Lightbulb size={16} className="text-black dark:text-white" />
          <span>Productivity Insights</span>
        </h4>

        <div className="space-y-3">
          {aiInsights.map((insight) => (
            <div 
              key={insight.id}
              className="p-4 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 border-l-2 border-l-black dark:border-l-white space-y-1.5"
            >
              <h5 className="text-xs font-extrabold text-black dark:text-white">
                {insight.title}
              </h5>
              <p className="text-xs text-neutral-500 font-medium">
                {insight.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
