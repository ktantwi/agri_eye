import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useMapStore } from '../../store/mapStore';
import { UserPlan } from '../../types/field';
import {
  Settings,
  ArrowLeft,
  User,
  CreditCard,
  Key,
  Shield,
  Activity,
  Trash2,
  Check,
  Copy,
  Zap,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user, updateProfile, setPlan } = useAuthStore();
  const { fields } = useMapStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'billing' | 'usage' | 'api' | 'security'>('profile');
  const [fullName, setFullName] = useState(user?.full_name || 'Dr. Sarah Jenkins');
  const [company, setCompany] = useState(user?.company || 'Midwest Agronomic Services');
  const [copiedKey, setCopiedKey] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const totalHectares = fields.reduce((sum, f) => sum + f.area_ha, 0);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({ full_name: fullName, company });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleCopyApiKey = () => {
    navigator.clipboard.writeText('agrieye_live_sk_948f20b830114b7291fa0');
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2500);
  };

  const planTiers: { id: UserPlan; name: string; priceMonthly: number; areaLimitHa: number; features: string[] }[] = [
    {
      id: 'free',
      name: 'Free Starter',
      priceMonthly: 0,
      areaLimitHa: 250,
      features: ['Up to 250 ha monitoring', '10m Sentinel-2 NDVI', '30-day history', 'Basic PDF export'],
    },
    {
      id: 'pro',
      name: 'Pro Agronomist',
      priceMonthly: 49,
      areaLimitHa: 2500,
      features: ['Up to 2,500 ha monitoring', 'NDVI, EVI, NDWI, NDRE', 'Full multi-year time-series', 'GeoTIFF & Shapefile export', 'Automated anomaly alerts'],
    },
    {
      id: 'business',
      name: 'Business Enterprise',
      priceMonthly: 199,
      areaLimitHa: 25000,
      features: ['Up to 25,000 ha monitoring', 'Unlimited team seats', 'REST API & Webhooks', 'Dedicated GEE processing quota', 'Custom SLA & Phone support'],
    },
  ];

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
        </div>

        {/* Page Header */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-2">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Settings className="w-5 h-5 text-lime-400" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-2xl text-forest-950">
                Account & Platform Settings
              </h1>
              <p className="text-xs text-gray-500">
                Manage your farm profile, subscription tier, usage quota, and API developer keys.
              </p>
            </div>
          </div>

          {/* Setting Tabs */}
          <div className="flex items-center gap-2 pt-4 border-t border-forest-900/10 text-xs overflow-x-auto">
            {[
              { id: 'profile', label: 'Profile', icon: <User className="w-3.5 h-3.5" /> },
              { id: 'billing', label: 'Subscription & Billing', icon: <CreditCard className="w-3.5 h-3.5" /> },
              { id: 'usage', label: 'GEE Quota & Usage', icon: <Activity className="w-3.5 h-3.5" /> },
              { id: 'api', label: 'API Keys', icon: <Key className="w-3.5 h-3.5" /> },
              { id: 'security', label: 'Security & Delete', icon: <Shield className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl transition-all font-medium whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'bg-white hover:bg-forest-900/5 text-charcoal-800 border border-gray-200'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab 1: Profile */}
        {activeTab === 'profile' && (
          <form
            onSubmit={handleSaveProfile}
            className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-4"
          >
            <h3 className="font-serif font-bold text-base text-forest-950">Personal & Farm Profile</h3>

            {savedSuccess && (
              <div className="p-3 bg-lime-500/20 border border-lime-500/40 rounded-xl text-xs text-forest-900 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-forest-800" />
                <span>Profile details saved successfully.</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Company / Farm Name</label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/40"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || 'agronomist@agrieye.io'}
                  className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Current Active Plan</label>
                <div className="px-3 py-2 rounded-xl border border-gray-200 bg-gray-50 text-forest-900 font-bold uppercase font-mono">
                  {user?.plan || 'pro'}
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-4 py-2 rounded-xl shadow-sm"
              >
                Save Changes
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Billing & Plans */}
        {activeTab === 'billing' && (
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-6">
            <div>
              <h3 className="font-serif font-bold text-base text-forest-950">Subscription & Field Capacity</h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Current usage: <strong className="text-forest-900 font-mono">{totalHectares.toFixed(1)} ha</strong> mapped across {fields.length} active plots.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {planTiers.map((tier) => {
                const isCurrent = (user?.plan || 'pro') === tier.id;
                return (
                  <div
                    key={tier.id}
                    className={`rounded-2xl p-5 border flex flex-col justify-between transition-all ${
                      isCurrent
                        ? 'border-forest-900 bg-forest-900/5 ring-2 ring-forest-900/20 shadow-md'
                        : 'border-gray-200 bg-white/70'
                    }`}
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-serif font-bold text-base text-forest-950">
                          {tier.name}
                        </span>
                        {isCurrent && (
                          <span className="text-[10px] font-bold bg-forest-900 text-white px-2 py-0.5 rounded-full uppercase">
                            Active
                          </span>
                        )}
                      </div>

                      <div className="text-2xl font-bold font-serif text-forest-950">
                        ${tier.priceMonthly}
                        <span className="text-xs font-sans font-normal text-gray-500">/month</span>
                      </div>

                      <div className="text-xs font-medium text-forest-800 bg-lime-400/20 px-2 py-1 rounded-lg">
                        Capacity: {tier.areaLimitHa.toLocaleString()} ha
                      </div>

                      <ul className="space-y-2 pt-2 text-xs text-charcoal-800">
                        {tier.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <Check className="w-3.5 h-3.5 text-lime-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <button
                      onClick={() => setPlan(tier.id)}
                      disabled={isCurrent}
                      className={`mt-5 w-full text-xs font-semibold py-2 px-3 rounded-xl transition-all ${
                        isCurrent
                          ? 'bg-gray-200 text-gray-500 cursor-default'
                          : 'bg-forest-900 hover:bg-forest-800 text-white shadow-sm'
                      }`}
                    >
                      {isCurrent ? 'Current Plan' : 'Switch to this Plan'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Tab 3: Usage Quota */}
        {activeTab === 'usage' && (
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="font-serif font-bold text-base text-forest-950">Google Earth Engine Resource Quota</h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-4 bg-white/70 rounded-2xl border border-white/80">
                <span className="text-gray-500 block">Monthly GEE Tile Hits</span>
                <span className="text-2xl font-bold font-mono text-forest-900 mt-1 block">1,420</span>
                <span className="text-gray-400 text-[10px]">Quota: 50,000 / month</span>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-white/80">
                <span className="text-gray-500 block">Mapped Area</span>
                <span className="text-2xl font-bold font-mono text-forest-900 mt-1 block">
                  {totalHectares.toFixed(1)} ha
                </span>
                <span className="text-gray-400 text-[10px]">Plan Limit: 2,500 ha</span>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-white/80">
                <span className="text-gray-500 block">Avg Cloud Processing Time</span>
                <span className="text-2xl font-bold font-mono text-forest-900 mt-1 block">340 ms</span>
                <span className="text-lime-700 text-[10px] font-medium">99.98% Service Uptime</span>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: API Keys */}
        {activeTab === 'api' && (
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="font-serif font-bold text-base text-forest-950">Developer API Keys</h3>
            <p className="text-xs text-gray-500">
              Integrate AgriEye satellite NDVI XYZ tiles, zonal statistics, and time-series directly into your farm management system (FMS) or drone mapping software.
            </p>

            <div className="p-4 bg-forest-900/5 rounded-2xl border border-forest-900/10 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-forest-950">Production Secret API Key</span>
                <span className="text-[10px] text-gray-500 font-mono">Created Oct 2026</span>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="password"
                  readOnly
                  value="agrieye_live_sk_948f20b830114b7291fa0"
                  className="w-full px-3 py-2 rounded-xl bg-white border border-gray-200 font-mono text-xs text-charcoal-900"
                />
                <button
                  onClick={handleCopyApiKey}
                  className="flex items-center gap-1.5 px-3 py-2 bg-forest-900 text-white rounded-xl text-xs font-semibold shrink-0"
                >
                  {copiedKey ? <Check className="w-4 h-4 text-lime-400" /> : <Copy className="w-4 h-4" />}
                  <span>{copiedKey ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 5: Security */}
        {activeTab === 'security' && (
          <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-4">
            <h3 className="font-serif font-bold text-base text-red-950">Danger Zone</h3>
            <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-start justify-between gap-4">
              <div>
                <h4 className="text-xs font-bold text-red-900">Delete Account & Field Data</h4>
                <p className="text-xs text-red-700 mt-1">
                  Permanently erase your farm boundaries, historical NDVI records, and user profile. This action cannot be undone.
                </p>
              </div>
              <button
                onClick={() => alert('Account deletion confirmation modal')}
                className="px-3.5 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold rounded-xl shrink-0"
              >
                Delete Account
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
