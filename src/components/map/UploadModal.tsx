import React, { useState } from 'react';
import { useMapStore } from '../../store/mapStore';
import { parseBoundaryFile } from '../../lib/geoUtils';
import { Field, GeoJSONPolygon } from '../../types/field';
import {
  Upload,
  FileCode,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  FolderArchive
} from 'lucide-react';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose }) => {
  const { addField } = useMapStore();

  const [file, setFile] = useState<File | null>(null);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [parsedData, setParsedData] = useState<{
    name: string;
    geometry: GeoJSONPolygon;
    area_ha: number;
  } | null>(null);

  const [fieldName, setFieldName] = useState('');
  const [cropType, setCropType] = useState('Corn');
  const [tags, setTags] = useState('Imported, GPS Survey');

  if (!isOpen) return null;

  const handleFileChange = async (selectedFile: File) => {
    setFile(selectedFile);
    setError(null);
    setIsParsing(true);

    try {
      const result = await parseBoundaryFile(selectedFile);
      setParsedData(result);
      setFieldName(result.name || selectedFile.name.replace(/\.[^/.]+$/, ''));
    } catch (err: any) {
      console.error('File parsing failed:', err);
      setError(err.message || 'Failed to parse boundary file. Please ensure it is a valid polygon.');
      setParsedData(null);
    } finally {
      setIsParsing(false);
    }
  };

  const handleSave = () => {
    if (!parsedData) return;

    const newField: Field = {
      id: `field-${Date.now()}`,
      user_id: 'user-id',
      name: fieldName.trim() || 'Uploaded Field',
      geometry: parsedData.geometry,
      area_ha: parsedData.area_ha,
      crop_type: cropType.trim() || 'Other',
      tags: tags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      color: '#16a34a',
      created_at: new Date().toISOString(),
      latest_ndvi: 0.78,
      ndvi_trend: 'stable',
      latest_image_date: '2026-07-28',
    };

    addField(newField);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-white/80 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-forest-900/10">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-forest-800" />
            <h3 className="font-serif font-bold text-lg text-forest-950">
              Import Field Boundary
            </h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Drop Zone */}
        {!parsedData ? (
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) handleFileChange(e.dataTransfer.files[0]);
            }}
            className="border-2 border-dashed border-forest-900/30 hover:border-forest-900/60 rounded-2xl p-8 text-center space-y-3 bg-forest-900/5 transition-all cursor-pointer"
            onClick={() => document.getElementById('boundaryFileInput')?.click()}
          >
            <div className="w-12 h-12 rounded-2xl bg-forest-900/10 text-forest-900 flex items-center justify-center mx-auto">
              <FolderArchive className="w-6 h-6 text-forest-800" />
            </div>

            <div>
              <p className="text-sm font-semibold text-charcoal-900">
                Click or drag & drop boundary file
              </p>
              <p className="text-xs text-gray-500 mt-1">
                Supports GeoJSON (.geojson, .json), KML (.kml), and Zipped Shapefile (.zip)
              </p>
            </div>

            <input
              id="boundaryFileInput"
              type="file"
              accept=".geojson,.json,.kml,.zip"
              className="hidden"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileChange(e.target.files[0]);
              }}
            />

            {isParsing && (
              <div className="flex items-center justify-center gap-2 text-xs text-forest-800 pt-2 font-medium">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Validating coordinates & computing area...</span>
              </div>
            )}
          </div>
        ) : (
          /* Success parsed preview */
          <div className="space-y-4">
            <div className="p-4 bg-lime-500/15 border border-lime-500/30 rounded-2xl flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-forest-800 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-bold text-forest-950">Valid Boundary Detected</p>
                <p className="text-xs text-forest-800 mt-0.5">
                  Computed Area: <span className="font-mono font-bold">{parsedData.area_ha} ha</span> ({Math.round(parsedData.area_ha * 2.471)} acres)
                </p>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Field Name</label>
                <input
                  type="text"
                  value={fieldName}
                  onChange={(e) => setFieldName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/40 text-charcoal-900"
                  placeholder="e.g. North 40 Pivot"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Crop Type</label>
                <input
                  type="text"
                  value={cropType}
                  onChange={(e) => setCropType(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/40 text-charcoal-900"
                  placeholder="e.g. Corn, Soybeans, Wheat, Almonds"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Tags (comma-separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-forest-900/40 text-charcoal-900"
                  placeholder="e.g. Irrigated, Seed Plot, Section 12"
                />
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Buttons */}
        <div className="flex items-center justify-end gap-2 pt-2 border-t border-forest-900/10">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-black/5"
          >
            Cancel
          </button>
          {parsedData && (
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest-900 hover:bg-forest-800 text-white shadow-sm"
            >
              Save Field to Map
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
