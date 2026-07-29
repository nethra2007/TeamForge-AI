import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  BookOpen,
  Trophy,
  Compass,
  Kanban,
  Briefcase,
  Layers,
  FolderGit2,
  History,
  BarChart3,
  Settings,
  User,
  Sparkles
} from 'lucide-react';

export default function Sidebar() {
  const agents = [
    { path: '/agents/collaborator', label: 'Team Collaborator', icon: Users, badge: 'Agent 1', color: 'text-blue-500 bg-blue-500/10' },
    { path: '/agents/lit-review', label: 'LitReview AI', icon: BookOpen, badge: 'Agent 2', color: 'text-purple-500 bg-purple-500/10' },
    { path: '/agents/hackathon-mentor', label: 'Hackathon Mentor', icon: Trophy, badge: 'Agent 3', color: 'text-amber-500 bg-amber-500/10' },
    { path: '/agents/skill-path', label: 'SkillPath AI', icon: Compass, badge: 'Agent 4', color: 'text-emerald-500 bg-emerald-500/10' },
    { path: '/agents/sprint-flow', label: 'SprintFlow AI', icon: Kanban, badge: 'Agent 5', color: 'text-cyan-500 bg-cyan-500/10' },
    { path: '/agents/placement-prep', label: 'PlacementPrep AI', icon: Briefcase, badge: 'Agent 6', color: 'text-rose-500 bg-rose-500/10' },
  ];

  const mainNav = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/pipeline', label: 'Multi-Agent Pipeline', icon: Layers, highlight: true },
    { path: '/sprint-history', label: 'Sprint History', icon: Kanban },
    { path: '/learning-roadmaps', label: 'Learning Roadmaps', icon: Compass },
    { path: '/teams-projects', label: 'Teams & Projects', icon: FolderGit2 },
    { path: '/history', label: 'Generation History', icon: History },
    { path: '/analytics', label: 'Analytics & Readiness', icon: BarChart3 },
  ];

  const secondaryNav = [
    { path: '/profile', label: 'Student Profile', icon: User },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  const getLinkClass = ({ isActive }, isHighlight = false) => {
    return `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
      isActive
        ? isHighlight
          ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-sm font-semibold'
          : 'bg-gray-200 dark:bg-gray-800 text-brand-600 dark:text-brand-400 font-semibold'
        : isHighlight
          ? 'bg-brand-50 dark:bg-brand-950/40 text-brand-600 dark:text-brand-400 hover:bg-brand-100 dark:hover:bg-brand-900/40'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800/60 hover:text-gray-900 dark:hover:text-gray-200'
    }`;
  };

  return (
    <aside className="w-64 flex-shrink-0 hidden lg:block bg-white dark:bg-[#0E1420] border-r border-gray-200 dark:border-gray-800/80 min-h-[calc(100vh-65px)] p-4 transition-colors">
      <div className="space-y-6">
        
        {/* Main Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Overview
          </p>
          <div className="space-y-1">
            {mainNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={(props) => getLinkClass(props, item.highlight)}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.highlight && <Sparkles className="w-3.5 h-3.5 opacity-80" />}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* 6 AI Agents Section */}
        <div>
          <div className="flex items-center justify-between px-3 mb-2">
            <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
              Autonomous AI Agents
            </p>
            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-brand-500/10 text-brand-500">
              6 Agents
            </span>
          </div>
          <div className="space-y-1">
            {agents.map((agent) => {
              const Icon = agent.icon;
              return (
                <NavLink key={agent.path} to={agent.path} className={getLinkClass}>
                  <div className="flex items-center gap-2.5">
                    <div className={`p-1 rounded-md ${agent.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="truncate">{agent.label}</span>
                  </div>
                  <span className="text-[9px] font-mono font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                    {agent.badge}
                  </span>
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Account Section */}
        <div>
          <p className="px-3 text-[10px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2">
            Account & System
          </p>
          <div className="space-y-1">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink key={item.path} to={item.path} className={getLinkClass}>
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>

      </div>
    </aside>
  );
}
