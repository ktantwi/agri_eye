import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMapStore } from '../../store/mapStore';
import { INITIAL_DEMO_ALERTS } from '../../lib/supabase';
import { Alert } from '../../types/field';
import {
  Bell,
  ArrowLeft,
  Plus,
  Trash2,
  Mail,
  AlertTriangle,
  CheckCircle2,
  Sliders,
  ShieldCheck
} from 'lucide-react';

export const AlertsPage: React.FC = () => {
  const { fields } = useMapStore();
  const [alerts, setAlerts] = useState<Alert[]>(INITIAL_DEMO_ALERTS);

  // Form states for adding new alert
  const [selectedFieldId, setSelectedFieldId] = useState(fields[0]?.id || '');
  const [threshold, setThreshold] = useState(0.45);
  const [emailNotify, setEmailNotify] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  const handleToggleActive = (id: string) => {
    setAlerts(
      alerts.map((a) => (a.id === id ? { ...a, active: !a.active } : a))
    );
  };

  const handleDelete = (id: string) => {
    setAlerts(alerts.filter((a) => a.id !== id));
  };

  const handleCreateAlert = (e: React.FormEvent) => {
    e.preventDefault();
    const fieldObj = fields.find((f) => f.id === selectedFieldId);
    const newAlert: Alert = {
      id: `alert-${Date.now()}`,
      field_id: selectedFieldId,
      field_name: fieldObj?.name || 'Selected Field',
      threshold,
      condition: 'below',
      active: true,
      email_notify: emailNotify,
      created_at: new Date().toISOString(),
    };
    setAlerts([newAlert, ...alerts]);
    setShowAddForm(false);
  };

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 bg-white hover:bg-forest-900 hover:text-white px-3.5 py-2 rounded-xl border border-forest-900/10 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Field Map</span>
          </Link>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm transition-all"
          >
            <Plus className="w-4 h-4 text-lime-400" />
            <span>Create Anomaly Alert</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Bell className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-forest-950">
                Vegetation Stress & NDVI Anomaly Alerts
              </h1>
              <p className="text-xs text-gray-500">
                Automated background Sentinel-2 orbital monitoring. Receive email alerts when crop vigor drops below your customized threshold.
              </p>
            </div>
          </div>
        </div>

        {/* Create Alert Modal/Inline Form */}
        {showAddForm && (
          <form
            onSubmit={handleCreateAlert}
            className="glass-panel rounded-3xl p-6 shadow-md border border-lime-500/50 space-y-4 animate-in fade-in"
          >
            <h3 className="font-serif font-bold text-base text-forest-950">
              New Crop Health Alert Rule
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Target Field</label>
                <select
                  value={selectedFieldId}
                  onChange={(e) => setSelectedFieldId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                >
                  {fields.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} ({f.area_ha} ha)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  NDVI Threshold Trigger (0.1 to 0.9)
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="0.1"
                    max="0.85"
                    step="0.05"
                    value={threshold}
                    onChange={(e) => setThreshold(parseFloat(e.target.value))}
                    className="w-full"
                  />
                  <span className="font-mono font-bold text-sm text-forest-900 bg-lime-400/20 px-2 py-0.5 rounded-lg">
                    {threshold.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 text-xs">
              <input
                type="checkbox"
                id="emailCheck"
                checked={emailNotify}
                onChange={(e) => setEmailNotify(e.target.checked)}
                className="w-4 h-4 text-forest-900 rounded"
              />
              <label htmlFor="emailCheck" className="text-gray-700">
                Send instant email notification to primary account email when triggered
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-forest-900/10">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-600 hover:bg-black/5"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-forest-900 hover:bg-forest-800 text-white shadow-sm"
              >
                Save Alert Rule
              </button>
            </div>
          </form>
        )}

        {/* Alerts List */}
        <div className="space-y-3">
          {alerts.map((item) => (
            <div
              key={item.id}
              className={`glass-panel rounded-2xl p-4 shadow-sm border transition-all flex items-center justify-between gap-4 ${
                item.active ? 'border-white/80 bg-white/70' : 'border-gray-200/50 bg-white/40 opacity-70'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    item.active
                      ? 'bg-lime-500/20 text-forest-900 border border-lime-500/30'
                      : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  <Bell className="w-4 h-4" />
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-forest-950">
                      {item.field_name}
                    </h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                        item.active
                          ? 'bg-forest-900 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {item.active ? 'Active Monitoring' : 'Paused'}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-2">
                    <span>
                      Trigger when Mean NDVI drops below{' '}
                      <strong className="font-mono text-forest-900">
                        {item.threshold.toFixed(2)}
                      </strong>
                    </span>
                    {item.email_notify && (
                      <span className="flex items-center gap-1 text-[11px] text-lime-700">
                        <Mail className="w-3 h-3" /> Email enabled
                      </span>
                    )}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => handleToggleActive(item.id)}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${
                    item.active
                      ? 'bg-white hover:bg-gray-50 text-gray-700 border-gray-200'
                      : 'bg-forest-900 text-white border-transparent'
                  }`}
                >
                  {item.active ? 'Pause' : 'Activate'}
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50"
                  title="Delete alert"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
