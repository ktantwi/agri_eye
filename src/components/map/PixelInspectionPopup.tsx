import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { X, Crosshair, Satellite, Calendar, Sparkles } from 'lucide-react';

export const PixelInspectionPopup: React.FC = () => {
  const { pixelInspection, setPixelInspection } = useMapStore();

  if (!pixelInspection) return null;

  const getValueColor = (val: number) => {
    if (val < 0.25) return 'text-amber-700 bg-amber-50 border-amber-200';
    if (val < 0.50) return 'text-yellow-700 bg-yellow-50 border-yellow-200';
    if (val < 0.70) return 'text-lime-700 bg-lime-50 border-lime-200';
    return 'text-forest-800 bg-forest-50 border-forest-200';
  };

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 glass-panel rounded-2xl p-4 shadow-xl border border-white/80 pointer-events-auto max-w-sm w-full mx-4 animate-in fade-in slide-in-from-top-4 duration-200">
      <div className="flex items-start justify-between gap-3 pb-2 border-b border-forest-900/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-forest-900/10 flex items-center justify-center text-forest-900">
            <Crosshair className="w-4 h-4 text-forest-800" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wider font-sans">
              Pixel Inspection Point
            </h4>
            <p className="text-[11px] text-gray-500 font-mono">
              {pixelInspection.lng.toFixed(5)}°, {pixelInspection.lat.toFixed(5)}°
            </p>
          </div>
        </div>
        <button
          onClick={() => setPixelInspection(null)}
          className="text-gray-400 hover:text-gray-700 p-1 rounded-lg hover:bg-black/5"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="pt-3 grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <span className="text-[11px] text-gray-500">{pixelInspection.index} Reading</span>
          <div
            className={`text-xl font-bold font-mono px-2.5 py-1 rounded-xl border inline-block ${getValueColor(
              pixelInspection.value
            )}`}
          >
            {pixelInspection.value >= 0 ? `+${pixelInspection.value.toFixed(3)}` : pixelInspection.value.toFixed(3)}
          </div>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] text-gray-500">Vegetation Class</span>
          <p className="text-xs font-semibold text-charcoal-900 leading-snug">
            {pixelInspection.classification}
          </p>
        </div>
      </div>

      <div className="mt-3 pt-2.5 border-t border-forest-900/10 flex items-center justify-between text-[11px] text-gray-500">
        <span className="flex items-center gap-1">
          <Satellite className="w-3 h-3 text-forest-700" />
          Sentinel-2 (10m res)
        </span>
        <span className="flex items-center gap-1">
          <Calendar className="w-3 h-3 text-forest-700" />
          {pixelInspection.date}
        </span>
      </div>
    </div>
  );
};
