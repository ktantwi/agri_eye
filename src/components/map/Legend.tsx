import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { Palette, Eye, HelpCircle } from 'lucide-react';

export const Legend: React.FC = () => {
  const { activeIndex, paletteType, setPaletteType } = useMapStore();

  const standardColors = [
    { color: '#8B4513', label: '< 0.1', desc: 'Water / Bare Soil' },
    { color: '#D2691E', label: '0.2', desc: 'Sparse / Stressed' },
    { color: '#FFD700', label: '0.4', desc: 'Early Emergence' },
    { color: '#ADFF2F', label: '0.6', desc: 'Moderate Vigor' },
    { color: '#32CD32', label: '0.75', desc: 'Healthy Canopy' },
    { color: '#006400', label: '> 0.85', desc: 'Dense Biomass' },
  ];

  const colorblindColors = [
    { color: '#440154', label: '< 0.1', desc: 'Deep Purple (Low)' },
    { color: '#414487', label: '0.2', desc: 'Blue-Violet' },
    { color: '#2a788e', label: '0.4', desc: 'Teal' },
    { color: '#22a884', label: '0.6', desc: 'Green-Cyan' },
    { color: '#7ad151', label: '0.75', desc: 'Lime' },
    { color: '#fde725', label: '> 0.85', desc: 'Vibrant Yellow (High)' },
  ];

  const activeColors = paletteType === 'colorblind' ? colorblindColors : standardColors;

  return (
    <div className="glass-panel rounded-2xl p-3 shadow-lg border border-white/60 pointer-events-auto max-w-xs transition-all">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-forest-900/10">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-xs text-forest-900 tracking-wide">
            {activeIndex} Index Scale
          </span>
          <span className="text-[10px] text-gray-500 font-mono">(-0.2 to +1.0)</span>
        </div>
        <button
          onClick={() => setPaletteType(paletteType === 'standard' ? 'colorblind' : 'standard')}
          className="text-[11px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-md bg-forest-900/5 hover:bg-forest-900/10 text-forest-900 transition-colors"
          title="Toggle Colorblind-safe Viridis palette"
        >
          <Palette className="w-3 h-3 text-forest-700" />
          <span>{paletteType === 'standard' ? 'Colorblind Safe' : 'Standard'}</span>
        </button>
      </div>

      {/* Gradient Colorbar */}
      <div className="h-3 w-full rounded-md shadow-inner flex overflow-hidden border border-black/10">
        {activeColors.map((item, idx) => (
          <div
            key={idx}
            className="flex-1 h-full"
            style={{ backgroundColor: item.color }}
            title={`${item.label} - ${item.desc}`}
          />
        ))}
      </div>

      {/* Range Labels */}
      <div className="flex justify-between items-center text-[10px] text-gray-600 font-mono pt-1.5">
        <span>-0.10 (Barren)</span>
        <span>0.40</span>
        <span>0.70</span>
        <span>+0.95 (Peak)</span>
      </div>
    </div>
  );
};
