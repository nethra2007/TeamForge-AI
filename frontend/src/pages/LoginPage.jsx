import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Toast from '../components/Toast';
import { Zap, ArrowRight, Lock, Mail } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSubmitting(true);

    try {
      await login({ email, password });
      navigate('/dashboard');
    } catch (err) {
      setErrorMsg(err.message || 'Login failed. Check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-[#0B0F17] text-gray-900 dark:text-white transition-colors">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 py-12">
        <div className="w-full max-w-md">
          
          <div className="text-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600/10 border border-brand-500/30 text-brand-500 flex items-center justify-center mx-auto mb-3">
              <Zap className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight">Welcome Back</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Access your autonomous student AI workspace
            </p>
          </div>

          <form onSubmit={handleSubmit} className="saas-card p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Student Email Address
              </label>
              <div className="flex items-center relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your student email"
                  className="saas-input pl-9 w-full"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Password
              </label>
              <div className="flex items-center relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="saas-input pl-9 w-full"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="saas-btn-primary w-full py-3 text-sm mt-2"
            >
              {submitting ? 'Authenticating...' : 'Sign In to Dashboard'}
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-gray-100 dark:border-gray-800 text-center text-xs text-gray-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-brand-500 hover:underline">
                Create Student Account
              </Link>
            </div>
          </form>

        </div>
      </main>

      <Toast type="error" message={errorMsg} onClose={() => setErrorMsg('')} />
      <Footer />
    </div>
  );
}
