import React, { useState, useEffect } from 'react';
import { getHistoryApi } from '../services/agentApi';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { History, Search, Copy, CheckCircle2, FileText, Sparkles } from 'lucide-react';

export default function HistoryPage() {
  const [historyData, setHistoryData] = useState({
    research: [],
    hackathons: [],
    learningPlans: [],
    sprintPlans: [],
    placementReports: []
  });

  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState(null);
  const [toast, setToast] = useState({ type: '', message: '' });

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await getHistoryApi();
      if (res.data) setHistoryData(res.data);
    } catch (err) {
      console.warn('[HistoryPage] Error loading history');
    }
  };

  const handleCopy = (data, idx) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-800 pb-4">
            <div>
              <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
                <History className="w-5 h-5 text-brand-500" />
                <span>Agent Generation History</span>
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Searchable repository of past AI agent outputs, literature reviews, and placement reports.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search history..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="saas-input pl-9 text-xs"
              />
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Hackathon Runs */}
            <div className="saas-card p-5 space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Hackathon Mentor & Architecture Runs</span>
              </h3>

              {historyData.hackathons?.length === 0 ? (
                <p className="text-xs text-gray-400">No hackathon strategy runs recorded yet.</p>
              ) : (
                historyData.hackathons?.map((h, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{h.projectIdea}</p>
                      <p className="text-[11px] text-gray-400">{h.problemStatement}</p>
                    </div>
                    <button
                      onClick={() => handleCopy(h, `h_${idx}`)}
                      className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      {copiedIdx === `h_${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Lit Review Runs */}
            <div className="saas-card p-5 space-y-3">
              <h3 className="font-bold text-sm text-gray-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-purple-500" />
                <span>Academic Literature Review Runs</span>
              </h3>

              {historyData.research?.length === 0 ? (
                <p className="text-xs text-gray-400">No literature review runs recorded yet.</p>
              ) : (
                historyData.research?.map((r, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/80 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white">{r.topic}</p>
                      <p className="text-[11px] text-gray-400">Gap: {r.researchGap?.substring(0, 80)}...</p>
                    </div>
                    <button
                      onClick={() => handleCopy(r, `r_${idx}`)}
                      className="p-1.5 rounded bg-gray-200 dark:bg-gray-700 text-gray-300 hover:text-white"
                    >
                      {copiedIdx === `r_${idx}` ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                ))
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
