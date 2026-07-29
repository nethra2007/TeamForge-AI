import React, { useState } from 'react';
import {
  Clock,
  PlayCircle,
  CheckCircle2,
  User,
  Search,
  ListFilter,
  ExternalLink,
  BookOpen,
  X,
  Edit2,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Check,
  CheckSquare,
  Package,
  AlertTriangle
} from 'lucide-react';
import {
  updateTaskStatusApi,
  editTaskApi,
  deleteTaskApi
} from '../services/agentApi';

export default function KanbanBoard({
  sprintPlanId,
  sprints = [],
  projectTitle = '',
  techStack = '',
  onTaskStatusUpdated = () => {},
  onTaskDeleted = () => {},
  onTaskEdited = () => {}
}) {
  const [activeSprintIndex, setActiveSprintIndex] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'To Do' | 'In Progress' | 'Completed' | 'High' | 'Medium' | 'Low'

  // Edit Task Modal State
  const [editModal, setEditModal] = useState({
    open: false,
    task: null,
    title: '',
    description: '',
    assignee: '',
    priority: 'Medium',
    estimatedHours: 8,
    suggestedDoc: ''
  });

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState({ open: false, task: null });

  const currentSprint = sprints[activeSprintIndex] || {
    sprintNumber: 1,
    sprintGoal: 'Foundation & Setup',
    tasks: []
  };

  const columns = [
    { key: 'To Do', label: 'To Do', icon: Clock, color: 'text-cyan-500 border-cyan-500/50' },
    { key: 'In Progress', label: 'In Progress', icon: PlayCircle, color: 'text-amber-500 border-amber-500/50' },
    { key: 'Completed', label: 'Completed', icon: CheckCircle2, color: 'text-emerald-500 border-emerald-500/50' }
  ];

  const handleStatusChange = async (taskId, newStatus) => {
    if (!sprintPlanId) return;

    try {
      await updateTaskStatusApi({
        sprintPlanId,
        sprintNumber: currentSprint.sprintNumber,
        taskId,
        newStatus
      });

      onTaskStatusUpdated(taskId, newStatus);
    } catch (err) {
      console.error('Failed to update task status:', err);
    }
  };

  const handleOpenEditModal = (task) => {
    setEditModal({
      open: true,
      task,
      title: task.title || '',
      description: task.description || '',
      assignee: task.assignee || 'Unassigned',
      priority: task.priority || 'Medium',
      estimatedHours: task.estimatedHours || 8,
      suggestedDoc: task.suggestedDoc || ''
    });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!sprintPlanId || !editModal.task) return;

    try {
      await editTaskApi({
        sprintPlanId,
        taskId: editModal.task.id,
        title: editModal.title,
        description: editModal.description,
        assignee: editModal.assignee,
        priority: editModal.priority,
        estimatedHours: editModal.estimatedHours,
        suggestedDoc: editModal.suggestedDoc
      });

      onTaskEdited(editModal.task.id, {
        title: editModal.title,
        description: editModal.description,
        assignee: editModal.assignee,
        priority: editModal.priority,
        estimatedHours: editModal.estimatedHours,
        suggestedDoc: editModal.suggestedDoc
      });

      setEditModal({ open: false, task: null, title: '', description: '', assignee: '', priority: 'Medium', estimatedHours: 8, suggestedDoc: '' });
    } catch (err) {
      console.error('Failed to edit task:', err);
    }
  };

  const handleDeleteTask = async () => {
    if (!sprintPlanId || !deleteModal.task) return;

    try {
      await deleteTaskApi({
        sprintPlanId,
        taskId: deleteModal.task.id
      });

      onTaskDeleted(deleteModal.task.id);
      setDeleteModal({ open: false, task: null });
    } catch (err) {
      console.error('Failed to delete task:', err);
    }
  };

  const filterTask = (task) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchAssignee = (task.assignee || '').toLowerCase().includes(q);
      const matchId = task.id.toLowerCase().includes(q);
      if (!matchTitle && !matchAssignee && !matchId) return false;
    }

    if (statusFilter === 'High' || statusFilter === 'Medium' || statusFilter === 'Low') {
      return task.priority === statusFilter;
    }

    if (statusFilter !== 'all') {
      const normalizedStatus = task.status === 'Done' ? 'Completed' : task.status;
      return normalizedStatus === statusFilter;
    }

    return true;
  };

  return (
    <div className="space-y-4">
      
      {/* Search & Filter Toolbar */}
      <div className="saas-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search task, assignee, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="saas-input pl-8 py-1.5 text-xs pr-8"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-200">
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-1 overflow-x-auto w-full sm:w-auto text-xs pb-1 sm:pb-0">
          <ListFilter className="w-3.5 h-3.5 text-gray-400 mr-1 hidden sm:inline" />
          {['all', 'To Do', 'In Progress', 'Completed', 'High', 'Medium', 'Low'].map((filterKey) => (
            <button
              key={filterKey}
              onClick={() => setStatusFilter(filterKey)}
              className={`px-2.5 py-1 rounded-lg capitalize font-mono text-[11px] font-bold whitespace-nowrap transition-all ${
                statusFilter === filterKey
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {filterKey}
            </button>
          ))}
        </div>
      </div>

      {/* Sprint Selector Tabs */}
      {sprints.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-gray-200 dark:border-gray-800">
          {sprints.map((sprint, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSprintIndex(idx)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSprintIndex === idx
                  ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-500/20'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              Sprint {sprint.sprintNumber}: {sprint.sprintGoal}
            </button>
          ))}
        </div>
      )}

      {/* 3 Kanban Columns Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {columns.map((col) => {
          const colTasks = (currentSprint.tasks || []).filter(t => {
            const taskStat = t.status === 'Done' ? 'Completed' : (t.status || 'To Do');
            return taskStat === col.key && filterTask(t);
          });
          const Icon = col.icon;

          return (
            <div key={col.key} className="bg-gray-50 dark:bg-[#151D2A] p-3.5 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <Icon className={`w-4 h-4 ${col.color}`} />
                    <span className="font-bold text-xs text-gray-900 dark:text-gray-100">
                      {col.label}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                    {colTasks.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[180px]">
                  {colTasks.map((task) => {
                    const normStatus = task.status === 'Done' ? 'Completed' : (task.status || 'To Do');

                    return (
                      <div
                        key={task.id || task.title}
                        className="saas-card p-3.5 bg-white dark:bg-[#1A2333] border border-gray-200 dark:border-gray-700/80 shadow-xs space-y-2.5 transition-all hover:border-cyan-500/40"
                      >
                        {/* Header ID, Priority & Action Buttons */}
                        <div className="flex items-center justify-between text-[10px] text-gray-400 font-mono">
                          <span className="font-bold text-gray-500 dark:text-gray-400">{task.id || 'SP-TASK'}</span>
                          
                          <div className="flex items-center gap-1.5">
                            <span className={`font-semibold px-1.5 py-0.5 rounded ${
                              task.priority === 'High'
                                ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                                : task.priority === 'Medium'
                                ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                : 'bg-brand-500/10 text-brand-500'
                            }`}>
                              {task.priority || 'Medium'}
                            </span>

                            <button
                              onClick={() => handleOpenEditModal(task)}
                              className="p-1 rounded text-gray-400 hover:text-white hover:bg-gray-800"
                              title="Edit Task"
                            >
                              <Edit2 className="w-3 h-3" />
                            </button>

                            <button
                              onClick={() => setDeleteModal({ open: true, task })}
                              className="p-1 rounded text-rose-400 hover:bg-rose-500/10"
                              title="Delete Task"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        {/* Title */}
                        <p className="text-xs font-bold text-gray-900 dark:text-gray-100 leading-snug">
                          {task.title}
                        </p>

                        {/* Description */}
                        {task.description && (
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-2 leading-tight">
                            {task.description}
                          </p>
                        )}

                        {/* Acceptance Criteria */}
                        {task.acceptanceCriteria && task.acceptanceCriteria.length > 0 && (
                          <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 space-y-1">
                            <span className="text-[9px] font-mono font-bold text-cyan-400 uppercase tracking-wider block">
                              Acceptance Criteria
                            </span>
                            <ul className="text-[10px] text-gray-600 dark:text-gray-300 space-y-0.5 list-disc list-inside">
                              {task.acceptanceCriteria.map((c, i) => (
                                <li key={i} className="truncate">{c}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Assignee & Hours */}
                        <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-gray-800 text-[11px] text-gray-500 dark:text-gray-400">
                          <div className="flex items-center gap-1">
                            <User className="w-3 h-3 text-cyan-500" />
                            <span className="truncate max-w-[100px] font-medium text-gray-700 dark:text-gray-300">{task.assignee || 'Unassigned'}</span>
                          </div>
                          {task.estimatedHours && (
                            <span className="font-mono text-[10px] text-cyan-400">{task.estimatedHours}h</span>
                          )}
                        </div>

                        {/* Explicit Task Movement Action Buttons */}
                        <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                          {normStatus === 'To Do' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStatusChange(task.id, 'In Progress')}
                                className="flex-1 py-1 px-2 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-amber-500/30 transition-colors"
                              >
                                <span>Start Task</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, 'Completed')}
                                className="py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-500/30 transition-colors"
                                title="Mark as Completed"
                              >
                                <Check className="w-3 h-3" />
                              </button>
                            </div>
                          )}

                          {normStatus === 'In Progress' && (
                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={() => handleStatusChange(task.id, 'To Do')}
                                className="py-1 px-2 rounded-lg bg-gray-500/10 hover:bg-gray-500/20 text-gray-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-gray-500/30 transition-colors"
                              >
                                <ArrowLeft className="w-3 h-3" />
                                <span>To Do</span>
                              </button>
                              <button
                                onClick={() => handleStatusChange(task.id, 'Completed')}
                                className="flex-1 py-1 px-2 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-emerald-500/30 transition-colors"
                              >
                                <span>Finish Task</span>
                                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                              </button>
                            </div>
                          )}

                          {normStatus === 'Completed' && (
                            <button
                              onClick={() => handleStatusChange(task.id, 'In Progress')}
                              className="w-full py-1 px-2 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-[11px] font-bold flex items-center justify-center gap-1 border border-cyan-500/30 transition-colors"
                            >
                              <ArrowLeft className="w-3 h-3" />
                              <span>Re-open Task</span>
                            </button>
                          )}
                        </div>

                      </div>
                    );
                  })}

                  {colTasks.length === 0 && (
                    <div className="h-full flex items-center justify-center p-6 text-center text-xs text-gray-400 border border-dashed border-gray-200 dark:border-gray-800 rounded-xl font-mono">
                      No tasks in {col.label}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Task Modal */}
      {editModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveEdit} className="saas-card p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-cyan-500" /> Edit Kanban Task
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Task Title
              </label>
              <input
                type="text"
                value={editModal.title}
                onChange={(e) => setEditModal({ ...editModal, title: e.target.value })}
                className="saas-input text-xs"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Description
              </label>
              <textarea
                rows={3}
                value={editModal.description}
                onChange={(e) => setEditModal({ ...editModal, description: e.target.value })}
                className="saas-input text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Assignee
                </label>
                <input
                  type="text"
                  value={editModal.assignee}
                  onChange={(e) => setEditModal({ ...editModal, assignee: e.target.value })}
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Priority
                </label>
                <select
                  value={editModal.priority}
                  onChange={(e) => setEditModal({ ...editModal, priority: e.target.value })}
                  className="saas-input text-xs"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Estimated Hours
              </label>
              <input
                type="number"
                min={1}
                max={40}
                value={editModal.estimatedHours}
                onChange={(e) => setEditModal({ ...editModal, estimatedHours: parseInt(e.target.value, 10) })}
                className="saas-input text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setEditModal({ open: false, task: null, title: '', description: '', assignee: '', priority: 'Medium', estimatedHours: 8, suggestedDoc: '' })}
                className="saas-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="saas-btn-primary text-xs bg-cyan-600 hover:bg-cyan-500"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="saas-card p-6 max-w-md w-full space-y-4 border-rose-500/30">
            <div className="flex items-center gap-3 text-rose-500">
              <AlertTriangle className="w-6 h-6" />
              <h3 className="font-bold text-base text-gray-900 dark:text-white">
                Delete Task?
              </h3>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{deleteModal.task?.title}"</strong>?
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, task: null })}
                className="saas-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteTask}
                className="saas-btn-primary text-xs bg-rose-600 hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
