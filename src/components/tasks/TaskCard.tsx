import React from 'react';
import { 
  Check, Star, Pin, Calendar as CalendarIcon, 
  Paperclip, ListTodo, Edit3, 
  Copy, Trash2, AlertCircle, Heart 
} from 'lucide-react';
import type { Task } from '../../types';
import { useStore } from '../../store/useStore';
import { isDateOverdue, isDateToday } from '../../utils/helpers';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { 
    toggleTaskComplete, toggleSubtask, updateTask, duplicateTask, 
    deleteTask, categories, projects 
  } = useStore();

  const [showSubtasks, setShowSubtasks] = React.useState(false);

  const category = categories.find((c) => c.id === task.categoryId);
  const project = projects.find((p) => p.id === task.projectId);

  const completedSubtasksCount = task.subtasks.filter((s) => s.isCompleted).length;
  const totalSubtasks = task.subtasks.length;
  const subtaskPercent = totalSubtasks > 0 ? Math.round((completedSubtasksCount / totalSubtasks) * 100) : 0;

  const isOverdue = isDateOverdue(task.dueDate, task.isCompleted);
  const isToday = isDateToday(task.dueDate);

  return (
    <div 
      className={`group relative p-4 bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/10 rounded-xl transition-all ${
        task.isCompleted ? 'opacity-50' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {/* Left Checkbox & Main Info */}
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <button
            onClick={() => toggleTaskComplete(task.id)}
            className={`mt-0.5 w-4 h-4 border border-black dark:border-white rounded transition-all flex items-center justify-center flex-shrink-0 ${
              task.isCompleted
                ? 'bg-black text-white dark:bg-white dark:text-black'
                : 'bg-white text-black dark:bg-black dark:text-white hover:bg-black/5'
            }`}
          >
            {task.isCompleted && <Check size={12} strokeWidth={3} />}
          </button>

          <div className="flex-1 min-w-0 space-y-1.5">
            <div className="flex items-center gap-2 flex-wrap">
              <h4 
                onClick={() => onEdit(task)}
                className={`text-sm font-bold text-black dark:text-white cursor-pointer hover:underline ${
                  task.isCompleted ? 'line-through opacity-70' : ''
                }`}
              >
                {task.title}
              </h4>

              {/* Priority Badge */}
              <span className="px-1.5 py-0.5 text-[9px] font-bold rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 uppercase">
                {task.priority}
              </span>

              {/* Pinned & Favorite */}
              {task.isPinned && <Pin size={12} className="fill-black dark:fill-white text-black dark:text-white" />}
              {task.isFavorite && <Heart size={12} className="fill-black dark:fill-white text-black dark:text-white" />}
            </div>

            {task.description && (
              <p className="text-xs text-neutral-500 line-clamp-2">
                {task.description}
              </p>
            )}

            {/* Badges & Metadata row */}
            <div className="flex items-center gap-3 pt-1.5 text-[11px] font-medium text-neutral-400 flex-wrap">
              {category && (
                <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px]">
                  {category.name}
                </span>
              )}

              {project && (
                <span className="px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 text-[10px]">
                  {project.name}
                </span>
              )}

              {task.dueDate && (
                <span className="flex items-center gap-1 font-semibold text-neutral-500 dark:text-neutral-400">
                  {isOverdue ? <AlertCircle size={12} className="text-black dark:text-white" /> : <CalendarIcon size={12} />}
                  <span>{isToday ? 'Today' : task.dueDate} {task.dueTime && `@ ${task.dueTime}`}</span>
                </span>
              )}

              {totalSubtasks > 0 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSubtasks(!showSubtasks);
                  }}
                  className="flex items-center gap-1 font-semibold underline text-neutral-500 hover:text-black dark:hover:text-white"
                >
                  <ListTodo size={12} />
                  <span>Subtasks ({completedSubtasksCount}/{totalSubtasks})</span>
                </button>
              )}

              {task.attachments.length > 0 && (
                <span className="flex items-center gap-1">
                  <Paperclip size={12} />
                  <span>{task.attachments.length} files</span>
                </span>
              )}

              {task.tags.map((tag) => (
                <span key={tag} className="text-neutral-500">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Subtasks Progress Bar */}
            {totalSubtasks > 0 && (
              <div 
                className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden cursor-pointer mt-2"
                onClick={() => setShowSubtasks(!showSubtasks)}
              >
                <div 
                  className="h-full bg-black dark:bg-white transition-all duration-300"
                  style={{ width: `${subtaskPercent}%` }}
                />
              </div>
            )}

            {/* Expandable Subtask List */}
            {totalSubtasks > 0 && showSubtasks && (
              <div className="mt-3 pt-2.5 border-t border-black/5 dark:border-white/5 space-y-2 animate-fadeIn">
                {task.subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between text-xs font-medium text-neutral-700 dark:text-neutral-300">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={st.isCompleted}
                        onChange={() => toggleSubtask(task.id, st.id)}
                        className="w-3.5 h-3.5 border border-neutral-300 dark:border-neutral-700 rounded text-black focus:ring-0"
                      />
                      <span className={st.isCompleted ? 'line-through text-neutral-400' : ''}>
                        {st.title}
                      </span>
                    </label>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => updateTask(task.id, { isFavorite: !task.isFavorite })}
            className="p-1.5 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition"
            title="Favorite task"
          >
            <Star size={13} className={task.isFavorite ? 'fill-black dark:fill-white text-black dark:text-white' : ''} />
          </button>

          <button
            onClick={() => updateTask(task.id, { isPinned: !task.isPinned })}
            className="p-1.5 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition"
            title="Pin task"
          >
            <Pin size={13} className={task.isPinned ? 'fill-black dark:fill-white text-black dark:text-white' : ''} />
          </button>

          <button
            onClick={() => onEdit(task)}
            className="p-1.5 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition"
            title="Edit task"
          >
            <Edit3 size={13} />
          </button>

          <button
            onClick={() => duplicateTask(task.id)}
            className="p-1.5 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition"
            title="Duplicate task"
          >
            <Copy size={13} />
          </button>

          <button
            onClick={() => deleteTask(task.id)}
            className="p-1.5 border border-black/10 dark:border-white/10 text-neutral-500 hover:text-black dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900 rounded-lg transition"
            title="Delete task"
          >
            <Trash2 size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};
