import React from 'react';
import { useMapStore } from '../../store/mapStore';
import { Field } from '../../types/field';
import {
  Plus,
  Search,
  Filter,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Sprout,
  Tag,
  MapPin,
  Trash2
} from 'lucide-react';

interface LeftFieldsPanelProps {
  onStartNewField: () => void;
  onSelectField: (field: Field) => void;
  onDeleteField: (id: string, e: React.MouseEvent) => void;
}

export const LeftFieldsPanel: React.FC<LeftFieldsPanelProps> = ({
  onStartNewField,
  onSelectField,
  onDeleteField,
}) => {
  const {
    fields,
    selectedField,
    leftPanelOpen,
    toggleLeftPanel,
    searchQuery,
    setSearchQuery,
    cropFilter,
    setCropFilter,
  } = useMapStore();

  // Extract unique crop types
  const uniqueCrops = Array.from(new Set(fields.map((f) => f.crop_type || 'Other'))).filter(Boolean);

  // Filter fields by query and crop filter
  const filteredFields = fields.filter((f) => {
    const matchesQuery =
      !searchQuery ||
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (f.crop_type && f.crop_type.toLowerCase().includes(searchQuery.toLowerCase())) ||
      f.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCrop = !cropFilter || f.crop_type === cropFilter;
    return matchesQuery && matchesCrop;
  });

  const getTrendIcon = (trend?: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return <span title="NDVI increasing"><TrendingUp className="w-3.5 h-3.5 text-lime-600" /></span>;
    if (trend === 'down') return <span title="NDVI declining"><TrendingDown className="w-3.5 h-3.5 text-amber-600" /></span>;
    return <span title="NDVI stable"><Minus className="w-3.5 h-3.5 text-gray-400" /></span>;
  };

  return (
    <>
      {/* Toggle button when panel is closed */}
      {!leftPanelOpen && (
        <button
          onClick={toggleLeftPanel}
          className="fixed left-3 top-1/2 -translate-y-1/2 z-20 glass-panel p-2 rounded-xl shadow-lg border border-white/70 hover:bg-white text-forest-900 transition-all pointer-events-auto"
          title="Open My Fields"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}

      {/* Main Collapsible Panel */}
      <aside
        className={`fixed top-18 bottom-16 left-3 z-20 w-80 max-w-[calc(100vw-24px)] glass-panel rounded-3xl p-4 shadow-float border border-white/70 flex flex-col pointer-events-auto transition-all duration-300 ${
          leftPanelOpen ? 'translate-x-0 opacity-100' : '-translate-x-[110%] opacity-0 pointer-events-none'
        }`}
      >
        {/* Panel Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forest-900/10 shrink-0">
          <div className="flex items-center gap-2">
            <Sprout className="w-5 h-5 text-forest-800" />
            <h2 className="font-serif font-bold text-base text-forest-950">
              My Fields
            </h2>
            <span className="bg-forest-900/10 text-forest-900 font-mono text-xs font-semibold px-2 py-0.5 rounded-full">
              {fields.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onStartNewField}
              className="flex items-center gap-1 bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium px-3 py-1.5 rounded-xl transition-all shadow-sm"
              title="Add a new field boundary"
            >
              <Plus className="w-3.5 h-3.5 text-lime-400" />
              <span>New</span>
            </button>
            <button
              onClick={toggleLeftPanel}
              className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-black/5"
              title="Collapse Panel"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Search & Tag Filter Bar */}
        <div className="pt-3 pb-2 space-y-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search fields, crops, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-forest-900/5 text-xs text-charcoal-900 pl-8 pr-3 py-1.5 rounded-xl border border-forest-900/10 focus:outline-none focus:ring-1 focus:ring-forest-900/40"
            />
          </div>

          {/* Quick Crop Tag Filter Chips */}
          {uniqueCrops.length > 0 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px]">
              <button
                onClick={() => setCropFilter(null)}
                className={`px-2.5 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                  !cropFilter
                    ? 'bg-forest-900 text-white font-medium'
                    : 'bg-black/5 text-gray-600 hover:bg-black/10'
                }`}
              >
                All Crops
              </button>
              {uniqueCrops.map((crop) => (
                <button
                  key={crop}
                  onClick={() => setCropFilter(cropFilter === crop ? null : crop)}
                  className={`px-2 py-0.5 rounded-lg whitespace-nowrap transition-colors ${
                    cropFilter === crop
                      ? 'bg-forest-900 text-white font-medium'
                      : 'bg-black/5 text-gray-600 hover:bg-black/10'
                  }`}
                >
                  {crop}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Fields List */}
        <div className="flex-1 overflow-y-auto space-y-2 pr-1 pt-1">
          {filteredFields.length === 0 ? (
            <div className="text-center py-8 px-4 text-gray-500">
              <p className="text-xs">No matching fields found.</p>
              <button
                onClick={onStartNewField}
                className="mt-3 text-xs text-forest-900 font-semibold underline underline-offset-2"
              >
                Draw your first field now
              </button>
            </div>
          ) : (
            filteredFields.map((field) => {
              const isSelected = selectedField?.id === field.id;
              return (
                <div
                  key={field.id}
                  onClick={() => onSelectField(field)}
                  className={`group relative p-3 rounded-2xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-white/95 border-forest-900/60 shadow-md ring-1 ring-forest-900/30'
                      : 'bg-white/60 hover:bg-white/90 border-white/60 hover:border-forest-900/20 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <div
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: field.color || '#16a34a' }}
                        />
                        <h3 className="font-semibold text-xs text-forest-950 truncate">
                          {field.name}
                        </h3>
                      </div>
                      
                      <div className="flex items-center gap-2 text-[11px] text-gray-500">
                        <span>{field.crop_type || 'Crop unassigned'}</span>
                        <span>•</span>
                        <span className="font-mono">{field.area_ha} ha</span>
                      </div>
                    </div>

                    {/* Latest NDVI Badge & Trend */}
                    <div className="flex flex-col items-end shrink-0">
                      <div className="flex items-center gap-1 bg-lime-400/20 border border-lime-500/30 px-2 py-0.5 rounded-lg text-xs font-mono font-bold text-forest-900">
                        <span>{field.latest_ndvi !== undefined ? field.latest_ndvi.toFixed(2) : '0.84'}</span>
                        {getTrendIcon(field.ndvi_trend)}
                      </div>
                      <span className="text-[9px] text-gray-400 mt-0.5">
                        {field.latest_image_date ? field.latest_image_date.slice(5) : 'Sentinel-2'}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {field.tags && field.tags.length > 0 && (
                    <div className="flex items-center gap-1 mt-2 flex-wrap">
                      {field.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] text-gray-600 bg-forest-900/5 px-1.5 py-0.5 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Hover Quick Delete */}
                  <button
                    onClick={(e) => onDeleteField(field.id, e)}
                    className="absolute bottom-2 right-2 p-1 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete field"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>

        {/* Footer info tip */}
        <div className="pt-2 mt-2 border-t border-forest-900/10 text-[10px] text-gray-500 flex items-center justify-between shrink-0">
          <span>Click anywhere in field to probe NDVI</span>
          <span className="font-mono">10m resolution</span>
        </div>
      </aside>
    </>
  );
};
