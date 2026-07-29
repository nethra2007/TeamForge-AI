import React, { useState } from 'react';
import { useUser } from '../context/UserContext';
import { usePipeline } from '../context/PipelineContext';
import { runMultiAgentPipelineApi } from '../services/agentApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import {
  Layers,
  Sparkles,
  Users,
  BookOpen,
  Trophy,
  Compass,
  Kanban,
  Briefcase,
  CheckCircle2,
  Clock,
  ArrowRight,
  RefreshCw,
  Eye
} from 'lucide-react';

export default function MultiAgentPipelinePage() {
  const { userProfile } = useUser();
  const { pipelineState, setAgentOutput, clearPipeline } = usePipeline();

  const [loading, setLoading] = useState(false);
  const [pipelineResult, setPipelineResult] = useState(null);
  const [activeTab, setActiveTab] = useState('collaborator');
  const [toast, setToast] = useState({ type: '', message: '' });

  const agentSteps = [
    { key: 'collaborator', num: 1, name: 'Team Collaborator', icon: Users, color: 'text-blue-500 bg-blue-500/10' },
    { key: 'hackathonMentor', num: 2, name: 'Hackathon Mentor', icon: Trophy, color: 'text-amber-500 bg-amber-500/10' },
    { key: 'litReview', num: 3, name: 'LitReview AI', icon: BookOpen, color: 'text-purple-500 bg-purple-500/10' },
    { key: 'sprintFlow', num: 4, name: 'SprintFlow AI', icon: Kanban, color: 'text-cyan-500 bg-cyan-500/10' },
    { key: 'skillPath', num: 5, name: 'SkillPath AI', icon: Compass, color: 'text-emerald-500 bg-emerald-500/10' },
    { key: 'placementPrep', num: 6, name: 'PlacementPrep AI', icon: Briefcase, color: 'text-rose-500 bg-rose-500/10' }
  ];

  const handleRunFullPipeline = async () => {
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await runMultiAgentPipelineApi({
        skills: userProfile.skills,
        preferredRole: userProfile.preferredRole,
        domain: 'Autonomous Multi-Agent Systems',
        targetCareer: userProfile.targetCareer,
        targetCompany: userProfile.targetCompany,
        resumeText: userProfile.resumeText
      });

      setPipelineResult(res);

      if (res.context?.steps) {
        setAgentOutput('collaboratorOutput', res.context.steps.collaborator);
        setAgentOutput('hackathonMentorOutput', res.context.steps.hackathonMentor);
        setAgentOutput('litReviewOutput', res.context.steps.litReview);
        setAgentOutput('sprintFlowOutput', res.context.steps.sprintFlow);
        setAgentOutput('skillPathOutput', res.context.steps.skillPath);
        setAgentOutput('placementPrepOutput', res.context.steps.placementPrep);
      }

      setToast({ type: 'success', message: `Autonomous 6-Agent Pipeline completed in ${res.totalExecutionTime}!` });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Pipeline execution failed' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          {/* Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-brand-500/10 text-brand-500 border border-brand-500/20">
                  Sequential Chaining
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Multi-Agent Execution Pipeline
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Executes all 6 autonomous AI agents sequentially, automatically feeding intermediate outputs downstream.
              </p>
            </div>

            <button
              onClick={handleRunFullPipeline}
              disabled={loading}
              className="saas-btn-primary px-5 py-2.5 text-xs bg-gradient-to-r from-brand-600 to-indigo-600 shadow-lg shadow-brand-500/20"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4 animate-pulse" />}
              <span>{loading ? 'Running 6 Autonomous Agents...' : 'Run Autonomous 6-Agent Chain'}</span>
            </button>
          </div>

          {/* Stepper Visualizer */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-gray-400">
              Pipeline Context Flow
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {agentSteps.map((step) => {
                const Icon = step.icon;
                const isStepCompleted = pipelineResult?.context?.steps?.[step.key] || pipelineState[`${step.key}Output`];
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveTab(step.key)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      activeTab === step.key
                        ? 'border-brand-500 bg-brand-500/10 ring-2 ring-brand-500/20'
                        : 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/40 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className={`p-1.5 rounded-lg ${step.color}`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      {isStepCompleted ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-gray-400" />
                      )}
                    </div>
                    <p className="text-[10px] font-mono text-gray-400">Step {step.num}</p>
                    <p className="text-xs font-bold text-gray-900 dark:text-white truncate">
                      {step.name}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Detailed Output Inspector for Active Tab */}
          <div className="saas-card p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-3">
              <h3 className="font-bold text-base text-gray-900 dark:text-white flex items-center gap-2">
                <Eye className="w-4 h-4 text-brand-500" />
                <span>Inspecting Step Output: {agentSteps.find(s => s.key === activeTab)?.name}</span>
              </h3>

              {pipelineResult?.totalExecutionTime && (
                <span className="text-[11px] font-mono text-emerald-400 font-semibold">
                  Total Chain Latency: {pipelineResult.totalExecutionTime}
                </span>
              )}
            </div>

            {(() => {
              const currentStepData = pipelineResult?.context?.steps?.[activeTab] || pipelineState[`${activeTab}Output`];

              if (!currentStepData) {
                return (
                  <div className="p-12 text-center text-gray-400 space-y-3">
                    <Layers className="w-10 h-10 mx-auto text-brand-500/40" />
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                      Step output not generated yet
                    </p>
                    <p className="text-xs max-w-sm mx-auto text-gray-400">
                      Click "Run Autonomous 6-Agent Chain" above to execute all 6 agents sequentially and view context passing in real time.
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-3 font-mono text-xs">
                  <pre className="p-4 rounded-xl bg-gray-900 text-brand-300 overflow-x-auto max-h-96 leading-relaxed border border-gray-800">
                    {JSON.stringify(currentStepData, null, 2)}
                  </pre>
                </div>
              );
            })()}
          </div>

        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
