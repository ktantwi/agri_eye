import React from 'react';
import { Link } from 'react-router-dom';
import { AgriEyeLogo } from '../../components/common/AgriEyeLogo';
import { Compass, ArrowRight } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center p-4 text-center space-y-6">
      <AgriEyeLogo size="lg" showTagline={true} linkTo="/" />

      <div className="glass-panel p-8 rounded-3xl max-w-md w-full shadow-float border border-white/80 space-y-4">
        <div className="w-14 h-14 bg-forest-900/10 text-forest-900 rounded-2xl flex items-center justify-center mx-auto">
          <Compass className="w-7 h-7 text-forest-800 animate-spin" />
        </div>

        <h1 className="font-serif font-bold text-3xl text-forest-950">
          404 — Coordinates Lost
        </h1>

        <p className="text-xs text-gray-600 leading-relaxed">
          The field coordinate or page you requested does not exist on our satellite map.
        </p>

        <div className="pt-2">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-5 py-2.5 rounded-xl transition-all shadow-sm"
          >
            <span>Return to Field Map</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </div>
    </div>
  );
};
