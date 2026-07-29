import React from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  Trophy,
  Compass,
  Kanban,
  Briefcase,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Layers,
  Cpu,
  CheckCircle2
} from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function LandingPage() {
  const agents = [
    {
      num: '01',
      title: 'TeamForge Collaborator',
      desc: 'Analyzes student profiles, matches complementary skillsets, calculates compatibility scores, and assigns project roles.',
      icon: Users,
      color: 'from-blue-500/20 to-indigo-500/20 text-blue-500 border-blue-500/30'
    },
    {
      num: '02',
      title: 'LitReview AI',
      desc: 'Queries arXiv & academic APIs, summarizes literature, constructs matrices, and pinpoints unaddressed research gaps.',
      icon: BookOpen,
      color: 'from-purple-500/20 to-pink-500/20 text-purple-500 border-purple-500/30'
    },
    {
      num: '03',
      title: 'Hackathon Mentor AI',
      desc: 'Generates winning hackathon ideas, system architectures, elevator pitches, and instant GitHub README markdowns.',
      icon: Trophy,
      color: 'from-amber-500/20 to-yellow-500/20 text-amber-500 border-amber-500/30'
    },
    {
      num: '04',
      title: 'SkillPath AI',
      desc: 'Identifies missing technical competencies, estimates learning durations, and compiles weekly milestone roadmaps.',
      icon: Compass,
      color: 'from-emerald-500/20 to-teal-500/20 text-emerald-500 border-emerald-500/30'
    },
    {
      num: '05',
      title: 'SprintFlow AI',
      desc: 'Decomposes complex engineering goals into Agile sprints, interactive Kanban task boards, and milestone timelines.',
      icon: Kanban,
      color: 'from-cyan-500/20 to-blue-500/20 text-cyan-500 border-cyan-500/30'
    },
    {
      num: '06',
      title: 'PlacementPrep AI',
      desc: 'Analyzes resumes, generates targeted technical/behavioral Q&A, and computes a student placement readiness score.',
      icon: Briefcase,
      color: 'from-rose-500/20 to-red-500/20 text-rose-500 border-rose-500/30'
    }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <main className="flex-1">
        
        {/* HERO SECTION */}
        <section className="relative overflow-hidden pt-12 pb-20 px-4 sm:px-6 lg:px-8 border-b border-gray-200 dark:border-gray-800/80">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-brand-500/10 dark:bg-brand-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-5xl mx-auto text-center relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500/20 text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              <span>Introducing the Autonomous 6-Agent Ecosystem</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight text-gray-900 dark:text-white mb-6">
              Your Autonomous Student <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-500 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Innovation & Career Copilot
              </span>
            </h1>

            <p className="text-base sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8 font-normal leading-relaxed">
              Stop switching between 6 different platforms. TeamForge AI brings team formation, paper literature reviews, hackathon mentoring, sprint planning, skill mapping, and placement preparation into one unified autonomous platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/register"
                className="saas-btn-primary px-6 py-3.5 text-base w-full sm:w-auto shadow-lg shadow-brand-500/20"
              >
                <span>Launch Autonomous Copilot</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/dashboard"
                className="saas-btn-secondary px-6 py-3.5 text-base w-full sm:w-auto"
              >
                <span>Explore Live Agent Demo</span>
              </Link>
            </div>

            {/* Quick Metrics Banner */}
            <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
              <div>
                <p className="text-2xl font-extrabold text-brand-500">6</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Autonomous Agents</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-indigo-500">100%</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Context Pipeline Chaining</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-cyan-500">MERN</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Production Architecture</p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-purple-500">Google Gemini</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">AI Intelligence Engine</p>
              </div>
            </div>
          </div>
        </section>

        {/* MULTI-AGENT WORKFLOW DIAGRAM */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-extrabold uppercase tracking-wider text-brand-500">
              Autonomous Intelligence Pipeline
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold mt-2 text-gray-900 dark:text-white">
              Shared Context Chaining Across All 6 Agents
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mt-2">
              Unlike static chatbots, each agent preserves state outputs and propagates findings downstream to the next step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {agents.map((agent, idx) => {
              const Icon = agent.icon;
              return (
                <div key={agent.num} className="saas-card p-4 relative group hover:border-brand-500/60 transition-all">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-mono font-bold text-gray-400">#{agent.num}</span>
                    <div className={`p-1.5 rounded-lg border bg-gradient-to-br ${agent.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                  </div>
                  <h4 className="font-bold text-xs text-gray-900 dark:text-white mb-1">
                    {agent.title}
                  </h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 leading-normal">
                    {agent.desc.substring(0, 75)}...
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* AGENT DETAIL CARDS */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-100/50 dark:bg-[#0E1420] border-y border-gray-200 dark:border-gray-800">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row items-center justify-between mb-12">
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 dark:text-white">
                  Meet the 6 Specialized AI Agents
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Each agent operates independently or collaboratively inside the platform.
                </p>
              </div>
              <Link to="/register" className="saas-btn-primary text-xs mt-4 md:mt-0">
                Get Started Free
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {agents.map((agent) => {
                const Icon = agent.icon;
                return (
                  <div key={agent.title} className="saas-card p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className={`p-3 rounded-xl border bg-gradient-to-br ${agent.color}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-gray-100 dark:bg-gray-800 text-gray-500">
                          Agent {agent.num}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                        {agent.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed mb-6">
                        {agent.desc}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between text-xs">
                      <span className="text-gray-400 flex items-center gap-1 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                        Ready to Execute
                      </span>
                      <Link to="/login" className="font-semibold text-brand-500 hover:underline">
                        Test Agent &rarr;
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
