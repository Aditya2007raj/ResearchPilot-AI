import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ROUTES } from '../../lib/routes';
import { useTheme } from '../../theme/ThemeProvider';
import { Lock, Mail, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login } = useAuth();
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || ROUTES.DASHBOARD;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.response?.data?.detail || err.message || 'Failed to authenticate. Please check your credentials.';
      setError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[var(--bg-base)] text-[var(--text-primary)] transition-colors duration-500 font-sans selection:bg-[var(--accent-indigo)] selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Background Ambient Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-[160px] top-[-10%] left-[-10%]" />
        <div className="absolute w-[500px] h-[500px] rounded-full bg-cyan-500/5 blur-[150px] bottom-[-10%] right-[-10%]" />
        <div className="absolute inset-0 bg-cyber-grid opacity-15 pointer-events-none" />
      </div>

      {/* Header */}
      <header className="relative z-20 px-8 py-6 flex items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-surface)]/80 backdrop-blur-md">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[var(--accent-indigo)] flex items-center justify-center text-white font-mono font-black tracking-tighter shadow-lg shadow-indigo-500/20">
            RP
          </div>
          <div className="flex flex-col">
            <span className="font-mono text-sm font-extrabold tracking-widest uppercase">ResearchPilot</span>
            <span className="text-[9px] text-[var(--accent-cyan)] font-mono tracking-widest uppercase">Operating System</span>
          </div>
        </Link>

        <button
          onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
          className="p-2.5 rounded-lg hover:bg-[var(--bg-base)] transition-all border border-[var(--border-subtle)] flex items-center justify-center text-xs"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
      </header>

      {/* Main Login Card */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md p-8 rounded-2xl border border-[var(--border-subtle)] bg-[var(--bg-surface)]/90 backdrop-blur-xl shadow-2xl relative">
          
          <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--accent-cyan)] font-mono text-[10px] uppercase tracking-wider mb-6 w-fit">
            <Shield className="w-3.5 h-3.5" /> Secure Authentication
          </div>

          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-2">Welcome Back</h1>
          <p className="text-xs text-[var(--text-secondary)] font-mono mb-8">
            Access your private papers, reviews, and isolated RAG knowledge base.
          </p>

          {error && (
            <div className="mb-6 p-3.5 rounded-xl border border-red-500/20 bg-red-500/10 text-red-500 text-xs font-mono flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 font-mono">
            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] uppercase tracking-wider mb-2 font-bold">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="academic@university.edu"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-indigo)] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] text-[var(--text-secondary)] uppercase tracking-wider mb-2 font-bold">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)]" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full pl-10 pr-4 py-3 text-xs rounded-xl border border-[var(--border-subtle)] bg-[var(--bg-base)] text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:border-[var(--accent-indigo)] transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 font-mono text-xs font-bold rounded-xl bg-gradient-to-r from-[var(--accent-indigo)] to-[var(--accent-indigo-hover)] text-white shadow-lg shadow-indigo-500/20 hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </div>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[var(--border-subtle)] text-center text-xs font-mono text-[var(--text-secondary)]">
            Don't have an account?{' '}
            <Link to={ROUTES.REGISTER} className="text-[var(--accent-cyan)] font-bold hover:underline">
              Create an Account
            </Link>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-8 py-4 border-t border-[var(--border-subtle)] bg-[var(--bg-surface)]/50 backdrop-blur-md text-center text-[10px] font-mono text-[var(--text-muted)]">
        ResearchPilot AI Operating System &bull; Multi-User Encrypted Workspace Security
      </footer>
    </div>
  );
}
