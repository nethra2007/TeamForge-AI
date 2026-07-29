import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Sun, Moon, Sparkles, User, LogOut, Bell, Zap } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { userProfile } = useUser();
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-30 bg-white/80 dark:bg-[#0B0F17]/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800/80 px-4 lg:px-8 py-3.5 transition-colors">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 p-0.5 shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#0B0F17] rounded-[10px] flex items-center justify-center">
              <Zap className="w-5 h-5 text-brand-500 fill-brand-500/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-gray-900 dark:text-white">
                TeamForge <span className="text-brand-500">AI</span>
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-brand-500/10 text-brand-500 border border-brand-500/20">
                SaaS Copilot
              </span>
            </div>
            <p className="text-[11px] text-gray-500 dark:text-gray-400 hidden sm:block">
              Autonomous Student Innovation Ecosystem
            </p>
          </div>
        </Link>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          
          {/* Multi-Agent Pipeline Quick Launcher */}
          {isAuthenticated && (
            <Link
              to="/pipeline"
              className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-medium text-xs rounded-lg shadow-sm shadow-brand-500/20 transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse" />
              <span>Multi-Agent Chain</span>
            </Link>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700/80 rounded-xl transition-all"
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
          </button>

          {/* User Controls */}
          {isAuthenticated ? (
            <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-800">
              <Link to="/profile" className="flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center text-xs font-bold ring-2 ring-brand-500/20">
                  {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-semibold text-gray-900 dark:text-gray-200 group-hover:text-brand-500 transition-colors">
                    {userProfile.name || 'Alex Morgan'}
                  </p>
                  <p className="text-[10px] text-gray-500 dark:text-gray-400">
                    {userProfile.college || 'Engineering Student'}
                  </p>
                </div>
              </Link>

              <button
                onClick={() => {
                  logout();
                  navigate('/login');
                }}
                className="p-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-colors"
                title="Sign Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/login" className="saas-btn-secondary text-xs py-1.5">
                Sign In
              </Link>
              <Link to="/register" className="saas-btn-primary text-xs py-1.5">
                Get Started
              </Link>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}
