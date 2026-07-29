import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { usePipeline } from '../../context/PipelineContext';
import {
  runSkillPathApi,
  getSkillPathActiveApi,
  toggleSkillPathTaskApi,
  toggleResourceBookmarkApi,
  toggleResourceCompleteApi
} from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import {
  Compass,
  Sparkles,
  ExternalLink,
  Calendar,
  BookOpen,
  AlertCircle,
  Award,
  Zap,
  CheckSquare,
  Square,
  Trophy,
  CheckCircle2,
  TrendingUp,
  Clock,
  Lock,
  Search,
  Download,
  Star,
  CheckCircle,
  ListFilter,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function SkillPathPage() {
  const { userProfile } = useUser();
  const { setAgentOutput } = usePipeline();

  const [currentSkills, setCurrentSkills] = useState(userProfile.skills?.join(', ') || 'React.js, Node.js, Python, Tailwind CSS');
  const [targetCareer, setTargetCareer] = useState(userProfile.targetCareer || 'Senior AI Engineer');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [isLoadedFromDB, setIsLoadedFromDB] = useState(false);

  // Search & Filter state with sessionStorage persistence
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('skillpath_search') || '');
  const [taskFilter, setTaskFilter] = useState(() => sessionStorage.getItem('skillpath_filter') || 'all'); // 'all' | 'pending' | 'completed' | 'current'

  // Restore Scroll Position on Mount and save on Scroll
  useEffect(() => {
    const savedScroll = sessionStorage.getItem('skillpath_scroll');
    if (savedScroll) {
      setTimeout(() => {
        window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'smooth' });
      }, 200);
    }

    const handleScroll = () => {
      sessionStorage.setItem('skillpath_scroll', window.scrollY.toString());
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Save Search & Filter state to sessionStorage
  useEffect(() => {
    sessionStorage.setItem('skillpath_search', searchTerm);
  }, [searchTerm]);

  useEffect(() => {
    sessionStorage.setItem('skillpath_filter', taskFilter);
  }, [taskFilter]);

  // Load existing active plan from MongoDB on mount
  useEffect(() => {
    const fetchActivePlan = async () => {
      try {
        const res = await getSkillPathActiveApi();
        if (res.data?.weeklyRoadmap && res.data.weeklyRoadmap.length > 0) {
          setResult({
            executionTime: 'Loaded from DB',
            metadata: { provider: 'MongoDB Persistent Tracker' },
            output: res.data
          });
          setAgentOutput('skillPathOutput', res.data);
          setIsLoadedFromDB(true);
        }
      } catch (err) {
        // Silent catch if no stored plan
      }
    };

    fetchActivePlan();
  }, []);

  const handleRunAgent = async (e, forceNew = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await runSkillPathApi({
        currentSkills: currentSkills.split(',').map(s => s.trim()),
        targetCareer,
        forceNew
      });
      setResult(res);
      setAgentOutput('skillPathOutput', res.output);
      setIsLoadedFromDB(res.output?.isLoadedFromDB || false);

      if (res.output?.isLoadedFromDB) {
        setToast({ type: 'info', message: 'Loaded your previously generated roadmap.' });
      } else {
        setToast({ type: 'success', message: 'SkillPath AI executed! Interactive learning roadmap active.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'SkillPath execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTask = async (weekNumber, taskId, currentCompletedState) => {
    if (!result?.output) return;

    const targetWeek = result.output.weeklyRoadmap.find(w => w.week === weekNumber);
    if (targetWeek && !targetWeek.isUnlocked) {
      setToast({ type: 'warning', message: `Week ${weekNumber} is locked! Complete Week ${weekNumber - 1} to 100% to unlock.` });
      return;
    }

    const newCompleted = !currentCompletedState;

    // Optimistic UI Update
    let prevWeekDone = true;
    const updatedRoadmap = result.output.weeklyRoadmap.map(w => {
      if (w.week === weekNumber) {
        const updatedTasks = w.tasks.map(t => {
          if (t.id === taskId) {
            return { ...t, completed: newCompleted };
          }
          return t;
        });

        const completedCount = updatedTasks.filter(t => t.completed).length;
        const progress = Math.round((completedCount / updatedTasks.length) * 100);
        const isCompleted = progress === 100;

        return {
          ...w,
          tasks: updatedTasks,
          progress,
          isCompleted,
          isUnlocked: w.week === 1 ? true : prevWeekDone
        };
      }

      const isUnlocked = w.week === 1 ? true : prevWeekDone;
      prevWeekDone = w.isCompleted;

      return {
        ...w,
        isUnlocked
      };
    });

    let totalTasks = 0;
    let completedTasks = 0;
    let totalXP = 0;

    updatedRoadmap.forEach(w => {
      w.tasks.forEach(t => {
        totalTasks += 1;
        if (t.completed) {
          completedTasks += 1;
          totalXP += (t.xp || (t.difficulty === 'Simple' ? 10 : t.difficulty === 'Advanced' ? 30 : 20));
        }
      });
    });

    const overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);
    const skillLevel = totalXP < 100 ? 'Beginner' : totalXP < 300 ? 'Intermediate' : 'Advanced';

    const updatedOutput = {
      ...result.output,
      weeklyRoadmap: updatedRoadmap,
      overallProgress,
      userXP: totalXP,
      skillLevel
    };

    setResult({
      ...result,
      output: updatedOutput
    });

    // Backend sync
    try {
      const planId = result.output.planId;
      await toggleSkillPathTaskApi({
        planId,
        weekNumber,
        taskId,
        completed: newCompleted
      });

      if (overallProgress === 100) {
        setToast({ type: 'success', message: '🏆 Congratulations! You have completed your SkillPath roadmap!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to sync task progress to MongoDB.' });
    }
  };

  const handleToggleBookmark = async (weekNumber, resourceId, currentBookmarked) => {
    if (!result?.output) return;

    const newBookmarked = !currentBookmarked;
    const updatedRoadmap = result.output.weeklyRoadmap.map(w => {
      if (w.week === weekNumber) {
        const updatedResources = (w.resources || []).map(r => {
          if (r.id === resourceId) {
            return { ...r, bookmarked: newBookmarked };
          }
          return r;
        });
        return { ...w, resources: updatedResources };
      }
      return w;
    });

    setResult({
      ...result,
      output: { ...result.output, weeklyRoadmap: updatedRoadmap }
    });

    try {
      await toggleResourceBookmarkApi({
        planId: result.output.planId,
        weekNumber,
        resourceId,
        bookmarked: newBookmarked
      });
    } catch (e) {}
  };

  const handleToggleResourceComplete = async (weekNumber, resourceId, currentCompleted) => {
    if (!result?.output) return;

    const newCompleted = !currentCompleted;
    const updatedRoadmap = result.output.weeklyRoadmap.map(w => {
      if (w.week === weekNumber) {
        const updatedResources = (w.resources || []).map(r => {
          if (r.id === resourceId) {
            return { ...r, completed: newCompleted };
          }
          return r;
        });
        return { ...w, resources: updatedResources };
      }
      return w;
    });

    setResult({
      ...result,
      output: { ...result.output, weeklyRoadmap: updatedRoadmap }
    });

    try {
      await toggleResourceCompleteApi({
        planId: result.output.planId,
        weekNumber,
        resourceId,
        completed: newCompleted
      });
    } catch (e) {}
  };

  const handleExportPDF = () => {
    if (!result?.output) return;
    const roadmap = result.output;
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
            .resource-item { font-size: 11px; color: #2563eb; margin-top: 3px; }
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

  const isRoadmapCompleted = result?.output?.overallProgress === 100;

  // Determine current active week number (first unlocked week with progress < 100%)
  const currentActiveWeekNumber = result?.output?.weeklyRoadmap?.find(w => !w.isCompleted && w.isUnlocked)?.week
    || result?.output?.weeklyRoadmap?.[result.output.weeklyRoadmap.length - 1]?.week || 1;

  // Comprehensive Search and Filter Logic
  const filterTask = (task, week) => {
    // 1. Search Query Matching
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase().trim();
      const taskTextMatch = task.text.toLowerCase().includes(q);
      const weekTitleMatch = week.title.toLowerCase().includes(q);
      const focusSkillsMatch = Array.isArray(week.focusSkills) && week.focusSkills.some(fs => fs.toLowerCase().includes(q));
      const resourcesMatch = Array.isArray(week.resources) && week.resources.some(r => r.title.toLowerCase().includes(q) || (r.platform && r.platform.toLowerCase().includes(q)));

      if (!taskTextMatch && !weekTitleMatch && !focusSkillsMatch && !resourcesMatch) {
        return false;
      }
    }

    // 2. Chip Filter Matching
    if (taskFilter === 'pending') return task.completed === false;
    if (taskFilter === 'completed') return task.completed === true;
    if (taskFilter === 'current') return week.week === currentActiveWeekNumber;

    return true; // 'all'
  };

  // Calculate total matching tasks across all weeks
  const totalMatchingTasks = result?.output?.weeklyRoadmap?.reduce((acc, week) => {
    const matchingInWeek = (week.tasks || []).filter(t => filterTask(t, week));
    return acc + matchingInWeek.length;
  }, 0) || 0;

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
                  Agent 04
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  SkillPath AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Persistent AI Learning Management System with week unlock, multi-platform resources, task tracking & certificates.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/learning-roadmaps" className="saas-btn-secondary text-xs">
                <Compass className="w-3.5 h-3.5 text-emerald-500" />
                <span>Roadmaps History</span>
              </Link>
              <Link to="/agents/placement-prep" className="saas-btn-secondary text-xs hidden sm:inline-flex">
                <span>PlacementPrep &rarr;</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Form */}
            <form onSubmit={(e) => handleRunAgent(e, true)} className="saas-card p-5 space-y-4 lg:col-span-1 h-fit">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-500" />
                <span>Career Target</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Current Skills
                </label>
                <input
                  type="text"
                  value={currentSkills}
                  onChange={(e) => setCurrentSkills(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Target Career Role
                </label>
                <input
                  type="text"
                  value={targetCareer}
                  onChange={(e) => setTargetCareer(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div className="space-y-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="saas-btn-primary w-full py-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Generating Roadmap...' : result ? 'Regenerate Roadmap' : 'Generate Learning Path'}</span>
                </button>

                {result && (
                  <button
                    type="button"
                    onClick={handleExportPDF}
                    className="saas-btn-secondary w-full py-2 text-xs flex items-center justify-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Roadmap PDF</span>
                  </button>
                )}
              </div>
            </form>

            {/* Output Studio & Interactive Tracker */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Auto Load Notification Banner */}
                  {isLoadedFromDB && (
                    <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Loaded your previously generated roadmap from MongoDB.</span>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-500">Auto-Loaded</span>
                    </div>
                  )}

                  {/* Search & Filter Toolbar */}
                  <div className="saas-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="relative w-full sm:w-64">
                      <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search tasks, topics, resources..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="saas-input pl-8 py-1.5 text-xs pr-8"
                      />
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-1 w-full sm:w-auto text-xs">
                      <ListFilter className="w-3.5 h-3.5 text-gray-400 mr-1 hidden sm:inline" />
                      {[
                        { key: 'all', label: 'All' },
                        { key: 'pending', label: 'Pending' },
                        { key: 'completed', label: 'Completed' },
                        { key: 'current', label: 'Current' }
                      ].map((chip) => (
                        <button
                          key={chip.key}
                          onClick={() => setTaskFilter(chip.key)}
                          className={`px-3 py-1 rounded-lg font-mono text-[11px] font-bold transition-all ${
                            taskFilter === chip.key
                              ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-500/20'
                              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                          }`}
                        >
                          {chip.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Metadata & Progress Banner */}
                  <div className="saas-card p-5 bg-gradient-to-r from-emerald-900/10 via-teal-900/10 to-transparent border-emerald-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-500">
                          Active SkillPath Curriculum
                        </span>
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                          Target Goal: {result.output.targetCareer}
                        </h3>
                      </div>

                      {/* XP & Level Badge */}
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                          <span>{result.output.userXP || 0} XP</span>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl bg-brand-500/10 border border-brand-500/30 text-brand-400 text-xs font-bold">
                          Level: {result.output.skillLevel || 'Beginner'}
                        </span>
                      </div>
                    </div>

                    {/* Overall Progress Bar */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                          <TrendingUp className="w-4 h-4 text-emerald-500" /> Overall Progress
                        </span>
                        <span className="text-emerald-500 font-mono text-sm">
                          {result.output.overallProgress || 0}%
                        </span>
                      </div>

                      <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden p-0.5">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                          style={{ width: `${result.output.overallProgress || 0}%` }}
                        />
                      </div>

                      {result.output.estimatedCompletionDate && (
                        <p className="text-[11px] text-gray-500 dark:text-gray-400 pt-1 flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-emerald-500" /> Estimated Completion Date: <strong className="text-gray-800 dark:text-gray-200">{result.output.estimatedCompletionDate}</strong>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* 100% Roadmap Completed Banner & Verified Certificate */}
                  {isRoadmapCompleted && (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-between shadow-lg shadow-emerald-500/20">
                        <div className="flex items-center gap-3">
                          <Trophy className="w-8 h-8 text-amber-300" />
                          <div>
                            <h4 className="font-black text-base">🏆 Congratulations! Roadmap Completed</h4>
                            <p className="text-xs text-emerald-100">You have successfully completed 100% of your SkillPath roadmap!</p>
                          </div>
                        </div>
                      </div>

                      {/* Verified Completion Certificate Card */}
                      <div className="saas-card p-6 border-2 border-emerald-500/40 bg-gradient-to-b from-emerald-950/20 via-gray-900/90 to-gray-900 text-center space-y-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-24 h-24 rounded-full bg-emerald-500/10 border border-emerald-500/20" />
                        
                        <div className="space-y-1">
                          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
                            Official Verified Certificate
                          </div>
                          <h3 className="text-xl font-black tracking-tight text-white pt-2">
                            Certificate of Skill Mastery
                          </h3>
                          <p className="text-xs text-gray-400">This certifies that</p>
                        </div>

                        <div className="py-2 border-y border-emerald-500/20 max-w-md mx-auto">
                          <h2 className="text-2xl font-black text-emerald-400">
                            {userProfile.name || 'Alex Morgan'}
                          </h2>
                          <p className="text-xs text-gray-300 mt-1">
                            has successfully mastered the curriculum for <strong className="text-white">{result.output.targetCareer}</strong>
                          </p>
                        </div>

                        <div className="flex items-center justify-center gap-6 text-xs text-gray-400 font-mono">
                          <div>
                            <span className="block text-[10px] text-gray-500">TOTAL XP</span>
                            <strong className="text-emerald-400 text-sm">{result.output.userXP} XP</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-gray-500">MASTERY LEVEL</span>
                            <strong className="text-white text-sm">{result.output.skillLevel}</strong>
                          </div>
                          <div>
                            <span className="block text-[10px] text-gray-500">STATUS</span>
                            <strong className="text-emerald-400 text-sm">VERIFIED</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Identified Skill Gaps */}
                  {result.output.missingSkills && result.output.missingSkills.length > 0 && (
                    <div className="saas-card p-5 border-l-4 border-l-emerald-500 space-y-2">
                      <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5" /> Target Skill Gaps
                      </span>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {result.output.missingSkills.map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Weekly Roadmap Checklist */}
                  <div className="saas-card p-5 space-y-5">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-emerald-500" />
                        <span>Interactive Learning Curriculum</span>
                      </h4>
                      <span className="text-[10px] font-mono text-gray-400">
                        {taskFilter !== 'all' || searchTerm ? `Filtered View (${totalMatchingTasks} tasks)` : 'Complete preceding weeks to unlock subsequent weeks'}
                      </span>
                    </div>

                    {/* No Results Message */}
                    {totalMatchingTasks === 0 ? (
                      <div className="p-8 text-center text-gray-400 space-y-2 saas-card bg-gray-50/50 dark:bg-gray-800/30">
                        <Search className="w-8 h-8 mx-auto text-emerald-500/50" />
                        <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                          No matching learning tasks found.
                        </p>
                        <p className="text-xs text-gray-400 max-w-xs mx-auto">
                          {searchTerm
                            ? `No tasks match search "${searchTerm}" under filter "${taskFilter.toUpperCase()}".`
                            : `No tasks found under filter "${taskFilter.toUpperCase()}".`}
                        </p>
                        <button
                          onClick={() => { setSearchTerm(''); setTaskFilter('all'); }}
                          className="saas-btn-secondary text-xs mt-2 text-emerald-500 hover:text-emerald-400"
                        >
                          Clear Filters
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-5">
                        {result.output.weeklyRoadmap?.map((week) => {
                          const isUnlocked = week.isUnlocked !== false;
                          const matchingTasksInWeek = (week.tasks || []).filter(t => filterTask(t, week));

                          // If searching or filtering, hide weeks that contain 0 matching tasks
                          if ((searchTerm || taskFilter !== 'all') && matchingTasksInWeek.length === 0) {
                            return null;
                          }

                          return (
                            <div
                              key={week.week}
                              className={`p-4 rounded-2xl border transition-all relative ${
                                !isUnlocked
                                  ? 'bg-gray-100/60 dark:bg-gray-900/60 border-gray-200 dark:border-gray-800 opacity-75'
                                  : week.isCompleted
                                  ? 'bg-emerald-500/5 border-emerald-500/40'
                                  : 'bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/70'
                              }`}
                            >
                              {/* Locked Overlay Banner */}
                              {!isUnlocked && (
                                <div className="mb-3 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500 text-xs font-bold flex items-center gap-2">
                                  <Lock className="w-4 h-4 flex-shrink-0" />
                                  <span>Week {week.week} Locked — Complete Week {week.week - 1} to 100% to unlock this curriculum!</span>
                                </div>
                              )}

                              <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs font-extrabold text-emerald-500 uppercase">
                                    Week {week.week}
                                  </span>
                                  {week.isCompleted && (
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                                      🎉 Week Completed
                                    </span>
                                  )}
                                </div>

                                {/* Week Progress Score */}
                                <div className="flex items-center gap-2">
                                  <span className="text-[11px] font-mono font-bold text-gray-600 dark:text-gray-300">
                                    Week Progress: {week.progress || 0}%
                                  </span>
                                  <div className="w-16 h-2 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
                                    <div
                                      className="h-full bg-emerald-500 transition-all duration-300"
                                      style={{ width: `${week.progress || 0}%` }}
                                    />
                                  </div>
                                </div>
                              </div>

                              <h5 className="font-bold text-xs text-gray-900 dark:text-white mb-3">
                                {week.title}
                              </h5>

                              {/* Focus Skills */}
                              {week.focusSkills && week.focusSkills.length > 0 && (
                                <div className="flex flex-wrap gap-1.5 mb-3">
                                  {week.focusSkills.map((fs, i) => (
                                    <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 font-mono">
                                      {fs}
                                    </span>
                                  ))}
                                </div>
                              )}

                              {/* Interactive Tasks Checkboxes */}
                              <div className="space-y-2 pt-1 border-t border-gray-200/60 dark:border-gray-700/60">
                                {matchingTasksInWeek.map((task) => (
                                  <div
                                    key={task.id}
                                    onClick={() => handleToggleTask(week.week, task.id, task.completed)}
                                    className={`flex items-start gap-2.5 p-2 rounded-xl transition-colors ${
                                      !isUnlocked
                                        ? 'cursor-not-allowed opacity-60'
                                        : 'cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800'
                                    } ${
                                      task.completed
                                        ? 'bg-emerald-500/10 text-emerald-400'
                                        : 'text-gray-700 dark:text-gray-300'
                                    }`}
                                  >
                                    {task.completed ? (
                                      <CheckSquare className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                                    ) : (
                                      <Square className="w-4 h-4 text-gray-400 flex-shrink-0 mt-0.5" />
                                    )}

                                    <div className="flex-1 flex items-center justify-between text-xs">
                                      <span className={task.completed ? 'line-through opacity-80' : 'font-medium'}>
                                        {task.text}
                                      </span>
                                      
                                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ml-2 flex-shrink-0 ${
                                        task.completed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                      }`}>
                                        +{task.xp || (task.difficulty === 'Simple' ? 10 : task.difficulty === 'Advanced' ? 30 : 20)} XP
                                      </span>
                                    </div>
                                  </div>
                                ))}
                              </div>

                              {/* Dynamic Multi-Platform Curated Resources */}
                              {week.resources && week.resources.length > 0 && (
                                <div className="pt-3 mt-3 border-t border-gray-200/60 dark:border-gray-700/60 space-y-2">
                                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                                    Curated Learning Resources
                                  </span>
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {week.resources.map((res) => (
                                      <div
                                        key={res.id}
                                        className="p-2 rounded-xl bg-gray-100/70 dark:bg-gray-800/60 border border-gray-200/80 dark:border-gray-700/50 flex items-center justify-between gap-2 text-xs"
                                      >
                                        <a
                                          href={res.url}
                                          target="_blank"
                                          rel="noreferrer"
                                          className="flex items-center gap-1.5 min-w-0 flex-1 hover:underline text-brand-400 font-medium"
                                        >
                                          <BookOpen className="w-3.5 h-3.5 flex-shrink-0 text-emerald-500" />
                                          <span className="truncate">{res.title}</span>
                                        </a>

                                        <div className="flex items-center gap-1 flex-shrink-0">
                                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                            {res.platform || 'Resource'}
                                          </span>

                                          {/* Bookmark Star Icon */}
                                          <button
                                            onClick={() => handleToggleBookmark(week.week, res.id, res.bookmarked)}
                                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                              res.bookmarked ? 'text-amber-400' : 'text-gray-400'
                                            }`}
                                            title="Bookmark Resource"
                                          >
                                            <Star className="w-3.5 h-3.5 fill-current" />
                                          </button>

                                          {/* Resource Complete Checkmark */}
                                          <button
                                            onClick={() => handleToggleResourceComplete(week.week, res.id, res.completed)}
                                            className={`p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 ${
                                              res.completed ? 'text-emerald-400' : 'text-gray-400'
                                            }`}
                                            title="Mark Resource Completed"
                                          >
                                            <CheckCircle className="w-3.5 h-3.5" />
                                          </button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <Compass className="w-10 h-10 mx-auto text-emerald-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    SkillPath AI Studio Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Click "Generate Learning Path" to build a persistent AI learning roadmap with week unlock mechanics and multi-platform resources.
                  </p>
                </div>
              )}
            </div>

          </div>
        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
