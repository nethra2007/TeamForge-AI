import React, { useState, useEffect } from 'react';
import { getTeamsApi, createTeamApi } from '../services/teamApi';
import { getProjectsApi, createProjectApi } from '../services/projectApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Users, FolderGit2, Plus, CheckCircle2, Trophy, Code, Layers } from 'lucide-react';

export default function TeamsProjectsPage() {
  const [teams, setTeams] = useState([]);
  const [projects, setProjects] = useState([]);
  const [activeTab, setActiveTab] = useState('teams');

  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDomain, setNewTeamDomain] = useState('AI SaaS');
  const [newProjTitle, setNewProjTitle] = useState('');
  const [newProjDesc, setNewProjDesc] = useState('');

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const teamsRes = await getTeamsApi();
      const projRes = await getProjectsApi();
      setTeams(teamsRes.data || []);
      setProjects(projRes.data || []);
    } catch (err) {
      console.warn('[TeamsProjects] Could not load API data');
    }
  };

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    if (!newTeamName) return;
    try {
      const res = await createTeamApi({ name: newTeamName, domain: newTeamDomain });
      setTeams([res.data, ...teams]);
      setNewTeamName('');
      setToast({ type: 'success', message: 'Team created successfully!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjTitle) return;
    try {
      const res = await createProjectApi({ title: newProjTitle, description: newProjDesc, domain: 'Web & AI' });
      setProjects([res.data, ...projects]);
      setNewProjTitle('');
      setNewProjDesc('');
      setToast({ type: 'success', message: 'Project artifact created!' });
    } catch (err) {
      setToast({ type: 'error', message: err.message });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-brand-500" />
                <span>Teams & Project Artifacts</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Manage your collaborative teams and project repositories.
              </p>
            </div>

            <div className="flex bg-gray-200 dark:bg-gray-800 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab('teams')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'teams' ? 'bg-white dark:bg-gray-900 text-brand-500 shadow-xs' : 'text-gray-400'
                }`}
              >
                Teams ({teams.length})
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeTab === 'projects' ? 'bg-white dark:bg-gray-900 text-brand-500 shadow-xs' : 'text-gray-400'
                }`}
              >
                Projects ({projects.length})
              </button>
            </div>
          </div>

          {activeTab === 'teams' ? (
            <div className="space-y-6">
              <form onSubmit={handleCreateTeam} className="saas-card p-4 flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  placeholder="Team Name (e.g. TeamForge Alpha)"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="saas-input text-xs flex-1"
                />
                <input
                  type="text"
                  placeholder="Domain (e.g. AI SaaS)"
                  value={newTeamDomain}
                  onChange={(e) => setNewTeamDomain(e.target.value)}
                  className="saas-input text-xs w-full sm:w-48"
                />
                <button type="submit" className="saas-btn-primary py-2 px-4 text-xs">
                  <Plus className="w-4 h-4" /> Create Team
                </button>
              </form>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {teams.map((team, idx) => (
                  <div key={idx} className="saas-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-sm text-gray-900 dark:text-white">{team.name}</h3>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                        {team.compatibilityScore || 92}% Match
                      </span>
                    </div>

                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Domain: <span className="font-semibold text-brand-400">{team.domain}</span>
                    </p>

                    <div className="pt-2 border-t border-gray-100 dark:border-gray-800 space-y-1.5">
                      <p className="text-[10px] font-bold uppercase text-gray-400">Members</p>
                      {team.members?.map((m, mIdx) => (
                        <div key={mIdx} className="flex items-center justify-between text-xs p-2 rounded bg-gray-50 dark:bg-gray-800/40">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{m.name}</span>
                          <span className="text-[10px] text-gray-400">{m.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <form onSubmit={handleCreateProject} className="saas-card p-4 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="Project Title"
                    value={newProjTitle}
                    onChange={(e) => setNewProjTitle(e.target.value)}
                    className="saas-input text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Short Description"
                    value={newProjDesc}
                    onChange={(e) => setNewProjDesc(e.target.value)}
                    className="saas-input text-xs"
                  />
                </div>
                <button type="submit" className="saas-btn-primary py-2 px-4 text-xs">
                  <Plus className="w-4 h-4" /> Save Project Artifact
                </button>
              </form>

              <div className="space-y-4">
                {projects.map((proj, idx) => (
                  <div key={idx} className="saas-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-base text-gray-900 dark:text-white">{proj.title}</h3>
                      <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded bg-brand-500/10 text-brand-400">
                        {proj.status || 'In Progress'}
                      </span>
                    </div>

                    <p className="text-xs text-gray-600 dark:text-gray-300">{proj.description}</p>

                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {proj.techStack?.map((t, tIdx) => (
                        <span key={tIdx} className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-400 font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
