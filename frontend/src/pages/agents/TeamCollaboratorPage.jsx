import React, { useState } from 'react';
import { useUser } from '../../context/UserContext';
import { usePipeline } from '../../context/PipelineContext';
import { runCollaboratorApi } from '../../services/agentApi';
import Navbar from '../../components/Navbar';
import Sidebar from '../../components/Sidebar';
import Footer from '../../components/Footer';
import CompatibilityGauge from '../../components/CompatibilityGauge';
import Toast from '../../components/Toast';
import {
  Users,
  Sparkles,
  UserCheck,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Code,
  FolderPlus,
  AlertCircle,
  Lightbulb,
  Github,
  Linkedin,
  Edit3
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function TeamCollaboratorPage() {
  const { userProfile } = useUser();
  const { setAgentOutput } = usePipeline();

  // Project-specific form state (Profile info comes from MongoDB/UserContext)
  const [projectName, setProjectName] = useState('Autonomous Multi-Agent AI Copilot');
  const [projectDescription, setProjectDescription] = useState(
    'An intelligent SaaS platform coordinating multiple autonomous AI agents for team formation, literature review, sprint planning, and career placement.'
  );
  const [domain, setDomain] = useState('Artificial Intelligence & Web SaaS');
  const [requiredTechnologies, setRequiredTechnologies] = useState('React.js, Node.js, Python, FastAPI, MongoDB, Gemini API');
  const [teamSize, setTeamSize] = useState(4);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleGenerateTeam = async (e) => {
    e.preventDefault();
    if (!projectName.trim()) {
      setToast({ type: 'error', message: 'Please enter a project name.' });
      return;
    }

    setLoading(true);
    setToast({ type: '', message: '' });

    try {
      const payload = {
        projectName,
        projectDescription,
        domain,
        requiredTechnologies: requiredTechnologies.split(',').map(s => s.trim()).filter(Boolean),
        teamSize: Number(teamSize)
      };

      const res = await runCollaboratorApi(payload);
      setResult(res);
      setAgentOutput('collaboratorOutput', res.output);
      setToast({ type: 'success', message: 'Dynamic team generated using MongoDB candidates & saved to database!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message || 'Team generation failed' });
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
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/10 text-blue-500 border border-blue-500/20">
                  Agent 01
                </span>
                <h1 className="text-xl font-extrabold text-gray-900 dark:text-white">
                  TeamForge Collaborator
                </h1>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Matches real registered student profiles from MongoDB to form the optimal project team.
              </p>
            </div>

            <Link to="/teams-projects" className="saas-btn-secondary text-xs hidden sm:inline-flex">
              <span>View Saved Teams &rarr;</span>
            </Link>
          </div>

          {/* Step 1: Logged-in User Read-only Profile Summary Card */}
          <div className="saas-card p-5 bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-transparent border-brand-500/30">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-600 text-white flex items-center justify-center text-lg font-extrabold shadow-md shadow-brand-500/20">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                      Team Leader (You): {userProfile.name || 'Alex Morgan'}
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-brand-500/20 text-brand-400 border border-brand-500/30">
                      {userProfile.preferredRole || 'Full Stack Engineer'}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    {userProfile.college || 'Engineering Institute'} &bull; {userProfile.branch || 'CS & AI'}
                  </p>
                </div>
              </div>

              <Link
                to="/profile"
                className="saas-btn-secondary py-1.5 px-3 text-xs flex items-center gap-1.5 flex-shrink-0"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </Link>
            </div>

            <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-800/80 flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-medium">Your Profile Skills (Loaded from DB):</span>
              {userProfile.skills?.map((skill, idx) => (
                <span key={idx} className="px-2 py-0.5 rounded text-[10px] bg-brand-500/10 text-brand-400 border border-brand-500/20 font-mono">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Step 2: Project Creation Form (Only project-specific inputs) */}
            <form onSubmit={handleGenerateTeam} className="saas-card p-5 space-y-4 lg:col-span-1 h-fit">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-blue-500" />
                <span>Project Specifications</span>
              </h3>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Project Name
                </label>
                <input
                  type="text"
                  required
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="e.g. Autonomous AI Smart City Platform"
                  className="saas-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Project Description
                </label>
                <textarea
                  rows={3}
                  required
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Describe the main goals and technical objectives of your project..."
                  className="saas-input text-xs"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Target Domain / Track
                </label>
                <input
                  type="text"
                  required
                  value={domain}
                  onChange={(e) => setDomain(e.target.value)}
                  placeholder="e.g. Artificial Intelligence & Web SaaS"
                  className="saas-input"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Required Technologies (Comma Separated)
                </label>
                <input
                  type="text"
                  required
                  value={requiredTechnologies}
                  onChange={(e) => setRequiredTechnologies(e.target.value)}
                  placeholder="React.js, Node.js, Python, FastAPI, Docker"
                  className="saas-input text-xs font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1">
                  Desired Team Size
                </label>
                <select
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  className="saas-input"
                >
                  <option value={2}>2 Members (Leader + 1 Teammate)</option>
                  <option value={3}>3 Members (Leader + 2 Teammates)</option>
                  <option value={4}>4 Members (Leader + 3 Teammates)</option>
                  <option value={5}>5 Members (Leader + 4 Teammates)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="saas-btn-primary w-full py-2.5 text-xs bg-blue-600 hover:bg-blue-500 shadow-blue-500/20"
              >
                <Sparkles className="w-4 h-4" />
                <span>{loading ? 'Querying MongoDB Candidates & Running AI...' : 'Generate Dynamic Team'}</span>
              </button>
            </form>

            {/* Steps 3 & 4: AI Output Studio with Real MongoDB Candidates */}
            <div className="lg:col-span-2 space-y-4">
              {result ? (
                <div className="space-y-4 animate-fadeIn">
                  
                  {/* Standard Metadata Header */}
                  <div className="saas-card p-3 bg-gray-100/50 dark:bg-gray-800/40 text-[11px] font-mono flex items-center justify-between text-gray-500 dark:text-gray-400">
                    <span>AI Engine: {result.metadata?.provider}</span>
                    <span>Latency: {result.executionTime}</span>
                    <span>Saved to MongoDB: Yes</span>
                  </div>

                  {/* Overall Compatibility & AI Explanation */}
                  <div className="saas-card p-5 grid grid-cols-1 sm:grid-cols-3 gap-4 items-center border-l-4 border-l-blue-500">
                    <CompatibilityGauge score={result.output.compatibilityScore || 94} label="Overall Compatibility" />
                    
                    <div className="sm:col-span-2 space-y-2">
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-wider">
                        AI Team Strategy Rationale
                      </span>
                      <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed">
                        {result.output.aiExplanation}
                      </p>
                    </div>
                  </div>

                  {/* Step 5: Recommended Teammates Cards from Real MongoDB Users */}
                  <div className="saas-card p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <span>Recommended Teammates (From Registered MongoDB Users)</span>
                      </h4>
                      <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                        {result.output.recommendedTeammates?.length || 0} Candidates Selected
                      </span>
                    </div>

                    <div className="space-y-3.5">
                      {result.output.recommendedTeammates?.map((mate, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 hover:border-brand-500/50 transition-all space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm">
                                {mate.name ? mate.name.charAt(0).toUpperCase() : 'C'}
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <h5 className="font-bold text-sm text-gray-900 dark:text-white">
                                    {mate.name}
                                  </h5>
                                  <span className="px-2 py-0.5 text-[10px] font-bold rounded bg-brand-500/10 text-brand-400">
                                    {mate.assignedRole || 'Team Member'}
                                  </span>
                                </div>
                                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                                  {mate.college || 'Engineering College'} &bull; {mate.email}
                                </p>
                              </div>
                            </div>

                            <span className="px-3 py-1 rounded-xl text-xs font-extrabold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 flex-shrink-0">
                              {mate.compatibilityScore || 92}% Match Score
                            </span>
                          </div>

                          {/* AI Reason */}
                          <div className="p-3 rounded-xl bg-white dark:bg-gray-900/80 border border-gray-100 dark:border-gray-800 text-xs">
                            <strong className="text-blue-500 block mb-0.5 text-[11px] uppercase tracking-wider">
                              Why Selected by AI:
                            </strong>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                              {mate.reason}
                            </p>
                          </div>

                          {/* Matched Skills & Links */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                            <div className="flex flex-wrap gap-1.5">
                              {mate.matchedSkills?.map((s, i) => (
                                <span key={i} className="px-2 py-0.5 text-[10px] rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-mono">
                                  {s}
                                </span>
                              ))}
                            </div>

                            <div className="flex items-center gap-3 text-gray-400 text-xs">
                              {mate.githubUrl && (
                                <a href={mate.githubUrl} target="_blank" rel="noreferrer" className="hover:text-white flex items-center gap-1">
                                  <Github className="w-3.5 h-3.5" /> GitHub
                                </a>
                              )}
                              {mate.linkedinUrl && (
                                <a href={mate.linkedinUrl} target="_blank" rel="noreferrer" className="hover:text-blue-400 flex items-center gap-1">
                                  <Linkedin className="w-3.5 h-3.5" /> LinkedIn
                                </a>
                              )}
                            </div>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Missing Skills & Improvements */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {result.output.missingSkills && result.output.missingSkills.length > 0 && (
                      <div className="saas-card p-4 space-y-2 border-l-4 border-l-rose-500">
                        <span className="text-[10px] font-bold text-rose-500 uppercase tracking-wider flex items-center gap-1">
                          <AlertCircle className="w-3.5 h-3.5" /> Missing Tech Competencies
                        </span>
                        <div className="flex flex-wrap gap-1.5 pt-1">
                          {result.output.missingSkills.map((sk, i) => (
                            <span key={i} className="px-2 py-0.5 rounded text-[10px] bg-rose-500/10 text-rose-400 font-mono">
                              {sk}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.output.suggestedImprovements && (
                      <div className="saas-card p-4 space-y-2 border-l-4 border-l-amber-500">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
                          <Lightbulb className="w-3.5 h-3.5" /> Suggested Team Improvements
                        </span>
                        <ul className="text-xs text-gray-700 dark:text-gray-300 space-y-1 list-disc list-inside">
                          {result.output.suggestedImprovements.map((imp, i) => (
                            <li key={i}>{imp}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Next Step Banner */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-900/20 to-indigo-900/20 border border-blue-500/30 flex items-center justify-between">
                    <div>
                      <p className="text-xs font-bold text-white">Team Saved to MongoDB Teams Repository</p>
                      <p className="text-[11px] text-gray-400">Pass this team setup to Hackathon Mentor AI or view in Teams & Projects.</p>
                    </div>
                    <div className="flex gap-2">
                      <Link to="/teams-projects" className="saas-btn-secondary text-xs py-1.5 px-3">
                        View Saved Team
                      </Link>
                      <Link to="/agents/hackathon-mentor" className="saas-btn-primary text-xs py-1.5 px-3">
                        <span>Hackathon Mentor &rarr;</span>
                      </Link>
                    </div>
                  </div>

                </div>
              ) : (
                <div className="saas-card p-12 text-center text-gray-400 space-y-3">
                  <Users className="w-10 h-10 mx-auto text-blue-500/50" />
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-300">
                    Team Collaborator Agent Ready
                  </p>
                  <p className="text-xs max-w-sm mx-auto text-gray-400">
                    Enter your Project Specifications on the left and click "Generate Dynamic Team" to evaluate real candidate users from MongoDB.
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
