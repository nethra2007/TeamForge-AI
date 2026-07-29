import React, { useState, useEffect } from 'react';
import { getAnalyticsApi } from '../services/agentApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import ReadinessMeter from '../components/ReadinessMeter';
import { BarChart3, TrendingUp, Award, Zap, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function AnalyticsPage() {
  const [data, setData] = useState({
    overallReadinessScore: 88,
    readinessBreakdown: {
      technicalSkills: 85,
      projectPortfolio: 92,
      researchLitReview: 82,
      teamCollaboration: 95,
      interviewPreparedness: 86
    },
    skillRadar: [
      { skill: 'React & Frontend', level: 90 },
      { skill: 'Node & Express APIs', level: 88 },
      { skill: 'AI & Gemini Engine', level: 92 },
      { skill: 'MongoDB & Schemas', level: 85 },
      { skill: 'Agile Sprint Management', level: 88 },
      { skill: 'System Design at Scale', level: 80 }
    ],
    sprintMetrics: {
      totalSprintsCompleted: 3,
      velocityScore: 92,
      tasksCompleted: 14,
      tasksPending: 3
    }
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalyticsApi();
      if (res.data) setData(res.data);
    } catch (err) {
      console.warn('[Analytics] Using local metrics');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-brand-500" />
              <span>Student Readiness & Ecosystem Analytics</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Real-time skill growth metrics, placement readiness, and sprint velocity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <ReadinessMeter score={data.overallReadinessScore} />
            </div>

            <div className="md:col-span-2 saas-card p-5 space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Award className="w-4 h-4 text-brand-500" />
                <span>Placement Competency Breakdown</span>
              </h3>

              <div className="space-y-2.5">
                {Object.entries(data.readinessBreakdown || {}).map(([key, val]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs font-semibold mb-1">
                      <span className="capitalize text-gray-700 dark:text-gray-300">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-brand-500 font-mono">{val}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-brand-500 h-full rounded-full transition-all duration-500"
                        style={{ width: `${val}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Skill Radar List */}
          <div className="saas-card p-5 space-y-4">
            <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-500" />
              <span>Technical Skill Proficiency</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {data.skillRadar?.map((item, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80">
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span className="text-gray-900 dark:text-white">{item.skill}</span>
                    <span className="text-brand-500 font-mono">{item.level}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full"
                      style={{ width: `${item.level}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </main>
      </div>

      <Footer />
    </div>
  );
}
