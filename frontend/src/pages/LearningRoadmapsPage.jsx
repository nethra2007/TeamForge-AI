import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import {
  Compass,
  Calendar,
  Zap,
  TrendingUp,
  Clock,
  Eye,
  Edit2,
  Copy,
  Trash2,
  Download,
  Plus,
  Trophy,
  CheckCircle2,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import {
  getAllSkillPathsApi,
  renameSkillPathApi,
  duplicateSkillPathApi,
  deleteSkillPathApi,
  selectActiveSkillPathApi
} from '../services/agentApi';

export default function LearningRoadmapsPage() {
  const navigate = useNavigate();
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Modal / Action states
  const [renameModal, setRenameModal] = useState({ open: false, id: '', currentTitle: '' });
  const [deleteModal, setDeleteModal] = useState({ open: false, id: '', title: '' });

  const fetchRoadmaps = async () => {
    setLoading(true);
    try {
      const res = await getAllSkillPathsApi();
      if (res.data?.roadmaps) {
        setRoadmaps(res.data.roadmaps);
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to fetch learning roadmaps.' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const handleSelectActive = async (id) => {
    try {
      await selectActiveSkillPathApi(id);
      setToast({ type: 'success', message: 'Roadmap set as active!' });
      navigate('/agents/skill-path');
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to select roadmap.' });
    }
  };

  const handleRename = async (e) => {
    e.preventDefault();
    if (!renameModal.id || !renameModal.currentTitle.trim()) return;

    try {
      await renameSkillPathApi(renameModal.id, { targetCareer: renameModal.currentTitle.trim() });
      setToast({ type: 'success', message: 'Roadmap renamed successfully.' });
      setRenameModal({ open: false, id: '', currentTitle: '' });
      fetchRoadmaps();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to rename roadmap.' });
    }
  };

  const handleDuplicate = async (id) => {
    try {
      await duplicateSkillPathApi(id);
      setToast({ type: 'success', message: 'Roadmap duplicated successfully!' });
      fetchRoadmaps();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to duplicate roadmap.' });
    }
  };

  const handleDelete = async () => {
    if (!deleteModal.id) return;
    try {
      await deleteSkillPathApi(deleteModal.id);
      setToast({ type: 'success', message: 'Roadmap deleted successfully.' });
      setDeleteModal({ open: false, id: '', title: '' });
      fetchRoadmaps();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to delete roadmap.' });
    }
  };

  const handleExportPDF = (roadmap) => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${roadmap.targetCareer} - SkillPath Roadmap</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 2px solid #10b981; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #047857; margin: 0; }
            .meta { font-size: 12px; color: #6b7280; margin-top: 5px; }
            .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: bold; background: #ecfdf5; color: #047857; border-radius: 4px; }
            .week-box { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; }
            .week-title { font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 8px; }
            .task-item { font-size: 12px; margin: 4px 0; color: #374151; }
            .task-completed { text-decoration: line-through; color: #10b981; }
            .resource-item { font-size: 11px; color: #2563eb; text-decoration: underline; margin-top: 3px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="badge">TeamForge SkillPath AI Curriculum</div>
            <h1 class="title">${roadmap.targetCareer}</h1>
            <div class="meta">
              Overall Progress: ${roadmap.overallProgress || 0}% | Status: ${roadmap.status || 'In Progress'} | XP: ${roadmap.userXP || 0} XP (${roadmap.skillLevel || 'Beginner'})
            </div>
          </div>

          ${roadmap.weeklyRoadmap?.map((w) => `
            <div class="week-box">
              <div class="week-title">Week ${w.week}: ${w.title} (Progress: ${w.progress || 0}%)</div>
              <div><strong>Tasks:</strong></div>
              ${w.tasks?.map((t) => `
                <div class="task-item ${t.completed ? 'task-completed' : ''}">
                  ${t.completed ? '☑' : '☐'} ${t.text} (${t.difficulty || 'Medium'})
                </div>
              `).join('')}
              <div style="margin-top: 8px;"><strong>Curated Resources:</strong></div>
              ${w.resources?.map((r) => `
                <div class="resource-item">• [${r.platform || 'Resource'}] ${r.title} - ${r.url}</div>
              `).join('')}
            </div>
          `).join('')}
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4 gap-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                  LMS Management
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Learning Roadmaps
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Persistent catalog of all your AI-generated SkillPath learning roadmaps. View, track progress, duplicate, or export as PDF.
              </p>
            </div>

            <button
              onClick={() => navigate('/agents/skill-path')}
              className="saas-btn-primary text-xs bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 w-fit"
            >
              <Plus className="w-4 h-4" />
              <span>Generate New Roadmap</span>
            </button>
          </div>

          {/* Roadmaps Grid */}
          {loading ? (
            <div className="saas-card p-12 text-center text-gray-400 font-mono text-xs animate-pulse">
              Loading saved roadmaps from MongoDB...
            </div>
          ) : roadmaps.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {roadmaps.map((item) => (
                <div
                  key={item._id}
                  className={`saas-card p-5 space-y-4 flex flex-col justify-between border transition-all ${
                    item.isActive
                      ? 'border-emerald-500/50 shadow-emerald-500/10 shadow-lg'
                      : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Header Badges */}
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-emerald-500" />
                        {new Date(item.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {item.isActive && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            Active
                          </span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            item.status === 'Completed'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-brand-500/10 text-brand-400 border border-brand-500/20'
                          }`}
                        >
                          {item.status || 'In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Title */}
                    <div>
                      <h3 className="font-extrabold text-base text-gray-900 dark:text-white line-clamp-1">
                        {item.targetCareer}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        Duration: {item.estimatedDuration || '4 Weeks'}
                      </p>
                    </div>

                    {/* Progress Bar & XP */}
                    <div className="space-y-1.5 pt-1 border-t border-gray-100 dark:border-gray-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-600 dark:text-gray-300 flex items-center gap-1">
                          <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Progress
                        </span>
                        <span className="text-emerald-500 font-mono">
                          {item.overallProgress || 0}%
                        </span>
                      </div>

                      <div className="w-full h-2 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-300"
                          style={{ width: `${item.overallProgress || 0}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 font-mono pt-1">
                        <span className="flex items-center gap-1 text-emerald-400 font-bold">
                          <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" /> {item.userXP || 0} XP ({item.skillLevel || 'Beginner'})
                        </span>
                        <span>Est: {item.estimatedCompletionDate || '4 Weeks'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Toolbar */}
                  <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between gap-1.5">
                    <button
                      onClick={() => handleSelectActive(item._id)}
                      className="saas-btn-primary text-xs py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 flex items-center gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{item.isActive ? 'View Active' : 'Continue'}</span>
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setRenameModal({ open: true, id: item._id, currentTitle: item.targetCareer })}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Rename Career Goal"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDuplicate(item._id)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Duplicate Roadmap"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleExportPDF(item)}
                        className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Export as PDF"
                      >
                        <Download className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteModal({ open: true, id: item._id, title: item.targetCareer })}
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                        title="Delete Roadmap"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="saas-card p-12 text-center text-gray-400 space-y-3">
              <Compass className="w-10 h-10 mx-auto text-emerald-500/50" />
              <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                No Learning Roadmaps Found
              </p>
              <p className="text-xs max-w-sm mx-auto text-gray-400">
                Click "Generate New Roadmap" to compile your first AI-guided SkillPath curriculum.
              </p>
            </div>
          )}

        </main>
      </div>

      {/* Rename Modal */}
      {renameModal.open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleRename} className="saas-card p-6 max-w-md w-full space-y-4">
            <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-emerald-500" /> Rename Learning Roadmap
            </h3>

            <div>
              <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                Target Career Goal / Title
              </label>
              <input
                type="text"
                value={renameModal.currentTitle}
                onChange={(e) => setRenameModal({ ...renameModal, currentTitle: e.target.value })}
                className="saas-input text-xs"
                required
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setRenameModal({ open: false, id: '', currentTitle: '' })}
                className="saas-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="saas-btn-primary text-xs bg-emerald-600 hover:bg-emerald-500"
              >
                Save Title
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
                Delete Learning Roadmap?
              </h3>
            </div>

            <p className="text-xs text-gray-500 dark:text-gray-400">
              Are you sure you want to delete <strong className="text-gray-900 dark:text-white">"{deleteModal.title}"</strong>? This will permanently remove all stored progress and XP for this curriculum.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setDeleteModal({ open: false, id: '', title: '' })}
                className="saas-btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="saas-btn-primary text-xs bg-rose-600 hover:bg-rose-500"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
