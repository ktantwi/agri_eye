import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMapStore } from '../../store/mapStore';
import { INITIAL_DEMO_REPORTS } from '../../lib/supabase';
import { ReportItem } from '../../types/field';
import { generateFieldPdfReport } from '../../lib/pdfExport';
import {
  FileText,
  Download,
  Trash2,
  ArrowLeft,
  Filter,
  Plus,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  Image as ImageIcon,
  Layers
} from 'lucide-react';

export const ReportsPage: React.FC = () => {
  const { fields, selectedField } = useMapStore();
  const [reports, setReports] = useState<ReportItem[]>(INITIAL_DEMO_REPORTS);
  const [selectedFormat, setSelectedFormat] = useState<string>('ALL');

  const filteredReports = reports.filter((r) =>
    selectedFormat === 'ALL' ? true : r.format === selectedFormat
  );

  const handleDelete = (id: string) => {
    if (confirm('Delete this report record?')) {
      setReports(reports.filter((r) => r.id !== id));
    }
  };

  const handleGenerateNew = () => {
    const targetField = selectedField || fields[0];
    if (!targetField) return;

    generateFieldPdfReport({
      field: targetField,
      stats: {
        mean: 0.814,
        min: 0.42,
        max: 0.91,
        std_dev: 0.07,
        cloud_pct: 1.2,
        index: 'NDVI',
      },
      timeseries: [
        { date: '2026-06-10', mean_ndvi: 0.52, cloud_pct: 0.8 },
        { date: '2026-07-12', mean_ndvi: 0.84, cloud_pct: 0.5 },
        { date: '2026-07-28', mean_ndvi: 0.87, cloud_pct: 1.1 },
      ],
      dateStart: '2026-06-01',
      dateEnd: '2026-07-31',
    });

    const newReport: ReportItem = {
      id: `rep-${Date.now()}`,
      field_id: targetField.id,
      field_name: targetField.name,
      title: `${targetField.name} Phenology Report`,
      format: 'PDF',
      storage_path: `reports/${targetField.name.toLowerCase().replace(/\s+/g, '_')}.pdf`,
      file_size_bytes: 1540200,
      created_at: new Date().toISOString(),
    };
    setReports([newReport, ...reports]);
  };

  const formatSize = (bytes: number) => {
    if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${Math.round(bytes / 1024)} KB`;
  };

  const getFormatIcon = (fmt: string) => {
    if (fmt === 'PDF') return <FileText className="w-4 h-4 text-red-500" />;
    if (fmt === 'CSV') return <FileSpreadsheet className="w-4 h-4 text-emerald-600" />;
    if (fmt === 'GeoTIFF') return <Layers className="w-4 h-4 text-blue-600" />;
    return <ImageIcon className="w-4 h-4 text-purple-500" />;
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Top Navigation Bar */}
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 bg-white hover:bg-forest-900 hover:text-white px-3.5 py-2 rounded-xl border border-forest-900/10 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Field Map</span>
          </Link>

          <button
            onClick={handleGenerateNew}
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-lime-400" />
            <span>Generate New PDF Report</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <FileText className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-forest-950">
                Generated Reports & Spatial Exports
              </h1>
              <p className="text-xs text-gray-500">
                Download PDF agronomic reports, 10m GeoTIFF multi-band rasters, and seasonal CSV data.
              </p>
            </div>
          </div>

          {/* Format Filter Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-forest-900/10 text-xs">
            <span className="text-gray-500 font-semibold mr-1">Filter Format:</span>
            {['ALL', 'PDF', 'GeoTIFF', 'CSV', 'PNG'].map((fmt) => (
              <button
                key={fmt}
                onClick={() => setSelectedFormat(fmt)}
                className={`px-3 py-1 rounded-xl transition-all font-medium ${
                  selectedFormat === fmt
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'bg-white hover:bg-forest-900/5 text-charcoal-800 border border-gray-200'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>
        </div>

        {/* Reports Table Card */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-forest-900/10 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Report / Dataset</th>
                  <th className="pb-3">Field</th>
                  <th className="pb-3">Format</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Date Generated</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/5">
                {filteredReports.map((item) => (
                  <tr key={item.id} className="hover:bg-white/60 transition-colors">
                    <td className="py-3.5 pl-2 font-semibold text-charcoal-900">
                      <div className="flex items-center gap-2.5">
                        <div className="p-2 rounded-xl bg-forest-900/5">
                          {getFormatIcon(item.format)}
                        </div>
                        <span>{item.title}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-gray-600">{item.field_name}</td>
                    <td className="py-3.5">
                      <span className="px-2 py-0.5 rounded-md font-mono text-[10px] font-bold bg-forest-900/10 text-forest-900">
                        {item.format}
                      </span>
                    </td>
                    <td className="py-3.5 font-mono text-gray-500">
                      {formatSize(item.file_size_bytes)}
                    </td>
                    <td className="py-3.5 text-gray-500">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => alert(`Downloading ${item.title}...`)}
                          className="p-1.5 rounded-lg bg-forest-900/10 text-forest-900 hover:bg-forest-900 hover:text-white transition-all"
                          title="Download file"
                        >
                          <Download className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-all"
                          title="Delete report"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
