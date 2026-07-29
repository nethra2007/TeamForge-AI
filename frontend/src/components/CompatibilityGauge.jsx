import React from 'react';

export default function CompatibilityGauge({ score = 88, label = "Match Score" }) {
  const getScoreColor = (s) => {
    if (s >= 90) return 'text-emerald-500 stroke-emerald-500';
    if (s >= 75) return 'text-brand-500 stroke-brand-500';
    return 'text-amber-500 stroke-amber-500';
  };

  const strokeDashoffset = 283 - (283 * score) / 100;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <circle
            cx="50"
            cy="50"
            r="45"
            className="stroke-gray-200 dark:stroke-gray-800 fill-none"
            strokeWidth="8"
          />
          <circle
            cx="50"
            cy="50"
            r="45"
            className={`fill-none transition-all duration-1000 ease-out ${getScoreColor(score)}`}
            strokeWidth="8"
            strokeDasharray="283"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
          />
        </svg>
        <div className="absolute text-center">
          <span className="text-2xl font-extrabold text-gray-900 dark:text-white">
            {score}%
          </span>
        </div>
      </div>
      <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 mt-2">
        {label}
      </p>
    </div>
  );
}
