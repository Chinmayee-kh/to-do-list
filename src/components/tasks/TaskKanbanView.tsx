import React from 'react';
import { Plus } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import type { DropResult } from '@hello-pangea/dnd';
import { useStore } from '../../store/useStore';
import { TaskCard } from './TaskCard';

export const TaskKanbanView: React.FC = () => {
  const { tasks, openTaskModal, moveTaskKanban } = useStore();

  const getTaskStatus = (t: any) => {
    if (t.kanbanStatus) return t.kanbanStatus;
    if (t.isCompleted) return 'completed';
    if (t.subtasks && t.subtasks.some((s: any) => s.isCompleted)) return 'inprogress';
    return 'todo';
  };

  const todoTasks = tasks.filter((t) => getTaskStatus(t) === 'todo');
  const inProgressTasks = tasks.filter((t) => getTaskStatus(t) === 'inprogress');
  const completedTasks = tasks.filter((t) => getTaskStatus(t) === 'completed');

  const columns = [
    { id: 'todo', title: 'To Do', items: todoTasks },
    { id: 'inprogress', title: 'In Progress', items: inProgressTasks },
    { id: 'completed', title: 'Completed', items: completedTasks },
  ];

  const handleDragEnd = (result: DropResult) => {
    const { destination, draggableId } = result;
    if (!destination) return;
    const destColumnId = destination.droppableId as 'todo' | 'inprogress' | 'completed';
    moveTaskKanban(draggableId, destColumnId);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight">
            Kanban Board
          </h2>
          <p className="text-xs text-neutral-400 font-medium">
            Drag & drop tasks across workflow stages
          </p>
        </div>
        <button
          onClick={() => openTaskModal()}
          className="gradient-pink-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold"
        >
          <Plus size={15} />
          <span>Add Task</span>
        </button>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {columns.map((col) => (
            <div 
              key={col.id}
              className="p-4 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-black dark:text-white flex items-center gap-2">
                  <span>{col.title}</span>
                  <span className="px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400 text-xs font-bold">
                    {col.items.length}
                  </span>
                </h3>
              </div>

              <Droppable droppableId={col.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`space-y-3 min-h-[350px] p-1 rounded-xl transition-colors ${
                      snapshot.isDraggingOver ? 'bg-neutral-50/50 dark:bg-neutral-900/50 border border-dashed border-black/20 dark:border-white/20' : ''
                    }`}
                  >
                    {col.items.length === 0 ? (
                      <div className="text-center py-12 text-xs text-neutral-400 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                        No tasks in this column
                      </div>
                    ) : (
                      col.items.map((task, index) => (
                        <Draggable key={task.id} draggableId={task.id} index={index}>
                          {(draggableProvided, draggableSnapshot) => (
                            <div
                              ref={draggableProvided.innerRef}
                              {...draggableProvided.draggableProps}
                              {...draggableProvided.dragHandleProps}
                              className={draggableSnapshot.isDragging ? 'opacity-90 scale-[1.01] z-50' : ''}
                            >
                              <TaskCard task={task} onEdit={openTaskModal} />
                            </div>
                          )}
                        </Draggable>
                      ))
                    )}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};
