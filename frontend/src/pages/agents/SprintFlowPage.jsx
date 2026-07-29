import React, { useState, useEffect } from 'react';
import { usePipeline } from '../../context/PipelineContext';
import {
  runSprintFlowApi,
  getSprintFlowActiveApi
} from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import KanbanBoard from '../../components/KanbanBoard';
import Toast from '../../components/Toast';
import {
  Kanban,
  Sparkles,
  CheckCircle2,
  Calendar,
  Target,
  Flag,
  TrendingUp,
  Zap,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Download,
  FileSpreadsheet,
  Plus
} from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

export default function SprintFlowPage() {
  const { pipelineState, setAgentOutput } = usePipeline();
  const [searchParams] = useSearchParams();
  const sprintIdFromUrl = searchParams.get('id') || searchParams.get('projectId');

  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [timeline, setTimeline] = useState('4 Weeks');
  const [teamSize, setTeamSize] = useState(4);
  const [techStack, setTechStack] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });
  const [isLoadedFromDB, setIsLoadedFromDB] = useState(false);

  // Auto Load sprint plan from MongoDB ONLY if explicit ID is passed from Sprint History
  useEffect(() => {
    if (!sprintIdFromUrl) {
      return;
    }

    const fetchSpecificSprint = async () => {
      try {
        const res = await getSprintFlowActiveApi({ id: sprintIdFromUrl });
        if (res.data?.sprintPlan) {
          const plan = res.data.sprintPlan;
          setProjectName(plan.projectTitle || '');
          setProjectDescription(plan.projectDescription || '');
          setTimeline(plan.deadline || '4 Weeks');
          setTeamSize(plan.teamSize || 4);
          setTechStack(plan.techStack || '');
          setResult({
            executionTime: 'Loaded from DB',
            metadata: { provider: 'MongoDB Persistent Tracker' },
            output: { ...plan, sprintPlanId: plan._id }
          });
          setAgentOutput('sprintFlowOutput', plan);
          setIsLoadedFromDB(true);
        }
      } catch (err) {
        // Silent catch
      }
    };

    fetchSpecificSprint();
  }, [sprintIdFromUrl]);

  const handleRunAgent = async (e, forceNew = false) => {
    if (e) e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await runSprintFlowApi({
        projectName,
        projectDescription,
        timeline,
        teamSize,
        techStack,
        forceNew
      });

      setResult(res);
      setAgentOutput('sprintFlowOutput', res.output);
      setIsLoadedFromDB(res.output?.isLoadedFromDB || false);

      if (res.output?.isLoadedFromDB) {
        setToast({ type: 'info', message: 'Loaded your previously generated sprint.' });
      } else {
        setToast({ type: 'success', message: 'SprintFlow AI executed! Interactive Agile Kanban sprints generated.' });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'SprintFlow execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleTaskStatusUpdated = (taskId, newStatus) => {
    if (!result?.output) return;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedSprints = result.output.sprints.map((s, idx) => {
      const updatedTasks = s.tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, status: newStatus };
        }
        return t;
      });

      updatedTasks.forEach(t => {
        totalTasks += 1;
        if (t.status === 'Completed' || t.status === 'Done') {
          completedTasks += 1;
        }
      });

      return {
        ...s,
        tasks: updatedTasks
      };
    });

    const overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);
    const progressBonus = Math.round(overallProgress * 0.2);
    const projectHealthScore = Math.max(30, Math.min(100, 80 + progressBonus));
    const riskLevel = projectHealthScore > 80 ? 'Low Risk' : projectHealthScore > 50 ? 'Moderate Risk' : 'High Risk';

    setResult({
      ...result,
      output: {
        ...result.output,
        sprints: updatedSprints,
        overallProgress,
        projectHealthScore,
        riskLevel
      }
    });
  };

  const handleTaskDeleted = (taskId) => {
    if (!result?.output) return;

    let totalTasks = 0;
    let completedTasks = 0;

    const updatedSprints = result.output.sprints.map(s => {
      const updatedTasks = s.tasks.filter(t => t.id !== taskId);
      updatedTasks.forEach(t => {
        totalTasks += 1;
        if (t.status === 'Completed' || t.status === 'Done') {
          completedTasks += 1;
        }
      });

      return {
        ...s,
        tasks: updatedTasks
      };
    });

    const overallProgress = Math.round((completedTasks / Math.max(1, totalTasks)) * 100);

    setResult({
      ...result,
      output: {
        ...result.output,
        sprints: updatedSprints,
        overallProgress
      }
    });
    setToast({ type: 'success', message: 'Task deleted successfully.' });
  };

  const handleTaskEdited = (taskId, updatedData) => {
    if (!result?.output) return;

    const updatedSprints = result.output.sprints.map(s => {
      const updatedTasks = s.tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, ...updatedData };
        }
        return t;
      });

      return {
        ...s,
        tasks: updatedTasks
      };
    });

    setResult({
      ...result,
      output: {
        ...result.output,
        sprints: updatedSprints
      }
    });
    setToast({ type: 'success', message: 'Task updated successfully.' });
  };

  const handleExportPDF = () => {
    if (!result?.output) return;
    const plan = result.output;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${plan.projectTitle} - SprintFlow Plan</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 30px; color: #111827; }
            .header { border-bottom: 2px solid #06b6d4; padding-bottom: 15px; margin-bottom: 20px; }
            .title { font-size: 24px; font-weight: bold; color: #0891b2; margin: 0; }
            .meta { font-size: 12px; color: #6b7280; margin-top: 5px; }
            .badge { display: inline-block; padding: 3px 8px; font-size: 11px; font-weight: bold; background: #ecfeff; color: #0891b2; border-radius: 4px; }
            .sprint-box { margin-bottom: 20px; padding: 15px; border: 1px solid #e5e7eb; border-radius: 8px; background: #f9fafb; }
            .sprint-title { font-size: 14px; font-weight: bold; color: #111827; margin-bottom: 8px; }
            .task-item { font-size: 12px; margin: 4px 0; color: #374151; }
            .task-completed { text-decoration: line-through; color: #10b981; }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="badge">TeamForge SprintFlow AI Agile Plan</div>
            <h1 class="title">${plan.projectTitle}</h1>
            <div class="meta">
              Progress: ${plan.overallProgress || 0}% | Health: ${plan.projectHealthScore || 95}% (${plan.riskLevel || 'Low Risk'}) | Velocity: ${plan.velocityScore || 90}
            </div>
          </div>

          ${plan.sprints?.map((s) => `
            <div class="sprint-box">
              <div class="sprint-title">Sprint ${s.sprintNumber}: ${s.sprintGoal}</div>
              <div><strong>Tasks:</strong></div>
              ${s.tasks?.map((t) => `
                <div class="task-item ${t.status === 'Completed' || t.status === 'Done' ? 'task-completed' : ''}">
                  [${t.status || 'To Do'}] ${t.id}: ${t.title} (Assignee: ${t.assignee || 'Unassigned'}, ${t.estimatedHours || 8}h)
                </div>
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

  const handleExportCSV = () => {
    if (!result?.output) return;
    const plan = result.output;
    let csvContent = 'data:text/csv;charset=utf-8,';
    csvContent += 'Sprint Number,Sprint Goal,Task ID,Task Title,Assignee,Priority,Status,Estimated Hours,Due Date\n';

    plan.sprints?.forEach(s => {
      s.tasks?.forEach(t => {
        const row = [
          s.sprintNumber,
          `"${s.sprintGoal.replace(/"/g, '""')}"`,
          t.id,
          `"${t.title.replace(/"/g, '""')}"`,
          `"${(t.assignee || 'Unassigned').replace(/"/g, '""')}"`,
          t.priority || 'Medium',
          t.status || 'To Do',
          t.estimatedHours || 8,
          t.dueDate || ''
        ].join(',');
        csvContent += row + '\n';
      });
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${plan.projectTitle.replace(/\s+/g, '_')}_SprintPlan.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                  Agent 05
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  SprintFlow AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Persistent AI Sprint Manager, 4-Column Kanban boards, dependencies, task guidance & project health dashboard.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Link to="/sprint-history" className="saas-btn-secondary text-xs">
                <Kanban className="w-3.5 h-3.5 text-cyan-500" />
                <span>Sprint History</span>
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
                <Kanban className="w-4 h-4 text-cyan-500" />
                <span>Sprint Configuration</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Timeline
                  </label>
                  <select
                    value={timeline}
                    onChange={(e) => setTimeline(e.target.value)}
                    className="saas-input text-xs"
                  >
                    <option value="2 Weeks">2 Weeks</option>
                    <option value="4 Weeks">4 Weeks</option>
                    <option value="6 Weeks">6 Weeks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                    Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={12}
                    value={teamSize}
                    onChange={(e) => setTeamSize(parseInt(e.target.value, 10))}
                    className="saas-input text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Tech Stack
                </label>
                <input
                  type="text"
                  value={techStack}
                  onChange={(e) => setTechStack(e.target.value)}
                  className="saas-input text-xs font-mono"
                />
              </div>

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  disabled={loading}
                  className="saas-btn-primary w-full py-2.5 text-xs bg-cyan-600 hover:bg-cyan-500 shadow-cyan-500/20"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{loading ? 'Decomposing Tasks...' : result ? 'Regenerate Sprint Plan' : 'Generate Sprints'}</span>
                </button>

                {result && (
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={handleExportPDF}
                      className="saas-btn-secondary py-2 text-xs flex items-center justify-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>PDF</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleExportCSV}
                      className="saas-btn-secondary py-2 text-xs flex items-center justify-center gap-1 text-emerald-400"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>CSV</span>
                    </button>
                  </div>
                )}
              </div>
            </form>

            {/* Output Studio */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Auto Load Notification Banner */}
                  {isLoadedFromDB && (
                    <div className="p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-cyan-400" />
                        <span>Loaded your previously generated sprint from MongoDB.</span>
                      </div>
                      <span className="text-[10px] font-mono text-cyan-500">Auto-Loaded</span>
                    </div>
                  )}

                  {/* Metadata & Project Health Score Banner */}
                  <div className="saas-card p-5 bg-gradient-to-r from-cyan-950/20 via-teal-900/10 to-transparent border-cyan-500/30 space-y-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-500">
                          Active Agile Project
                        </span>
                        <h3 className="text-lg font-extrabold text-gray-900 dark:text-white mt-0.5">
                          {result.output.projectTitle}
                        </h3>
                      </div>

                      {/* Velocity & Risk Badge */}
                      <div className="flex items-center gap-2">
                        <div className="px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold flex items-center gap-1.5">
                          <Zap className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                          <span>Velocity: {result.output.velocityScore || 90}</span>
                        </div>
                        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                          {result.output.riskLevel || 'Low Risk'}
                        </span>
                      </div>
                    </div>

                    {/* Health & Overall Progress Bar */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-cyan-500/20">
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <TrendingUp className="w-4 h-4 text-cyan-500" /> Overall Progress
                          </span>
                          <span className="text-cyan-500 font-mono text-sm">
                            {result.output.overallProgress || 0}%
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${result.output.overallProgress || 0}%` }}
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-gray-700 dark:text-gray-300 flex items-center gap-1.5">
                            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Project Health Score
                          </span>
                          <span className="text-emerald-400 font-mono text-sm">
                            {result.output.projectHealthScore || 95}%
                          </span>
                        </div>

                        <div className="w-full h-3 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden p-0.5">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                            style={{ width: `${result.output.projectHealthScore || 95}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Kanban Board Component */}
                  <div className="saas-card p-5 space-y-4">
                    <KanbanBoard
                      sprintPlanId={result.output.sprintPlanId}
                      sprints={result.output.sprints}
                      projectTitle={result.output.projectTitle}
                      techStack={techStack}
                      onTaskStatusUpdated={handleTaskStatusUpdated}
                      onTaskDeleted={handleTaskDeleted}
                      onTaskEdited={handleTaskEdited}
                    />
                  </div>

                  {/* Milestones Grid */}
                  <div className="saas-card p-5 space-y-3">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Flag className="w-4 h-4 text-cyan-500" />
                      <span>Key Project Milestones</span>
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      {result.output.milestones?.map((m, idx) => (
                        <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700">
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-bold text-gray-900 dark:text-white">{m.title}</span>
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400">
                              {m.deadline}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {m.deliverables?.map((d, i) => (
                              <span key={i} className="px-1.5 py-0.5 text-[9px] rounded bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-mono">
                                {d}
                              </span>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <Kanban className="w-10 h-10 mx-auto text-cyan-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    SprintFlow AI Studio Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Click "Generate Sprints" to decompose project requirements into persistent 4-column Agile Kanban boards and milestones.
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
