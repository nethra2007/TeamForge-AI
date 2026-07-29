import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Settings, Key, Moon, Sun, Save, ShieldCheck } from 'lucide-react';

export default function SettingsPage() {
  const { theme, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState(() => localStorage.getItem('teamforge_gemini_key') || '');
  const [toast, setToast] = useState({ type: '', message: '' });

  const handleSaveKey = (e) => {
    e.preventDefault();
    localStorage.setItem('teamforge_gemini_key', apiKey.trim());
    setToast({ type: 'success', message: 'Gemini API Key override saved to browser storage!' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-3xl">
          
          <div className="border-b border-gray-200 dark:border-gray-800 pb-4">
            <h1 className="text-xl font-extrabold text-gray-900 dark:text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-brand-500" />
              <span>Platform Settings & AI Keys</span>
            </h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Configure Google Gemini API keys and appearance preferences.
            </p>
          </div>

          <div className="space-y-6">
            
            {/* Gemini Key Override Form */}
            <form onSubmit={handleSaveKey} className="saas-card p-6 space-y-4">
              <div className="flex items-center gap-2 font-bold text-sm text-gray-900 dark:text-white">
                <Key className="w-4 h-4 text-brand-500" />
                <span>Google Gemini API Key Override</span>
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400">
                Optional: Enter a custom Gemini API key to override backend server default key during agent execution.
              </p>

              <div>
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy..."
                  className="saas-input font-mono text-xs"
                />
              </div>

              <button type="submit" className="saas-btn-primary py-2 px-4 text-xs">
                <Save className="w-4 h-4" /> Save Key Override
              </button>
            </form>

            {/* Theme Toggle */}
            <div className="saas-card p-6 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white">
                  Color Theme Preference
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Switch between Dark SaaS Theme and Crisp Light Theme.
                </p>
              </div>

              <button
                onClick={toggleTheme}
                className="saas-btn-secondary text-xs py-2 px-4"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                <span>{theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
            </div>

          </div>

        </main>
      </div>

      <Toast type={toast.type} message={toast.message} onClose={() => setToast({ type: '', message: '' })} />
      <Footer />
    </div>
  );
}
