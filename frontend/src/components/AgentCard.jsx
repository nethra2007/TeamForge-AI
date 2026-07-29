import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function AgentCard({ agentNumber, title, description, icon: Icon, color, path, outputsCount }) {
  return (
    <div className="saas-card p-5 group flex flex-col justify-between hover:border-brand-500/50 transition-all">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700">
            Agent {agentNumber}
          </span>
        </div>

        <h3 className="font-bold text-base text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors mb-1.5 flex items-center gap-1.5">
          {title}
        </h3>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed mb-4">
          {description}
        </p>
      </div>

      <div className="pt-4 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
        <span className="text-[11px] font-medium text-gray-400 flex items-center gap-1">
          <Sparkles className="w-3 h-3 text-brand-500" />
          {outputsCount ? `${outputsCount} Generations` : 'Autonomous AI'}
        </span>

        <Link
          to={path}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 dark:text-brand-400 group-hover:translate-x-1 transition-transform"
        >
          <span>Launch Studio</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
