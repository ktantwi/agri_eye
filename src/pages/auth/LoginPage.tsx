import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriEyeLogo } from '../../components/common/AgriEyeLogo';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, ArrowRight, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, loginWithGoogle, isLoading } = useAuthStore();

  const [email, setEmail] = useState('agronomist@agrieye.io');
  const [password, setPassword] = useState('AgriEye2026!');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const success = await login(email, password);
    if (success) {
      navigate('/app');
    } else {
      setError('Invalid email or password. Please try again.');
    }
  };

  const handleDemoLogin = async () => {
    await login('agronomist@agrieye.io', 'demo');
    navigate('/app');
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <AgriEyeLogo size="lg" showTagline={true} linkTo="/" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-forest-950">
          Sign In to Your Satellite Map
        </h2>
        <p className="text-xs text-gray-500">
          Monitor your field boundaries, NDVI health metrics, and crop stress anomalies.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl shadow-float border border-white/80 space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          {/* Instant Demo Sandbox Access */}
          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex items-center justify-center gap-2 bg-lime-400/20 hover:bg-lime-400/30 text-forest-900 border border-lime-500/40 font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-forest-800" />
            <span>Instant Demo Access (Dr. Sarah Jenkins)</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-forest-900/10 w-full" />
            <span className="bg-white/80 px-2 text-[10px] text-gray-400 uppercase font-mono absolute">
              or email sign in
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                  placeholder="you@farmcorp.com"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-gray-700">Password</label>
                <Link
                  to="/forgot-password"
                  className="text-[11px] text-forest-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4 text-lime-400" />
                </>
              )}
            </button>
          </form>

          {/* Google OAuth */}
          <button
            type="button"
            onClick={loginWithGoogle}
            className="w-full flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-charcoal-900 border border-gray-200 text-xs font-semibold py-2.5 px-4 rounded-xl transition-all shadow-sm"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          <p className="text-center text-xs text-gray-500 pt-2 border-t border-forest-900/10">
            Don't have an AgriEye account?{' '}
            <Link to="/signup" className="font-semibold text-forest-900 hover:underline">
              Start free (no card required)
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
