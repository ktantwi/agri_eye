import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriEyeLogo } from '../../components/common/AgriEyeLogo';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, User, Building, ArrowRight, Check, Loader2 } from 'lucide-react';

export const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const { signup, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    const success = await signup(email, password, fullName);
    if (success) {
      navigate('/app');
    }
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <AgriEyeLogo size="lg" showTagline={true} linkTo="/" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-forest-950">
          Create Your Free AgriEye Account
        </h2>
        <p className="text-xs text-gray-500">
          Monitor your fields with 10-meter Sentinel-2 NDVI. 14-day Pro features included.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl shadow-float border border-white/80 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="font-bold text-gray-700 block mb-1">Your Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                  placeholder="e.g. John Deere"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Farm / Agribusiness Name</label>
              <div className="relative">
                <Building className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                  placeholder="e.g. Prairie Ridge Farms LLC"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                  placeholder="you@farmland.com"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Password (min 6 characters)</label>
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

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm hover:shadow"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin text-lime-400" />
                ) : (
                  <>
                    <span>Create Account & Start Mapping</span>
                    <ArrowRight className="w-4 h-4 text-lime-400" />
                  </>
                )}
              </button>
            </div>
          </form>

          <p className="text-center text-xs text-gray-500 pt-2 border-t border-forest-900/10">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-forest-900 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
