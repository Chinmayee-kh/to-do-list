import React, { useState, useEffect } from 'react';
import { 
  X, Paperclip, Sparkles, Check, Trash2 
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import type { Priority, RecurringSettings, ReminderSettings, Subtask, Attachment, Task } from '../../types';

export const TaskModal: React.FC = () => {
  const { 
    isTaskModalOpen, closeTaskModal, editingTask, 
    addTask, updateTask, categories, projects 
  } = useStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [richNotes, setRichNotes] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [categoryId, setCategoryId] = useState('');
  const [projectId, setProjectId] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [subtasks, setSubtasks] = useState<Subtask[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [attachments, setAttachments] = useState<Attachment[]>([]);
  const [recurring, setRecurring] = useState<RecurringSettings>({ frequency: 'none' });
  const [reminder, setReminder] = useState<ReminderSettings>({ timing: '30m', isBrowserEnabled: true, isPopupEnabled: true });

  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title);
      setDescription(editingTask.description || '');
      setRichNotes(editingTask.richNotes || '');
      setDueDate(editingTask.dueDate || '');
      setDueTime(editingTask.dueTime || '');
      setPriority(editingTask.priority);
      setCategoryId(editingTask.categoryId || (categories[0]?.id || ''));
      setProjectId(editingTask.projectId || '');
      setTags(editingTask.tags || []);
      setSubtasks(editingTask.subtasks || []);
      setAttachments(editingTask.attachments || []);
      setRecurring(editingTask.recurring || { frequency: 'none' });
      setReminder(editingTask.reminder || { timing: '30m', isBrowserEnabled: true, isPopupEnabled: true });
    } else {
      setTitle('');
      setDescription('');
      setRichNotes('');
      setDueDate(new Date().toISOString().split('T')[0]);
      setDueTime('12:00');
      setPriority('medium');
      setCategoryId(categories[0]?.id || '');
      setProjectId('');
      setTags([]);
      setSubtasks([]);
      setAttachments([]);
      setRecurring({ frequency: 'none' });
      setReminder({ timing: '30m', isBrowserEnabled: true, isPopupEnabled: true });
    }
  }, [editingTask, isTaskModalOpen, categories]);

  if (!isTaskModalOpen) return null;

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      const clean = tagInput.trim().replace(/^#/, '');
      if (!tags.includes(clean)) {
        setTags([...tags, clean]);
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `sub-${Date.now()}`, title: newSubtaskTitle.trim(), isCompleted: false }
    ]);
    setNewSubtaskTitle('');
  };

  const handleToggleSubtask = (subId: string) => {
    setSubtasks(subtasks.map(s => s.id === subId ? { ...s, isCompleted: !s.isCompleted } : s));
  };

  const handleDeleteSubtask = (subId: string) => {
    setSubtasks(subtasks.filter(s => s.id !== subId));
  };

  const handleAddAttachment = () => {
    const fakeNames = ['Design_Brief.pdf', 'Sketch_Mockup.jpg', 'Project_Notes.docx'];
    const randomName = fakeNames[Math.floor(Math.random() * fakeNames.length)];
    const newAtt: Attachment = {
      id: `att-${Date.now()}`,
      name: randomName,
      url: '#',
      type: randomName.endsWith('.jpg') ? 'image' : randomName.endsWith('.pdf') ? 'pdf' : 'document',
      size: '1.5 MB'
    };
    setAttachments([...attachments, newAtt]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt' | 'order'> = {
      title: title.trim(),
      description,
      richNotes,
      dueDate: dueDate || undefined,
      dueTime: dueTime || undefined,
      priority,
      categoryId: categoryId || categories[0]?.id || 'cat-personal',
      projectId: projectId || undefined,
      tags,
      isFavorite: editingTask ? editingTask.isFavorite : false,
      isPinned: editingTask ? editingTask.isPinned : false,
      isCompleted: editingTask ? editingTask.isCompleted : false,
      subtasks,
      attachments,
      assignedMembers: editingTask ? editingTask.assignedMembers : ['Sophia Miller (You)'],
      recurring,
      reminder,
    };

    if (editingTask) {
      updateTask(editingTask.id, taskData);
    } else {
      addTask(taskData);
    }
    closeTaskModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-modal rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative">
        {/* Close Button */}
        <button
          onClick={closeTaskModal}
          className="absolute top-6 right-6 p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-rose-100/50 dark:hover:bg-slate-800 transition"
        >
          <X size={20} />
        </button>

        {/* Modal Title Header */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-500 flex items-center justify-center font-bold">
            <Sparkles size={18} />
          </div>
          <h3 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {editingTask ? 'Edit Task ✨' : 'Create New Task ✨'}
          </h3>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Title Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Task Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Design Figma components & wireframes"
              required
              className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400 shadow-sm"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary or context..."
              rows={2}
              className="w-full px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-rose-400"
            />
          </div>

          {/* Category, Project & Priority Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Category
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* Project */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Project
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              >
                <option value="">No Project</option>
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            {/* Priority Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Priority
              </label>
              <div className="flex rounded-xl p-1 bg-rose-100/50 dark:bg-slate-800/60 border border-rose-200 dark:border-slate-700">
                {(['low', 'medium', 'high'] as Priority[]).map((p) => (
                  <button
                    type="button"
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`flex-1 py-1 text-[11px] font-bold rounded-lg uppercase transition-all ${
                      priority === p 
                        ? p === 'high' ? 'bg-rose-500 text-white' : p === 'medium' ? 'bg-pink-500 text-white' : 'bg-purple-500 text-white'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Due Date & Due Time Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Due Time
              </label>
              <input
                type="time"
                value={dueTime}
                onChange={(e) => setDueTime(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white"
              />
            </div>
          </div>

          {/* Tags Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
              Custom Tags (Press Enter)
            </label>
            <div className="flex flex-wrap items-center gap-1.5 p-2 rounded-2xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700">
              {tags.map((tag) => (
                <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-300 text-xs font-bold">
                  #{tag}
                  <X size={12} className="cursor-pointer hover:text-rose-800" onClick={() => handleRemoveTag(tag)} />
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleAddTag}
                placeholder="Type tag and press enter..."
                className="flex-1 bg-transparent text-xs text-slate-800 dark:text-white focus:outline-none min-w-[120px]"
              />
            </div>
          </div>

          {/* Subtasks Section */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
              Subtasks ({subtasks.filter(s => s.isCompleted).length}/{subtasks.length})
            </label>
            <div className="space-y-2">
              {subtasks.map((st) => (
                <div key={st.id} className="flex items-center justify-between gap-2 p-2 rounded-xl bg-rose-50/50 dark:bg-slate-800/50 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggleSubtask(st.id)}
                      className={`w-4 h-4 rounded border flex items-center justify-center ${st.isCompleted ? 'bg-rose-500 border-rose-500 text-white' : 'border-rose-300'}`}
                    >
                      {st.isCompleted && <Check size={10} />}
                    </button>
                    <span className={st.isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-slate-100 font-medium'}>
                      {st.title}
                    </span>
                  </div>
                  <button type="button" onClick={() => handleDeleteSubtask(st.id)} className="text-slate-400 hover:text-rose-600">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask..."
                  className="flex-1 px-3 py-1.5 text-xs rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-slate-800 dark:text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 py-1.5 rounded-xl bg-rose-500 text-white text-xs font-bold hover:bg-rose-600"
                >
                  + Add
                </button>
              </div>
            </div>
          </div>

          {/* Attachments Section */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase">
                Attachments
              </label>
              <button
                type="button"
                onClick={handleAddAttachment}
                className="text-xs text-rose-500 font-bold hover:underline flex items-center gap-1"
              >
                <Paperclip size={12} /> + Add File
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {attachments.map((att) => (
                <div key={att.id} className="px-3 py-1.5 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-rose-200 dark:border-slate-700 text-xs flex items-center gap-2">
                  <Paperclip size={12} className="text-rose-500" />
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{att.name}</span>
                  <span className="text-[10px] text-slate-400">({att.size})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Action Buttons */}
          <div className="pt-4 flex items-center justify-end gap-3 border-t border-rose-100 dark:border-slate-800">
            <button
              type="button"
              onClick={closeTaskModal}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="gradient-pink-btn px-6 py-2.5 rounded-xl text-xs font-extrabold shadow-pink-glow"
            >
              {editingTask ? 'Save Changes ✨' : 'Create Task ✨'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
