import React, { useState, useEffect } from 'react';
import { useUser } from '../../context/UserContext';
import { usePipeline } from '../../context/PipelineContext';
import { useNavigate, Link } from 'react-router-dom';
import {
  runPlacementPrepApi,
  evaluateInterviewAnswerApi,
  getPlacementHistoryApi,
  retryInterviewSessionApi,
  deleteInterviewSessionApi,
  sendWeakSkillsToSkillPathApi
} from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import ReadinessMeter from '../../components/ReadinessMeter';
import Toast from '../../components/Toast';
import {
  Briefcase,
  Sparkles,
  CheckCircle2,
  HelpCircle,
  AlertTriangle,
  Lightbulb,
  ChevronRight,
  Send,
  Award,
  TrendingUp,
  RotateCcw,
  Trash2,
  History,
  Compass,
  Zap,
  Code2,
  Cpu,
  BrainCircuit,
  MessageSquare,
  FileCheck
} from 'lucide-react';

export default function PlacementPrepPage() {
  const { userProfile, setUserProfile } = useUser();
  const { setAgentOutput } = usePipeline();
  const navigate = useNavigate();

  const [resumeText, setResumeText] = useState(userProfile.resumeText || 'Final year CS student proficient in React, Express, Node.js, Python, MongoDB, and Gemini API multi-agent systems.');
  const [targetCompany, setTargetCompany] = useState(userProfile.targetCompany || 'Google / Top Tech SaaS');
  const [targetRole, setTargetRole] = useState(userProfile.targetCareer || 'Full Stack & AI Engineer');
  
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [result, setResult] = useState(null);
  const [activeQuestionIdx, setActiveQuestionIdx] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [showAnswer, setShowAnswer] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  // Interview History state
  const [history, setHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [sendingToSkillPath, setSendingToSkillPath] = useState(false);

  const fetchHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await getPlacementHistoryApi();
      if (res.data?.history) {
        setHistory(res.data.history);
      }
    } catch (e) {}
    setHistoryLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRunAgent = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const res = await runPlacementPrepApi({ resumeText, targetCompany, targetRole });
      setResult(res);
      setAgentOutput('placementPrepOutput', res.output);
      setActiveQuestionIdx(0);
      setUserAnswer('');
      setShowAnswer(false);
      
      if (res.output?.readinessScore) {
        setUserProfile({ readinessScore: res.output.readinessScore });
      }

      setToast({ type: 'success', message: 'PlacementPrep AI initialized! Dynamic 15-question bank & resume review ready.' });
      fetchHistory();
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'PlacementPrep execution failed' });
    } finally {
      setLoading(false);
    }
  };

  const handleEvaluateAnswer = async (e) => {
    e.preventDefault();
    if (!result?.output || !userAnswer.trim()) return;

    const currentQ = result.output.interviewQuestions[activeQuestionIdx];
    if (!currentQ) return;

    setEvaluating(true);
    try {
      const res = await evaluateInterviewAnswerApi({
        reportId: result.output.reportId,
        questionId: currentQ.id || activeQuestionIdx.toString(),
        userAnswer: userAnswer.trim()
      });

      if (res.data?.evaluation) {
        // Update local question evaluation
        const updatedQuestions = [...result.output.interviewQuestions];
        updatedQuestions[activeQuestionIdx] = {
          ...currentQ,
          userAnswer: userAnswer.trim(),
          evaluation: res.data.evaluation
        };

        const updatedOutput = {
          ...result.output,
          interviewQuestions: updatedQuestions
        };

        setResult({
          ...result,
          output: updatedOutput
        });

        setShowAnswer(true);
        setToast({ type: 'success', message: `Answer evaluated! Score: ${res.data.evaluation.score}/10` });
      }
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to evaluate answer' });
    } finally {
      setEvaluating(false);
    }
  };

  const handleSendToSkillPath = async () => {
    if (!result?.output?.weakSkills && !result?.output?.skillGap) return;
    setSendingToSkillPath(true);
    
    const weakSkills = [...(result.output.weakSkills || []), ...(result.output.skillGap || [])];

    try {
      await sendWeakSkillsToSkillPathApi({
        weakSkills,
        targetRole: result.output.targetRole
      });

      setToast({ type: 'success', message: 'Weak skills transmitted to SkillPath AI! Custom curriculum generated.' });
      setTimeout(() => navigate('/agents/skill-path'), 1200);
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Failed to transmit weak skills' });
    } finally {
      setSendingToSkillPath(false);
    }
  };

  const handleRetrySession = async (reportId) => {
    try {
      const res = await retryInterviewSessionApi(reportId);
      if (res.data?.report) {
        setResult({
          executionTime: 'Loaded from DB',
          metadata: { provider: 'MongoDB Persistent Practice' },
          output: { ...res.data.report, reportId: res.data.report._id }
        });
        setActiveQuestionIdx(0);
        setUserAnswer('');
        setShowAnswer(false);
        setToast({ type: 'info', message: 'Interview practice session reset for retry!' });
      }
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to reset interview session' });
    }
  };

  const handleDeleteSession = async (reportId) => {
    try {
      await deleteInterviewSessionApi(reportId);
      setToast({ type: 'success', message: 'Interview session deleted.' });
      if (result?.output?.reportId === reportId) {
        setResult(null);
      }
      fetchHistory();
    } catch (err) {
      setToast({ type: 'error', message: 'Failed to delete session' });
    }
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
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-rose-500/10 text-rose-500 border border-rose-500/20">
                  Agent 06
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  PlacementPrep AI
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Dynamic 15-question interview bank, real-time AI answer evaluation, performance dashboard & ATS resume scoring.
              </p>
            </div>

            <Link to="/analytics" className="saas-btn-secondary text-xs hidden sm:inline-flex">
              <span>View Placement Analytics &rarr;</span>
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Input Form */}
            <form onSubmit={handleRunAgent} className="saas-card p-5 space-y-4 lg:col-span-1 h-fit">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-rose-500" />
                <span>Placement Parameters</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Target Company
                </label>
                <input
                  type="text"
                  value={targetCompany}
                  onChange={(e) => setTargetCompany(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Target Role
                </label>
                <input
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Resume Summary / Bullet Points
                </label>
                <textarea
                  rows={4}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  className="saas-input font-mono text-xs"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full py-2.5 text-xs bg-rose-600 hover:bg-rose-500 shadow-rose-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Generating Interview Bank...' : 'Analyze & Generate Q&A Bank'}</span>
              </button>
            </form>

            {/* Output Studio */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Metadata Header */}
                  <div className="saas-card p-3 bg-gray-100/50 dark:bg-gray-800/40 text-[11px] font-mono flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>Engine: {result.metadata?.provider}</span>
                    <span>Target: {result.output.targetCompany}</span>
                    <span>Role: {result.output.targetRole}</span>
                  </div>

                  {/* Readiness Score Dial & ATS Score */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <ReadinessMeter score={result.output.readinessScore || 85} />
                    
                    {/* ATS Score Card */}
                    <div className="saas-card p-5 flex flex-col justify-between border-emerald-500/30 bg-emerald-500/5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-500 flex items-center gap-1.5">
                          <FileCheck className="w-4 h-4" /> ATS Resume Score
                        </span>
                        <span className="text-xl font-black text-emerald-400 font-mono">
                          {result.output.atsScore || 88}%
                        </span>
                      </div>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mt-2">
                        {result.output.resumeFeedback?.atsFeedback || 'Strong keyword match for target role.'}
                      </p>
                    </div>
                  </div>

                  {/* Performance Breakdown Metrics Dashboard */}
                  {result.output.performanceMetrics && (
                    <div className="saas-card p-5 space-y-3">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-rose-500" />
                        <span>Candidate Performance Breakdown Dashboard</span>
                      </h4>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-xs">
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] text-gray-400 font-mono uppercase block">Technical</span>
                          <strong className="text-base text-rose-500 font-mono">{result.output.performanceMetrics.technicalScore || 80}%</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] text-gray-400 font-mono uppercase block">Behavioral</span>
                          <strong className="text-base text-purple-500 font-mono">{result.output.performanceMetrics.behavioralScore || 85}%</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] text-gray-400 font-mono uppercase block">Project</span>
                          <strong className="text-base text-amber-500 font-mono">{result.output.performanceMetrics.projectScore || 88}%</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] text-gray-400 font-mono uppercase block">Communication</span>
                          <strong className="text-base text-blue-500 font-mono">{result.output.performanceMetrics.communicationScore || 82}%</strong>
                        </div>
                        <div className="p-3 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200 dark:border-gray-700">
                          <span className="text-[10px] text-gray-400 font-mono uppercase block">Coding</span>
                          <strong className="text-base text-emerald-500 font-mono">{result.output.performanceMetrics.codingScore || 78}%</strong>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Resume Review Breakdown */}
                  <div className="saas-card p-5 space-y-3">
                    <h4 className="font-bold text-sm text-gray-900 dark:text-white">
                      AI Resume Analysis & Strategic Feedback
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                        <p className="font-bold text-emerald-500 flex items-center gap-1.5 mb-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Resume Strengths
                        </p>
                        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                          {result.output.resumeFeedback?.strengths?.map((s, i) => (
                            <li key={i}>&bull; {s}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20">
                        <p className="font-bold text-amber-500 flex items-center gap-1.5 mb-1.5">
                          <Lightbulb className="w-3.5 h-3.5" /> High Impact Improvements
                        </p>
                        <ul className="space-y-1 text-gray-700 dark:text-gray-300">
                          {result.output.resumeFeedback?.suggestions?.map((sg, i) => (
                            <li key={i}>&bull; {sg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Identified Weak Skills & Multi-Agent SkillPath Collaboration */}
                  {((result.output.weakSkills && result.output.weakSkills.length > 0) || (result.output.skillGap && result.output.skillGap.length > 0)) && (
                    <div className="saas-card p-5 border-l-4 border-l-rose-500 space-y-3 bg-rose-500/5">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div>
                          <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1.5">
                            <AlertTriangle className="w-3.5 h-3.5" /> Identified Skill Gaps & Weak Technical Areas
                          </span>
                          <p className="text-xs text-gray-600 dark:text-gray-300 mt-1">
                            Skills flagged for technical reinforcement during evaluation:
                          </p>
                        </div>

                        <button
                          onClick={handleSendToSkillPath}
                          disabled={sendingToSkillPath}
                          className="saas-btn-primary text-xs bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/20 py-2 px-3 flex items-center gap-1.5 w-fit"
                        >
                          <Compass className="w-3.5 h-3.5" />
                          <span>{sendingToSkillPath ? 'Transmitting to Agent 4...' : 'Send Weak Skills to SkillPath AI'}</span>
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-1">
                        {[...(result.output.weakSkills || []), ...(result.output.skillGap || [])].map((skill, idx) => (
                          <span key={idx} className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Interactive Interview Practice Simulator (One Question at a Time) */}
                  {result.output.interviewQuestions && result.output.interviewQuestions.length > 0 && (
                    <div className="saas-card p-5 space-y-4 border-2 border-rose-500/30">
                      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3">
                        <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-rose-500" />
                          <span>Interactive AI Mock Interview Practice</span>
                        </h4>

                        <span className="text-[11px] font-mono font-bold px-2.5 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          Question {activeQuestionIdx + 1} of {result.output.interviewQuestions.length}
                        </span>
                      </div>

                      {/* Question Selector Tabs */}
                      <div className="flex gap-1.5 overflow-x-auto pb-1">
                        {result.output.interviewQuestions.map((q, idx) => {
                          const isEvaluated = q.evaluation?.evaluated;

                          return (
                            <button
                              key={idx}
                              onClick={() => {
                                setActiveQuestionIdx(idx);
                                setUserAnswer(q.userAnswer || '');
                                setShowAnswer(!!q.evaluation?.evaluated);
                              }}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                                activeQuestionIdx === idx
                                  ? 'bg-rose-600 text-white shadow-md'
                                  : isEvaluated
                                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400 hover:text-white'
                              }`}
                            >
                              <span>Q{idx + 1}</span>
                              {isEvaluated && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                            </button>
                          );
                        })}
                      </div>

                      {/* Active Question Box */}
                      {(() => {
                        const q = result.output.interviewQuestions[activeQuestionIdx];
                        if (!q) return null;

                        return (
                          <div className="p-5 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                                  {q.category || 'Technical'} Round
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                  q.difficulty === 'Hard' ? 'bg-rose-500/20 text-rose-300' : q.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                                }`}>
                                  {q.difficulty || 'Medium'}
                                </span>
                              </div>

                              <div className="flex gap-1">
                                {q.keyConcepts?.map((kc, i) => (
                                  <span key={i} className="px-1.5 py-0.5 text-[9px] font-mono rounded bg-gray-200 dark:bg-gray-700 text-gray-400">
                                    {kc}
                                  </span>
                                ))}
                              </div>
                            </div>

                            <p className="text-base font-extrabold text-gray-900 dark:text-white leading-snug">
                              "{q.question}"
                            </p>

                            {/* Code Snippet / Debugging Box */}
                            {q.codeSnippet && (
                              <pre className="p-3 rounded-xl bg-gray-900 text-emerald-400 font-mono text-xs overflow-x-auto border border-gray-800">
                                <code>{q.codeSnippet}</code>
                              </pre>
                            )}

                            {/* MCQ Options */}
                            {q.options && q.options.length > 0 && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                                {q.options.map((opt, oIdx) => (
                                  <button
                                    key={oIdx}
                                    type="button"
                                    onClick={() => setUserAnswer(opt)}
                                    className={`p-2.5 rounded-xl border text-left font-mono transition-all ${
                                      userAnswer === opt
                                        ? 'border-rose-500 bg-rose-500/10 font-bold text-rose-400'
                                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-400'
                                    }`}
                                  >
                                    {String.fromCharCode(65 + oIdx)}. {opt}
                                  </button>
                                ))}
                              </div>
                            )}

                            {/* Answer Input Form */}
                            <form onSubmit={handleEvaluateAnswer} className="space-y-3 pt-2">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                                  Your Response / Explanation:
                                </label>
                                <textarea
                                  rows={3}
                                  placeholder="Type your explanation or technical approach here..."
                                  value={userAnswer}
                                  onChange={(e) => setUserAnswer(e.target.value)}
                                  className="saas-input font-mono text-xs"
                                />
                              </div>

                              <div className="flex items-center justify-between gap-2">
                                <button
                                  type="submit"
                                  disabled={evaluating || !userAnswer.trim()}
                                  className="saas-btn-primary py-2 px-4 text-xs bg-rose-600 hover:bg-rose-500 shadow-rose-500/20 flex items-center gap-1.5"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                  <span>{evaluating ? 'Evaluating Answer with Gemini...' : 'Submit Answer for Evaluation'}</span>
                                </button>

                                {q.evaluation?.evaluated && (
                                  <button
                                    type="button"
                                    onClick={() => setShowAnswer(!showAnswer)}
                                    className="saas-btn-secondary py-2 text-xs"
                                  >
                                    <span>{showAnswer ? 'Hide Evaluation' : 'View AI Evaluation'}</span>
                                  </button>
                                )}
                              </div>
                            </form>

                            {/* AI Answer Evaluation Card */}
                            {showAnswer && q.evaluation && (
                              <div className="p-4 rounded-xl bg-white dark:bg-gray-900 border border-rose-500/30 space-y-3 animate-fadeIn">
                                <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-2">
                                  <span className="text-xs font-bold text-rose-500 flex items-center gap-1.5">
                                    <Award className="w-4 h-4 text-rose-500" /> AI Evaluation Feedback
                                  </span>

                                  <div className="flex items-center gap-3 text-xs font-mono">
                                    <span>Score: <strong className="text-rose-400 text-sm">{q.evaluation.score}/10</strong></span>
                                    <span>Correctness: <strong className="text-emerald-400">{q.evaluation.correctnessScore}/10</strong></span>
                                  </div>
                                </div>

                                {q.evaluation.missingPoints && q.evaluation.missingPoints.length > 0 && (
                                  <div className="space-y-1">
                                    <span className="text-[11px] font-bold text-amber-500">Missing Key Points:</span>
                                    <ul className="text-xs text-gray-600 dark:text-gray-300 list-disc list-inside">
                                      {q.evaluation.missingPoints.map((mp, i) => (
                                        <li key={i}>{mp}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                <div className="space-y-1">
                                  <strong className="text-emerald-500 text-xs block">Ideal Model Answer:</strong>
                                  <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed font-mono bg-gray-50 dark:bg-gray-800/60 p-2.5 rounded-lg border border-gray-200 dark:border-gray-700">
                                    {q.evaluation.idealAnswer || q.idealAnswer}
                                  </p>
                                </div>

                                {activeQuestionIdx < result.output.interviewQuestions.length - 1 && (
                                  <div className="pt-2 flex justify-end">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        const nextIdx = activeQuestionIdx + 1;
                                        setActiveQuestionIdx(nextIdx);
                                        const nextQ = result.output.interviewQuestions[nextIdx];
                                        setUserAnswer(nextQ?.userAnswer || '');
                                        setShowAnswer(!!nextQ?.evaluation?.evaluated);
                                      }}
                                      className="saas-btn-primary text-xs bg-rose-600 hover:bg-rose-500"
                                    >
                                      <span>Next Question &rarr;</span>
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}

                          </div>
                        );
                      })()}
                    </div>
                  )}

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <Briefcase className="w-10 h-10 mx-auto text-rose-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    PlacementPrep AI Studio Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Click "Analyze & Generate Q&A Bank" to compile a 15-question dynamic interview bank, evaluate resume ATS compatibility, and practice mock interview questions.
                  </p>
                </div>
              )}

              {/* Interview Practice Session History Catalog */}
              <div className="saas-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                    <History className="w-4 h-4 text-rose-500" />
                    <span>Interview Practice History Catalog</span>
                  </h4>
                  <span className="text-[11px] font-mono text-gray-400">
                    {history.length} Sessions Saved
                  </span>
                </div>

                {historyLoading ? (
                  <p className="text-xs text-gray-400 font-mono animate-pulse">Loading past interview sessions...</p>
                ) : history.length > 0 ? (
                  <div className="space-y-3">
                    {history.map((session) => (
                      <div
                        key={session._id}
                        className="p-3.5 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                      >
                        <div className="space-y-0.5">
                          <h5 className="font-bold text-gray-900 dark:text-white">
                            {session.targetCompany} — {session.targetRole}
                          </h5>
                          <p className="text-[11px] text-gray-500 dark:text-gray-400 font-mono">
                            Readiness: <strong className="text-rose-400">{session.readinessScore}%</strong> | Questions: {session.interviewQuestions?.length || 15} | Date: {new Date(session.createdAt).toLocaleDateString()}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setResult({
                                executionTime: 'Loaded from DB',
                                metadata: { provider: 'MongoDB Practice Session' },
                                output: { ...session, reportId: session._id }
                              });
                              setActiveQuestionIdx(0);
                            }}
                            className="saas-btn-primary text-xs py-1 px-3 bg-rose-600 hover:bg-rose-500"
                          >
                            Resume Session
                          </button>

                          <button
                            onClick={() => handleRetrySession(session._id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-gray-700"
                            title="Retry Session"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleDeleteSession(session._id)}
                            className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-500/10"
                            title="Delete Session"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-4">No past interview sessions found.</p>
                )}
              </div>

            </div>

          </div>
        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
