import React, { useState } from 'react';
import { usePipeline } from '../../context/PipelineContext';
import { runHackathonMentorApi } from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import Toast from '../../components/Toast';
import {
  Trophy,
  Sparkles,
  Cpu,
  FileCode2,
  Copy,
  CheckCircle2,
  Layers,
  AlertTriangle,
  Lightbulb,
  Clock,
  UserCheck,
  FolderTree,
  Award,
  Zap
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HackathonMentorPage() {
  const { setAgentOutput } = usePipeline();

  // Requirements: Empty initial states without hardcoded preloaded inputs
  const [theme, setTheme] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [projectIdea, setProjectIdea] = useState('');
  const [preferredTechStack, setPreferredTechStack] = useState('');
  const [teamSize, setTeamSize] = useState(4);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleRunAgent = async (e) => {
    e.preventDefault();
    if (!problemStatement.trim()) {
      setToast({ type: 'error', message: 'Please enter a problem statement.' });
      return;
    }

    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const payload = {
        theme: theme.trim(),
        problemStatement: problemStatement.trim(),
        projectIdea: projectIdea.trim(),
        preferredTechStack: preferredTechStack.trim(),
        teamSize: Number(teamSize)
      };

      const res = await runHackathonMentorApi(payload);
      setResult(res);
      setAgentOutput('hackathonMentorOutput', res.output);
      setToast({ type: 'success', message: 'Hackathon Mentor AI executed! Architecture & strategy generated.' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Hackathon mentor execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleCopyReadme = () => {
    if (result?.output?.readme) {
      navigator.clipboard.writeText(result.output.readme);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Agent 03
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  Hackathon Mentor AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Generates winning project strategy, system architecture, tech stack, roadmap, risk mitigation, and judge pitch.
              </p>
            </div>

            <Link to="/agents/sprint-flow" className="saas-btn-secondary text-xs hidden sm:inline-flex">
              <span>SprintFlow AI &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Form */}
            <form onSubmit={handleRunAgent} className="saas-card p-5 space-y-4 lg:col-span-1 h-fit">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>Hackathon Challenge</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Hackathon Theme / Domain
                </label>
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="e.g. AI for Social Good / Web SaaS"
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Problem Statement <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={3}
                  required
                  value={problemStatement}
                  onChange={(e) => setProblemStatement(e.target.value)}
                  placeholder="e.g. Students waste hours switching across 6 fragmented productivity apps..."
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Initial Project Idea (Optional)
                </label>
                <input
                  type="text"
                  value={projectIdea}
                  onChange={(e) => setProjectIdea(e.target.value)}
                  placeholder="e.g. Autonomous AI copilot for student innovation"
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Preferred Tech Stack (Optional)
                </label>
                <input
                  type="text"
                  value={preferredTechStack}
                  onChange={(e) => setPreferredTechStack(e.target.value)}
                  placeholder="e.g. React, Node.js, Python, MongoDB, Gemini API"
                  className="saas-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="saas-input text-xs"
                >
                  <option value={2}>2 Members (Solo / Duo)</option>
                  <option value={3}>3 Members (Trio)</option>
                  <option value={4}>4 Members (Standard Hackathon Team)</option>
                  <option value={5}>5 Members (Extended Team)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full py-2.5 text-xs bg-amber-600 hover:bg-amber-500 shadow-amber-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Analyzing Challenge & Architecture...' : 'Generate Project Strategy'}</span>
              </button>
            </form>

            {/* Output Studio */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Metadata Header */}
                  <div className="saas-card p-3 bg-gray-100/50 dark:bg-gray-800/40 text-[11px] font-mono flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Engine: {result.metadata?.provider || 'Google Gemini API'}</span>
                    <span>Latency: {result.executionTime}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Innovation Score: {result.output.innovationScore || 90}%
                    </span>
                  </div>

                  {/* Refined Project Concept & Tagline */}
                  <div className="saas-card p-5 border-l-4 border-l-amber-500 space-y-2">
                    <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider">
                      Winning Hackathon Concept
                    </span>
                    <h3 className="text-xl font-black text-gray-900 dark:text-white">
                      {result.output.refinedProjectTitle || result.output.projectIdea?.title}
                    </h3>
                    <p className="text-xs font-bold text-brand-400">
                      "{result.output.tagline || result.output.projectIdea?.tagline || 'Autonomous AI-Powered Hackathon System'}"
                    </p>
                  </div>

                  {/* Improved Problem Statement */}
                  {result.output.improvedProblemStatement && (
                    <div className="saas-card p-5 space-y-2 bg-gray-50/50 dark:bg-gray-800/30">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Improved Problem Statement (Pitch-Ready)
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-200 leading-relaxed font-medium">
                        {result.output.improvedProblemStatement}
                      </p>
                    </div>
                  )}

                  {/* Recommended Key Features */}
                  {(result.output.keyFeatures || result.output.features) && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>Recommended Key Features</span>
                      </h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        {(result.output.keyFeatures || result.output.features).map((feat, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 text-xs font-medium text-gray-800 dark:text-gray-200 flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Tech Stack & AI Models */}
                  {result.output.techStack && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-amber-500" />
                        <span>Technology Stack & AI Models / APIs</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                        {Object.entries(result.output.techStack).map(([layer, val]) => (
                          <div key={layer} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80">
                            <span className="text-[10px] font-bold uppercase text-amber-500 block mb-0.5">{layer}</span>
                            <span className="font-mono font-semibold text-gray-900 dark:text-white">{String(val)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* System Architecture & Folder Structure */}
                  <div className="saas-card p-5 space-y-3">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-amber-500" />
                      <span>System Architecture & Suggested Folder Layout</span>
                    </h4>

                    {result.output.architecture && (
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700/60">
                        {result.output.architecture}
                      </p>
                    )}

                    {result.output.architectureDiagram && (
                      <div className="p-3 rounded-xl bg-gray-900 text-amber-400 font-mono text-[11px] border border-amber-500/30 overflow-x-auto">
                        <span className="text-[10px] text-gray-500 block mb-1 uppercase font-bold">Data Flow Pipeline:</span>
                        {result.output.architectureDiagram}
                      </div>
                    )}

                    {result.output.folderStructure && (
                      <div className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
                        <span className="text-[10px] text-gray-500 block mb-1 uppercase font-bold flex items-center gap-1">
                          <FolderTree className="w-3 h-3 text-emerald-400" /> Folder Layout:
                        </span>
                        <pre className="whitespace-pre">{result.output.folderStructure}</pre>
                      </div>
                    )}
                  </div>

                  {/* Development Roadmap Timeline */}
                  {(result.output.roadmap || result.output.timeline) && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Clock className="w-4 h-4 text-amber-500" />
                        <span>Hackathon Development Roadmap</span>
                      </h4>

                      <div className="space-y-2.5">
                        {(result.output.roadmap || result.output.timeline).map((step, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 flex items-start gap-3 text-xs">
                            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-500 font-mono font-bold flex-shrink-0">
                              {step.phase}
                            </span>
                            <p className="text-gray-700 dark:text-gray-200 mt-0.5">
                              {step.goal || step.description}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Role Allocation & Responsibilities */}
                  {result.output.roleAllocation && result.output.roleAllocation.length > 0 && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-amber-500" />
                        <span>Team Role Allocation & Member Responsibilities</span>
                      </h4>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {result.output.roleAllocation.map((ra, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 space-y-1 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-gray-900 dark:text-white">{ra.member}</span>
                              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-brand-500/10 text-brand-400">
                                {ra.role}
                              </span>
                            </div>
                            <p className="text-gray-500 dark:text-gray-400 text-[11px]">
                              {ra.responsibilities}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Challenges & Solutions */}
                  {result.output.challengesAndMitigation && (
                    <div className="saas-card p-5 space-y-3 border-l-4 border-l-rose-500">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 text-rose-500" />
                        <span>Possible Challenges & Risk Mitigation</span>
                      </h4>

                      <div className="space-y-2 text-xs">
                        {result.output.challengesAndMitigation.map((cm, idx) => (
                          <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 space-y-1">
                            <p className="font-bold text-rose-400">Challenge: {cm.challenge}</p>
                            <p className="text-gray-700 dark:text-gray-300">Solution: {cm.solution}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Elevator Pitch & Presentation Tips */}
                  <div className="saas-card p-5 space-y-4">
                    {result.output.pitch && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                          Elevator Pitch (2-Minute Judge Speech)
                        </h4>
                        <p className="text-xs italic text-gray-700 dark:text-gray-200 bg-amber-500/10 p-3.5 rounded-xl border border-amber-500/20 leading-relaxed">
                          "{result.output.pitch}"
                        </p>
                      </div>
                    )}

                    {(result.output.presentationTips || result.output.presentationPoints) && (
                      <div className="space-y-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1.5">
                          <Lightbulb className="w-3.5 h-3.5" /> Judge Presentation Tips
                        </span>
                        <ul className="space-y-1.5 text-xs text-gray-700 dark:text-gray-300 list-disc list-inside">
                          {(result.output.presentationTips || result.output.presentationPoints).map((tip, idx) => (
                            <li key={idx}>{tip}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Auto-Generated README.md */}
                  {result.output.readme && (
                    <div className="saas-card p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <FileCode2 className="w-4 h-4 text-amber-500" />
                          <span>Auto-Generated README.md</span>
                        </h4>
                        <button
                          onClick={handleCopyReadme}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 flex items-center gap-1.5"
                        >
                          {copied ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied!' : 'Copy README'}</span>
                        </button>
                      </div>

                      <pre className="p-3.5 rounded-xl bg-gray-900 text-emerald-400 font-mono text-[11px] overflow-x-auto max-h-48 whitespace-pre">
                        {result.output.readme}
                      </pre>
                    </div>
                  )}

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <Trophy className="w-10 h-10 mx-auto text-amber-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Hackathon Mentor AI Studio Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Enter your Hackathon Problem Statement on the left to generate architecture, roadmap, risk mitigation, and judge pitch via Gemini API.
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
