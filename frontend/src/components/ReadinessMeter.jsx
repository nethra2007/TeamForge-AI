import React from 'react';

export default function ReadinessMeter({ score = 85 }) {
  return (
    <div className="saas-card p-4 flex items-center gap-4 bg-gradient-to-r from-brand-900/10 via-indigo-900/10 to-transparent border-brand-500/30">
      <div className="w-16 h-16 rounded-2xl bg-brand-600/10 dark:bg-brand-500/20 border border-brand-500/30 flex flex-col items-center justify-center flex-shrink-0">
        <span className="text-xl font-black text-brand-600 dark:text-brand-400">
          {score}
        </span>
        <span className="text-[9px] font-bold text-gray-400 uppercase">/ 100</span>
      </div>
      <div>
        <h4 className="font-bold text-sm text-gray-900 dark:text-white">
          Placement Readiness Score
        </h4>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {score >= 85 ? 'Strong candidate profile for Tier-1 Product Tech roles.' : 'Good foundation. Bridge missing skills in weekly roadmap.'}
        </p>
        <div className="w-full bg-gray-200 dark:bg-gray-800 h-1.5 rounded-full mt-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-500 to-indigo-500 h-full rounded-full transition-all duration-700"
            style={{ width: `${score}%` }}
          />
        </div>
      </div>
    </div>
  );
}
