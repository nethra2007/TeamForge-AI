import React from 'react';
import { useUser } from '../context/UserContext';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import AgentCard from '../components/AgentCard';
import ReadinessMeter from '../components/ReadinessMeter';
import {
  Users,
  BookOpen,
  Trophy,
  Compass,
  Kanban,
  Briefcase,
  Sparkles,
  ArrowRight,
  TrendingUp,
  Award,
  Layers,
  Zap,
  UserCheck
} from 'lucide-react';

export default function DashboardPage() {
  const { userProfile } = useUser();

  const agentCards = [
    {
      num: 1,
      title: 'TeamForge Collaborator',
      desc: 'Matches complementary skills, generates optimal project teams, and assigns member roles.',
      icon: Users,
      color: 'bg-blue-500/10 text-blue-500',
      path: '/agents/collaborator'
    },
    {
      num: 2,
      title: 'LitReview AI',
      desc: 'Searches arXiv & academic literature, synthesizes abstracts, and identifies research gaps.',
      icon: BookOpen,
      color: 'bg-purple-500/10 text-purple-500',
      path: '/agents/lit-review'
    },
    {
      num: 3,
      title: 'Hackathon Mentor AI',
      desc: 'Generates winning project ideas, system architecture, elevator pitch, and README.',
      icon: Trophy,
      color: 'bg-amber-500/10 text-amber-500',
      path: '/agents/hackathon-mentor'
    },
    {
      num: 4,
      title: 'SkillPath AI',
      desc: 'Analyzes career skill gaps and compiles a week-by-week learning roadmap.',
      icon: Compass,
      color: 'bg-emerald-500/10 text-emerald-500',
      path: '/agents/skill-path'
    },
    {
      num: 5,
      title: 'SprintFlow AI',
      desc: 'Agile project planner with Kanban task distribution, milestones, and sprint velocity.',
      icon: Kanban,
      color: 'bg-cyan-500/10 text-cyan-500',
      path: '/agents/sprint-flow'
    },
    {
      num: 6,
      title: 'PlacementPrep AI',
      desc: 'Resume feedback, targeted technical/behavioral Q&A, and placement readiness score.',
      icon: Briefcase,
      color: 'bg-rose-500/10 text-rose-500',
      path: '/agents/placement-prep'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          {/* Welcome Student Banner */}
          <div className="saas-card p-6 bg-gradient-to-r from-brand-900/20 via-indigo-900/20 to-purple-900/10 border-brand-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/20 text-brand-400 uppercase tracking-wider">
                  Active Workspace
                </span>
                <span className="text-xs text-gray-400">&bull; {userProfile.college || 'Stanford University'}</span>
              </div>
              <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
                Welcome, {userProfile.name || 'Alex Morgan'}!
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-300 mt-1 max-w-xl">
                Targeting: <strong className="text-brand-400">{userProfile.targetCareer || 'Senior AI Engineer'}</strong> at {userProfile.targetCompany || 'Top Tech SaaS'}.
              </p>
            </div>

            <Link
              to="/pipeline"
              className="saas-btn-primary py-2.5 px-5 text-xs whitespace-nowrap shadow-lg shadow-brand-500/20 flex-shrink-0"
            >
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Run Multi-Agent Pipeline</span>
            </Link>
          </div>

          {/* Quick Metrics & Readiness */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReadinessMeter score={userProfile.readinessScore || 88} />
            
            <div className="saas-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center flex-shrink-0">
                <Layers className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Ecosystem Context</p>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">6 Agents Chained</h4>
                <p className="text-[11px] text-emerald-500 font-semibold">Shared State Active</p>
              </div>
            </div>

            <div className="saas-card p-4 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Sprint Velocity</p>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white">92 / 100</h4>
                <p className="text-[11px] text-gray-400">3 Sprints Completed</p>
              </div>
            </div>
          </div>

          {/* 6 AI Agents Grid Section */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                  <Zap className="w-5 h-5 text-brand-500" />
                  <span>Autonomous AI Agent Studios</span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Select an agent to launch its independent studio or run the multi-agent context pipeline.
                </p>
              </div>

              <Link
                to="/pipeline"
                className="text-xs font-semibold text-brand-500 hover:underline hidden sm:block"
              >
                Launch Chained Pipeline &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {agentCards.map((agent) => (
                <AgentCard
                  key={agent.num}
                  agentNumber={agent.num}
                  title={agent.title}
                  description={agent.desc}
                  icon={agent.icon}
                  color={agent.color}
                  path={agent.path}
                />
              ))}
            </div>
          </div>

          {/* Student Profile Quick Tags */}
          <div className="saas-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-brand-500" />
                <span>Your Skill Profile Context</span>
              </h3>
              <Link to="/profile" className="text-xs font-semibold text-brand-500 hover:underline">
                Edit Profile
              </Link>
            </div>

            <div className="flex flex-wrap gap-2">
              {userProfile.skills?.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-lg text-xs font-medium bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
