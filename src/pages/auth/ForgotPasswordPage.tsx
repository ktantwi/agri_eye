import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AgriEyeLogo } from '../../components/common/AgriEyeLogo';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-sand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <div className="flex justify-center">
          <AgriEyeLogo size="lg" showTagline={true} linkTo="/" />
        </div>
        <h2 className="font-serif font-bold text-2xl text-forest-950">
          Reset Your Password
        </h2>
        <p className="text-xs text-gray-500">
          Enter your registered email and we'll send you an encrypted recovery link.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="glass-panel py-8 px-6 sm:px-10 rounded-3xl shadow-float border border-white/80 space-y-4">
          {sent ? (
            <div className="space-y-4 text-center">
              <div className="w-12 h-12 bg-lime-500/20 text-forest-900 rounded-2xl flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                Check Your Inbox
              </h3>
              <p className="text-xs text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>.
              </p>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 hover:underline pt-2"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Account Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                    placeholder="you@farm.com"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
              >
                Send Password Reset Link
              </button>

              <div className="text-center pt-2 border-t border-forest-900/10">
                <Link
                  to="/login"
                  className="inline-flex items-center gap-1.5 text-xs text-forest-900 hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Return to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
