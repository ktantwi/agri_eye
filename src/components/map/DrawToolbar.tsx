import React, { useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { DrawTool } from '../../types/field';
import {
  Pentagon,
  Square,
  Circle,
  Move,
  Trash2,
  Ruler,
  Upload,
  Magnet,
  Check,
  X,
  HelpCircle
} from 'lucide-react';

interface DrawToolbarProps {
  onStartDraw: (tool: DrawTool) => void;
  onCancelDraw: () => void;
  onFinishDraw: () => void;
  onDeleteSelected: () => void;
  onOpenUploadModal: () => void;
}

export const DrawToolbar: React.FC<DrawToolbarProps> = ({
  onStartDraw,
  onCancelDraw,
  onFinishDraw,
  onDeleteSelected,
  onOpenUploadModal,
}) => {
  const {
    drawTool,
    setDrawTool,
    isDrawing,
    currentDrawAreaHa,
    snapToBoundaries,
    setSnapToBoundaries,
    selectedField,
  } = useMapStore();

  // Keyboard shortcuts (D = draw, Esc = cancel, Del = delete)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'd' || e.key === 'D') {
        onStartDraw('polygon');
      } else if (e.key === 'Escape') {
        onCancelDraw();
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedField && !isDrawing) {
          onDeleteSelected();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedField, isDrawing, onStartDraw, onCancelDraw, onDeleteSelected]);

  return (
    <div className="fixed top-18 left-3 z-20 flex flex-col items-start gap-2 pointer-events-none">
      {/* Live Area Readout Pill while drawing */}
      {isDrawing && (
        <div className="glass-panel rounded-2xl px-4 py-2 border border-lime-500/80 shadow-float flex items-center gap-2.5 pointer-events-auto animate-pulse">
          <div className="w-2.5 h-2.5 rounded-full bg-lime-500 animate-ping" />
          <span className="text-xs font-medium text-forest-950">
            Drawing Boundary:
          </span>
          <span className="font-mono font-bold text-sm text-forest-900 bg-lime-400/30 px-2 py-0.5 rounded-md">
            {currentDrawAreaHa > 0 ? `${currentDrawAreaHa.toFixed(2)} ha` : 'Click to add points'}
          </span>
          <div className="flex items-center gap-1.5 ml-2 border-l border-forest-900/10 pl-2">
            <button
              onClick={onFinishDraw}
              className="p-1 rounded-lg bg-forest-900 text-white hover:bg-forest-800 transition-colors"
              title="Finish Field (double click or click here)"
            >
              <Check className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onCancelDraw}
              className="p-1 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition-colors"
              title="Cancel (Esc)"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Main Drawing Tools Floating Bar */}
      <div className="glass-panel rounded-2xl p-1.5 shadow-lg border border-white/70 flex flex-col gap-1 pointer-events-auto">
        {/* Polygon */}
        <button
          onClick={() => onStartDraw('polygon')}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            drawTool === 'polygon' && isDrawing
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-charcoal-800 hover:bg-forest-900/10'
          }`}
          title="Draw Polygon (Key: D)"
        >
          <Pentagon className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Polygon (D)
          </span>
        </button>

        {/* Rectangle */}
        <button
          onClick={() => onStartDraw('rectangle')}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            drawTool === 'rectangle' && isDrawing
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-charcoal-800 hover:bg-forest-900/10'
          }`}
          title="Draw Rectangle"
        >
          <Square className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Rectangle
          </span>
        </button>

        {/* Circle / Pivot */}
        <button
          onClick={() => onStartDraw('circle')}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            drawTool === 'circle' && isDrawing
              ? 'bg-forest-900 text-white shadow-sm'
              : 'text-charcoal-800 hover:bg-forest-900/10'
          }`}
          title="Draw Center-Pivot Circle"
        >
          <Circle className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Center-Pivot Circle
          </span>
        </button>

        {/* Edit Vertices */}
        <button
          onClick={() => onStartDraw('edit')}
          disabled={!selectedField}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            drawTool === 'edit'
              ? 'bg-forest-900 text-white'
              : 'text-charcoal-800 hover:bg-forest-900/10 disabled:opacity-30 disabled:hover:bg-transparent'
          }`}
          title="Edit Boundary Vertices"
        >
          <Move className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Edit Vertices
          </span>
        </button>

        {/* Measure Distance */}
        <button
          onClick={() => onStartDraw('measure')}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            drawTool === 'measure'
              ? 'bg-forest-900 text-white'
              : 'text-charcoal-800 hover:bg-forest-900/10'
          }`}
          title="Measure Distance & Area"
        >
          <Ruler className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Measure Tool
          </span>
        </button>

        <div className="border-t border-forest-900/10 my-0.5" />

        {/* Upload File (GeoJSON / KML / Shapefile) */}
        <button
          onClick={onOpenUploadModal}
          className="p-2.5 rounded-xl text-charcoal-800 hover:bg-forest-900/10 transition-all flex items-center justify-center relative group"
          title="Upload Boundary (GeoJSON / KML / Shapefile)"
        >
          <Upload className="w-4 h-4 text-forest-800" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Import GeoJSON / KML / Zip
          </span>
        </button>

        {/* Snap to Boundaries Toggle */}
        <button
          onClick={() => setSnapToBoundaries(!snapToBoundaries)}
          className={`p-2.5 rounded-xl transition-all flex items-center justify-center relative group ${
            snapToBoundaries ? 'text-lime-700 bg-lime-100' : 'text-gray-400 hover:bg-forest-900/5'
          }`}
          title={`Snapping: ${snapToBoundaries ? 'ON' : 'OFF'}`}
        >
          <Magnet className="w-4 h-4" />
          <span className="absolute left-full ml-2 px-2 py-1 bg-forest-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
            Boundary Snapping ({snapToBoundaries ? 'Active' : 'Off'})
          </span>
        </button>

        {/* Delete Active Field */}
        {selectedField && (
          <button
            onClick={onDeleteSelected}
            className="p-2.5 rounded-xl text-red-600 hover:bg-red-50 transition-all flex items-center justify-center relative group"
            title="Delete Selected Field (Del)"
          >
            <Trash2 className="w-4 h-4" />
            <span className="absolute left-full ml-2 px-2 py-1 bg-red-950 text-white text-[11px] rounded-lg shadow whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-40">
              Delete Field (Del)
            </span>
          </button>
        )}
      </div>
    </div>
  );
};
