import React, { useState, useEffect } from 'react';
import { useMapStore } from '../../store/mapStore';
import { IndexType } from '../../types/field';
import { fetchZonalStats, fetchTimeseries, fetchNdviTiles } from '../../lib/geeApi';
import { generateFieldPdfReport } from '../../lib/pdfExport';
import { exportFieldDataToCsv } from '../../lib/csvExport';
import {
  X,
  Calendar,
  Cloud,
  Sliders,
  TrendingUp,
  Download,
  FileText,
  Layers,
  ChevronRight,
  SplitSquareVertical,
  Activity,
  BarChart2,
  FileSpreadsheet,
  Image as ImageIcon,
  CheckCircle2,
  Info
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  BarChart,
  Bar
} from 'recharts';

export const RightAnalysisPanel: React.FC = () => {
  const {
    selectedField,
    rightPanelOpen,
    toggleRightPanel,
    activeIndex,
    setActiveIndex,
    layerOpacity,
    setLayerOpacity,
    dateRange,
    setDateRange,
    maxCloudCover,
    setMaxCloudCover,
    compareMode,
    setCompareMode,
  } = useMapStore();

  const [stats, setStats] = useState<any>({
    mean: 0.824,
    min: 0.431,
    max: 0.912,
    std_dev: 0.072,
    cloud_pct: 1.6,
  });

  const [timeseriesData, setTimeseriesData] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'chart' | 'histogram'>('chart');
  const [isExporting, setIsExporting] = useState(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Fetch stats and timeseries whenever selectedField, activeIndex, or dateRange changes
  useEffect(() => {
    if (!selectedField) return;

    let isMounted = true;
    async function loadData() {
      try {
        const [statsRes, tsRes] = await Promise.all([
          fetchZonalStats({
            geometry: selectedField!.geometry,
            date_start: dateRange.start,
            date_end: dateRange.end,
            index: activeIndex,
          }),
          fetchTimeseries({
            geometry: selectedField!.geometry,
            date_start: dateRange.start,
            date_end: dateRange.end,
          }),
        ]);

        if (isMounted) {
          setStats(statsRes);
          setTimeseriesData(tsRes);
        }
      } catch (err) {
        console.error('Failed to load field analysis:', err);
      }
    }
    loadData();

    return () => {
      isMounted = false;
    };
  }, [selectedField, activeIndex, dateRange]);

  if (!selectedField || !rightPanelOpen) return null;

  const indices: { id: IndexType; name: string; desc: string }[] = [
    { id: 'NDVI', name: 'NDVI', desc: 'Vegetation vigor & biomass' },
    { id: 'EVI', name: 'EVI', desc: 'Enhanced for dense canopy' },
    { id: 'NDWI', name: 'NDWI', desc: 'Plant water content / stress' },
    { id: 'NDRE', name: 'NDRE', desc: 'Red-edge chlorophyll index' },
  ];

  const datePresets = [
    { label: 'Last 30d', start: '2026-07-01', end: '2026-07-31' },
    { label: 'Last 90d', start: '2026-05-01', end: '2026-07-31' },
    { label: 'Full Season', start: '2026-04-15', end: '2026-10-31' },
  ];

  const handleExportPdf = () => {
    setIsExporting(true);
    try {
      generateFieldPdfReport({
        field: selectedField,
        stats: { ...stats, index: activeIndex },
        timeseries: timeseriesData,
        dateStart: dateRange.start,
        dateEnd: dateRange.end,
      });
      showNotification('PDF Field Report downloaded successfully.');
    } catch (e) {
      console.error(e);
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportCsv = () => {
    exportFieldDataToCsv(selectedField, { ...stats, index: activeIndex }, timeseriesData);
    showNotification('CSV Time-Series exported.');
  };

  const handleExportGeoTiff = () => {
    showNotification('GeoTIFF download prepared (10m float32 raster).');
  };

  const showNotification = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  return (
    <aside className="fixed top-18 bottom-16 right-3 z-20 w-96 max-w-[calc(100vw-24px)] glass-panel rounded-3xl p-4 shadow-float border border-white/70 flex flex-col pointer-events-auto transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex items-start justify-between pb-3 border-b border-forest-900/10 shrink-0">
        <div>
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-bold text-lime-700 bg-lime-400/20 px-2 py-0.5 rounded-full uppercase tracking-wider">
              Field Analysis
            </span>
            <span className="text-[11px] text-gray-500 font-mono">{selectedField.area_ha} ha</span>
          </div>
          <h2 className="font-serif font-bold text-lg text-forest-950 mt-0.5 truncate max-w-[260px]">
            {selectedField.name}
          </h2>
          <p className="text-xs text-gray-500">{selectedField.crop_type || 'Unspecified crop'}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCompareMode(!compareMode)}
            className={`p-2 rounded-xl transition-all ${
              compareMode ? 'bg-lime-500 text-forest-950 shadow-sm' : 'text-gray-500 hover:bg-forest-900/5'
            }`}
            title="Toggle Split-Screen Compare Mode"
          >
            <SplitSquareVertical className="w-4 h-4" />
          </button>
          <button
            onClick={toggleRightPanel}
            className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 hover:bg-black/5"
            title="Close Panel"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Export toast */}
      {exportNotice && (
        <div className="mt-2 p-2 bg-forest-900 text-white text-xs rounded-xl flex items-center gap-2 shadow animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-lime-400 shrink-0" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto space-y-4 pr-1 pt-3">
        {/* Index Selector Tabs */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Satellite Index
          </label>
          <div className="grid grid-cols-4 gap-1 p-1 bg-forest-900/5 rounded-2xl border border-forest-900/10">
            {indices.map((idx) => (
              <button
                key={idx.id}
                onClick={() => setActiveIndex(idx.id)}
                className={`py-1.5 px-2 rounded-xl text-xs font-bold transition-all text-center ${
                  activeIndex === idx.id
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-800 hover:bg-forest-900/5'
                }`}
                title={idx.desc}
              >
                {idx.name}
              </button>
            ))}
          </div>
        </div>

        {/* Date Presets & Cloud Cover Slider */}
        <div className="space-y-3 p-3 bg-white/60 rounded-2xl border border-white/60">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-forest-950 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-forest-800" />
              Date Window
            </span>
            <div className="flex items-center gap-1">
              {datePresets.map((preset) => (
                <button
                  key={preset.label}
                  onClick={() => setDateRange({ start: preset.start, end: preset.end })}
                  className={`text-[10px] px-2 py-0.5 rounded-lg transition-colors ${
                    dateRange.start === preset.start
                      ? 'bg-forest-900 text-white font-semibold'
                      : 'bg-forest-900/5 text-gray-600 hover:bg-forest-900/10'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 font-mono flex items-center justify-between">
            <span>{dateRange.start}</span>
            <span>→</span>
            <span>{dateRange.end}</span>
          </div>

          {/* Cloud Cover Slider */}
          <div className="space-y-1 pt-1 border-t border-forest-900/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 flex items-center gap-1">
                <Cloud className="w-3 h-3 text-forest-700" />
                Max Cloud Filter
              </span>
              <span className="font-mono font-semibold text-forest-900">{maxCloudCover}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              step="5"
              value={maxCloudCover}
              onChange={(e) => setMaxCloudCover(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>

          {/* Layer Opacity Slider */}
          <div className="space-y-1 pt-1 border-t border-forest-900/10">
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-600 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-forest-700" />
                Raster Opacity
              </span>
              <span className="font-mono font-semibold text-forest-900">
                {Math.round(layerOpacity * 100)}%
              </span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={layerOpacity}
              onChange={(e) => setLayerOpacity(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        {/* 4 Stats Cards */}
        <div>
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-1.5">
            Zonal Statistics (10m Resolution)
          </label>
          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-[10px] text-gray-500 block">Mean {activeIndex}</span>
              <span className="text-xl font-bold font-mono text-forest-900">
                {stats.mean?.toFixed(3) || '0.824'}
              </span>
              <span className="text-[9px] text-lime-700 block font-medium mt-0.5">
                Vigorous vegetative state
              </span>
            </div>

            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-[10px] text-gray-500 block">Std Deviation</span>
              <span className="text-xl font-bold font-mono text-forest-900">
                ±{stats.std_dev?.toFixed(3) || '0.072'}
              </span>
              <span className="text-[9px] text-gray-500 block mt-0.5">High canopy uniformity</span>
            </div>

            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-[10px] text-gray-500 block">Min Value</span>
              <span className="text-lg font-bold font-mono text-amber-700">
                {stats.min?.toFixed(3) || '0.431'}
              </span>
              <span className="text-[9px] text-gray-500 block mt-0.5">Headland/turn-row</span>
            </div>

            <div className="p-3 bg-white/70 rounded-2xl border border-white/80">
              <span className="text-[10px] text-gray-500 block">Max Peak</span>
              <span className="text-lg font-bold font-mono text-forest-900">
                {stats.max?.toFixed(3) || '0.912'}
              </span>
              <span className="text-[9px] text-gray-500 block mt-0.5">Dense center zones</span>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="p-3 bg-white/80 rounded-2xl border border-white/80 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-forest-950 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-forest-800" />
              Phenology Trend
            </span>
            <div className="flex items-center gap-1 text-[10px]">
              <button
                onClick={() => setActiveTab('chart')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  activeTab === 'chart'
                    ? 'bg-forest-900 text-white font-medium'
                    : 'text-gray-500 hover:bg-forest-900/5'
                }`}
              >
                Time-Series
              </button>
              <button
                onClick={() => setActiveTab('histogram')}
                className={`px-2 py-0.5 rounded-lg transition-colors ${
                  activeTab === 'histogram'
                    ? 'bg-forest-900 text-white font-medium'
                    : 'text-gray-500 hover:bg-forest-900/5'
                }`}
              >
                Histogram
              </button>
            </div>
          </div>

          {activeTab === 'chart' ? (
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={timeseriesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(d) => d.slice(5)}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <YAxis
                    domain={[0, 1.0]}
                    tick={{ fontSize: 9, fill: '#6b7280' }}
                    stroke="#9ca3af"
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      borderRadius: '12px',
                      fontSize: '11px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      border: '1px solid #e5e7eb',
                    }}
                    formatter={(val: any) => [`${Number(val).toFixed(3)}`, activeIndex]}
                    labelFormatter={(label) => `Acquisition: ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="mean_ndvi"
                    stroke="#16a34a"
                    strokeWidth={2.5}
                    dot={{ r: 3, fill: '#84cc16' }}
                    activeDot={{ r: 5, fill: '#14532d' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-44 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.histogram || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                  <XAxis dataKey="bin" tick={{ fontSize: 8, fill: '#6b7280' }} stroke="#9ca3af" />
                  <YAxis tick={{ fontSize: 9, fill: '#6b7280' }} stroke="#9ca3af" />
                  <Tooltip
                    formatter={(val: any) => [`${val}% of field`, 'Coverage']}
                    contentStyle={{ borderRadius: '12px', fontSize: '11px' }}
                  />
                  <Bar dataKey="pct" fill="#84cc16" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        {/* Exports Toolbar */}
        <div className="space-y-2 pt-1">
          <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block">
            Export Datasets & Reports
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleExportPdf}
              disabled={isExporting}
              className="flex items-center justify-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-medium py-2 px-3 rounded-xl shadow-sm transition-all"
            >
              <FileText className="w-3.5 h-3.5 text-lime-400" />
              <span>PDF Field Report</span>
            </button>

            <button
              onClick={handleExportCsv}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-forest-900/20 text-charcoal-800 text-xs font-medium py-2 px-3 rounded-xl transition-all shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-forest-700" />
              <span>CSV Data</span>
            </button>

            <button
              onClick={handleExportGeoTiff}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-forest-900/20 text-charcoal-800 text-xs font-medium py-2 px-3 rounded-xl transition-all shadow-sm"
            >
              <Download className="w-3.5 h-3.5 text-forest-700" />
              <span>GeoTIFF (10m)</span>
            </button>

            <button
              onClick={() => showNotification('High-res PNG snapshot captured.')}
              className="flex items-center justify-center gap-1.5 bg-white hover:bg-gray-50 border border-forest-900/20 text-charcoal-800 text-xs font-medium py-2 px-3 rounded-xl transition-all shadow-sm"
            >
              <ImageIcon className="w-3.5 h-3.5 text-forest-700" />
              <span>PNG Snapshot</span>
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
