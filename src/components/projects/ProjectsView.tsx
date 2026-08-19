import React, { useState } from 'react';
import { FolderKanban, Folder, Plus, ChevronDown, ChevronRight, X } from 'lucide-react';
import { useStore } from '../../store/useStore';

export const ProjectsView: React.FC = () => {
  const { 
    folders, projects, tasks, 
    toggleFolderExpand, addFolder, addProject, 
    setProjectFilter, setActiveView 
  } = useStore();

  const [newFolderName, setNewFolderName] = useState('');
  const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);

  // Project Modal State
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [targetFolderId, setTargetFolderId] = useState<string>('');
  const [newProjName, setNewProjName] = useState('');
  const [selectedColor, setSelectedColor] = useState('#000000');

  const colorOptions = [
    '#000000', // Black
    '#333333', // Charcoal
    '#666666', // Dark Gray
    '#999999', // Gray
    '#cccccc', // Light Gray
    '#ffffff', // White
  ];

  const handleAddFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    addFolder(newFolderName.trim(), 'Folder');
    setNewFolderName('');
    setIsFolderModalOpen(false);
  };

  const handleOpenProjectModal = (folderId: string) => {
    setTargetFolderId(folderId);
    setNewProjName('');
    setSelectedColor('#000000');
    setIsProjectModalOpen(true);
  };

  const handleAddProject = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjName.trim()) return;
    addProject(newProjName.trim(), selectedColor, 'Layout', targetFolderId || folders[0]?.id);
    setNewProjName('');
    setIsProjectModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-12 animate-fadeIn">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-extrabold text-black dark:text-white tracking-tight flex items-center gap-2">
            <FolderKanban size={24} className="text-black dark:text-white" />
            <span>Nested Projects & Folders</span>
          </h2>
          <p className="text-xs text-neutral-400 font-medium mt-0.5">
            Organize complex workstreams into hierarchical folders & projects
          </p>
        </div>

        <button
          onClick={() => setIsFolderModalOpen(true)}
          className="gradient-pink-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold"
        >
          <Plus size={15} />
          <span>New Folder</span>
        </button>
      </div>

      {/* Folders List Grid */}
      <div className="space-y-6">
        {folders.map((folder) => {
          const folderProjects = projects.filter((p) => p.folderId === folder.id);

          return (
            <div key={folder.id} className="p-5 rounded-xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-950 space-y-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => toggleFolderExpand(folder.id)}
                  className="flex items-center gap-3 font-bold text-base text-black dark:text-white hover:opacity-85 transition animate-fadeIn"
                >
                  {folder.isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                  <Folder className="text-black dark:text-white" size={18} />
                  <span>{folder.name}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-neutral-100 dark:bg-neutral-900 text-neutral-500">
                    {folderProjects.length} Projects
                  </span>
                </button>

                <button
                  onClick={() => handleOpenProjectModal(folder.id)}
                  className="text-xs font-bold text-neutral-500 hover:text-black dark:hover:text-white hover:underline flex items-center gap-1 p-1 rounded-md"
                >
                  <Plus size={12} /> Add Project
                </button>
              </div>

              {/* Projects Inside Folder */}
              {folder.isExpanded && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
                  {folderProjects.length === 0 ? (
                    <div className="col-span-full py-8 text-center text-xs text-neutral-400 border border-dashed border-black/10 dark:border-white/10 rounded-xl">
                      No projects in this folder yet. Click "Add Project" above!
                    </div>
                  ) : (
                    folderProjects.map((proj) => {
                      const projTasks = tasks.filter((t) => t.projectId === proj.id);
                      const completed = projTasks.filter((t) => t.isCompleted).length;
                      const percent = projTasks.length > 0 ? Math.round((completed / projTasks.length) * 100) : 0;

                      return (
                        <div 
                          key={proj.id}
                          onClick={() => {
                            setProjectFilter(proj.id);
                            setActiveView('tasks');
                          }}
                          className="p-4 rounded-xl bg-white dark:bg-neutral-950 border border-black/10 dark:border-white/10 hover:border-black/30 dark:hover:border-white/30 transition cursor-pointer space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full border border-black/10 dark:border-white/10" style={{ backgroundColor: proj.color }} />
                              <h4 className="font-bold text-sm text-black dark:text-white">
                                {proj.name}
                              </h4>
                            </div>
                            <span className="text-xs font-bold text-black dark:text-white">{percent}%</span>
                          </div>

                          <div className="w-full h-1 bg-neutral-100 dark:bg-neutral-900 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-black dark:bg-white rounded-full transition-all"
                              style={{ width: `${percent}%` }}
                            />
                          </div>

                          <div className="flex items-center justify-between text-[10px] font-semibold text-neutral-400">
                            <span>{projTasks.length} Tasks</span>
                            <span>{completed} Completed</span>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Add Folder Modal */}
      {isFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md glass-modal rounded-xl p-6 space-y-4 relative">
            <button 
              onClick={() => setIsFolderModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-sm font-bold text-black dark:text-white">Add New Folder</h3>
            <form onSubmit={handleAddFolder} className="space-y-4">
              <input
                type="text"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder="Folder name (e.g. Work & Projects)"
                autoFocus
                required
                className="w-full px-4 py-2 text-xs font-semibold bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-black dark:focus:border-white"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFolderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-pink-btn px-3.5 py-1.5 rounded-lg text-xs font-bold"
                >
                  Create Folder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      {isProjectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
          <div className="w-full max-w-md glass-modal rounded-xl p-6 space-y-4 relative">
            <button 
              onClick={() => setIsProjectModalOpen(false)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-neutral-400 hover:text-black dark:hover:text-white"
            >
              <X size={18} />
            </button>
            <h3 className="text-sm font-bold text-black dark:text-white">Create New Project</h3>
            <form onSubmit={handleAddProject} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  value={newProjName}
                  onChange={(e) => setNewProjName(e.target.value)}
                  placeholder="e.g. Brand Redesign"
                  autoFocus
                  required
                  className="w-full px-4 py-2 text-xs font-semibold bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg focus:outline-none focus:border-black dark:focus:border-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                  Accent Shade
                </label>
                <div className="flex items-center gap-2 pt-1">
                  {colorOptions.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setSelectedColor(c)}
                      className={`w-6 h-6 rounded-full border border-black/10 dark:border-white/10 transition-transform ${
                        selectedColor === c ? 'scale-125 ring-2 ring-black dark:ring-white ring-offset-2' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-400 uppercase mb-1">
                  Target Folder
                </label>
                <select
                  value={targetFolderId}
                  onChange={(e) => setTargetFolderId(e.target.value)}
                  className="w-full px-4 py-2 bg-white dark:bg-black border border-black/10 dark:border-white/10 rounded-lg text-xs font-bold text-black dark:text-white focus:outline-none focus:border-black dark:focus:border-white"
                >
                  {folders.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsProjectModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-neutral-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="gradient-pink-btn px-3.5 py-1.5 rounded-lg text-xs font-bold"
                >
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
