import React from 'react';
import { Plus, ArrowUpDown, Trash2, CheckCircle2, FilterX } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useStore } from '../../store/useStore';
import { TaskCard } from './TaskCard';
import type { TaskFilterType, TaskSortType } from '../../types';
import { isDateToday, isDateUpcoming, isDateOverdue } from '../../utils/helpers';

export const TaskListView: React.FC = () => {
  const { 
    tasks, taskFilter, setTaskFilter, 
    taskSort, setTaskSort, 
    searchQuery, selectedCategoryFilter, selectedProjectFilter, 
    setCategoryFilter, setProjectFilter, setSearchQuery,
    openTaskModal, clearCompletedTasks, reorderTasks 
  } = useStore();

  const totalTasksCount = tasks.length;
  const completedTasksCount = tasks.filter(t => t.isCompleted).length;
  const overallPercent = totalTasksCount > 0 ? Math.round((completedTasksCount / totalTasksCount) * 100) : 0;

  // 1. Filter logic
  let filteredTasks = tasks.filter((task) => {
    // Search query match
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const titleMatch = task.title.toLowerCase().includes(q);
      const descMatch = task.description.toLowerCase().includes(q);
      const tagMatch = task.tags.some(t => t.toLowerCase().includes(q));
      if (!titleMatch && !descMatch && !tagMatch) return false;
    }

    // Category filter
    if (selectedCategoryFilter && task.categoryId !== selectedCategoryFilter) {
      return false;
    }

    // Project filter
    if (selectedProjectFilter && task.projectId !== selectedProjectFilter) {
      return false;
    }

    // Tab filter
    switch (taskFilter) {
      case 'active':
        return !task.isCompleted;
      case 'completed':
        return task.isCompleted;
      case 'today':
        return !task.isCompleted && isDateToday(task.dueDate);
      case 'upcoming':
        return !task.isCompleted && isDateUpcoming(task.dueDate);
      case 'overdue':
        return !task.isCompleted && isDateOverdue(task.dueDate);
      case 'favorites':
        return task.isFavorite;
      case 'pinned':
        return task.isPinned;
      case 'high':
        return task.priority === 'high';
      case 'medium':
        return task.priority === 'medium';
      case 'low':
        return task.priority === 'low';
      case 'all':
      default:
        return true;
    }
  });

  // 2. Sort logic
  filteredTasks.sort((a, b) => {
    // Always keep pinned tasks at the very top
    if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;

    if (taskSort === 'dueDate') {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return a.dueDate.localeCompare(b.dueDate);
    }
    if (taskSort === 'priority') {
      const weight = { high: 3, medium: 2, low: 1 };
      return weight[b.priority] - weight[a.priority];
    }
    if (taskSort === 'alphabetical') {
      return a.title.localeCompare(b.title);
    }
    if (taskSort === 'recentlyAdded') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
    return 0;
  });

  const filterTabs: { id: TaskFilterType; label: string; count?: number }[] = [
    { id: 'all', label: 'All Tasks', count: tasks.length },
    { id: 'active', label: 'Active', count: tasks.filter(t => !t.isCompleted).length },
    { id: 'today', label: 'Due Today', count: tasks.filter(t => !t.isCompleted && isDateToday(t.dueDate)).length },
    { id: 'overdue', label: 'Overdue', count: tasks.filter(t => !t.isCompleted && isDateOverdue(t.dueDate)).length },
    { id: 'completed', label: 'Completed', count: tasks.filter(t => t.isCompleted).length },
    { id: 'favorites', label: 'Favorites', count: tasks.filter(t => t.isFavorite).length },
    { id: 'high', label: 'High Priority' },
    { id: 'medium', label: 'Medium Priority' },
    { id: 'low', label: 'Low Priority' },
  ];

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(filteredTasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Merge reordered items back into master tasks list
    const remainingTasks = tasks.filter(t => !items.some(i => i.id === t.id));
    reorderTasks([...items, ...remainingTasks]);
  };

  const hasActiveFilters = Boolean(searchQuery || selectedCategoryFilter || selectedProjectFilter);

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      {/* 1. Overall Completion Progress Bar Banner */}
      <div className="p-4 border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 rounded-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 size={16} className="text-black dark:text-white" />
            <h3 className="font-bold text-xs text-neutral-600 dark:text-neutral-400">
              Overall Productivity Progress
            </h3>
          </div>
          <span className="text-xs font-bold text-black dark:text-white">
            {completedTasksCount}/{totalTasksCount} tasks completed ({overallPercent}%)
          </span>
        </div>

        <div className="w-full h-1.5 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
          <div 
            className="h-full bg-black dark:bg-white rounded-full transition-all duration-500"
            style={{ width: `${overallPercent}%` }}
          />
        </div>
      </div>

      {/* 2. Header & Controls Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
            <span>Task Studio</span>
            <span className="text-xs px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 font-bold">
              {filteredTasks.length} tasks
            </span>
          </h2>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            Organize, drag to reorder, prioritize, and crush your goals.
          </p>
        </div>

        {/* Action Buttons: Clear Completed, Sort Selector & Add Button */}
        <div className="flex items-center gap-2 flex-wrap">
          {hasActiveFilters && (
            <button
              onClick={() => {
                setCategoryFilter(null);
                setProjectFilter(null);
                setSearchQuery('');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-neutral-50 dark:bg-neutral-950/40 border border-black/10 dark:border-white/10 text-neutral-700 dark:text-neutral-300 text-xs font-bold transition hover:bg-neutral-100"
            >
              <FilterX size={14} />
              <span>Reset Filters</span>
            </button>
          )}

          {completedTasksCount > 0 && (
            <button
              onClick={clearCompletedTasks}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-black border border-black/10 dark:border-white/10 text-neutral-600 dark:text-neutral-400 hover:bg-black/5 dark:hover:bg-white/10 text-xs font-semibold transition"
              title="Clear all completed tasks"
            >
              <Trash2 size={14} />
              <span>Clear Completed</span>
            </button>
          )}

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-black/10 dark:border-white/10 bg-white dark:bg-black text-xs font-medium text-black dark:text-white">
            <ArrowUpDown size={14} className="text-black/50 dark:text-white/50" />
            <span>Sort:</span>
            <select
              value={taskSort}
              onChange={(e) => setTaskSort(e.target.value as TaskSortType)}
              aria-label="Sort tasks by"
              className="bg-transparent focus:outline-none font-bold text-black dark:text-white cursor-pointer"
            >
              <option value="dueDate">Due Date</option>
              <option value="priority">Priority</option>
              <option value="alphabetical">Alphabetical</option>
              <option value="recentlyAdded">Recently Added</option>
            </select>
          </div>

          <button
            onClick={() => openTaskModal()}
            className="gradient-pink-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold"
          >
            <Plus size={15} />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* 3. Filter Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
        {filterTabs.map((tab) => {
          const isActive = taskFilter === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setTaskFilter(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all border ${
                isActive
                  ? 'bg-black text-white dark:bg-white dark:text-black border-black dark:border-white'
                  : 'bg-neutral-50 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 border-black/5 dark:border-white/5'
              }`}
            >
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-md text-[10px] ${
                  isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 4. Task Cards List with Drag & Drop Reordering */}
      {filteredTasks.length === 0 ? (
        <div className="p-12 text-center rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 space-y-3">
          <div className="w-12 h-12 rounded-lg bg-neutral-100 dark:bg-neutral-900 text-black dark:text-white mx-auto flex items-center justify-center text-xl">
            <CheckCircle2 size={20} />
          </div>
          <h3 className="text-sm font-bold text-black dark:text-white">No tasks found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            You don't have any tasks matching your selected filters right now. Create a new task or adjust your search!
          </p>
          <button
            onClick={() => openTaskModal()}
            className="gradient-pink-btn px-4 py-2 rounded-lg text-xs font-bold mt-2"
          >
            + Create New Task
          </button>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="task-list">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="space-y-3"
              >
                {filteredTasks.map((task, index) => (
                  <Draggable key={task.id} draggableId={task.id} index={index}>
                    {(draggableProvided, snapshot) => (
                      <div
                        ref={draggableProvided.innerRef}
                        {...draggableProvided.draggableProps}
                        {...draggableProvided.dragHandleProps}
                        className={snapshot.isDragging ? 'opacity-90 scale-[1.01] z-50 shadow-lg' : ''}
                      >
                        <TaskCard task={task} onEdit={openTaskModal} />
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
