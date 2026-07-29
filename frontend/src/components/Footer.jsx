import React from 'react';
import { Zap, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B0F17] border-t border-gray-200 dark:border-gray-800/80 py-6 px-4 text-center text-xs text-gray-500 dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-brand-500" />
          <span className="font-semibold text-gray-800 dark:text-gray-200">TeamForge AI</span>
          <span>&mdash; Your Autonomous Student Innovation & Career Copilot</span>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <span>6 Autonomous Agents Ecosystem</span>
          <span>&bull;</span>
          <span>MERN Architecture</span>
          <span>&bull;</span>
          <span>Powered by Gemini API</span>
        </div>
      </div>
    </footer>
  );
}
