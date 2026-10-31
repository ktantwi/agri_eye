import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  ShieldAlert,
  Users,
  Activity,
  Server,
  Mail,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Layers,
  Search
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'users' | 'quota' | 'messages'>('users');

  const demoUsers = [
    { id: '1', name: 'Sarah Jenkins', email: 'agronomist@agrieye.io', plan: 'pro', fields: 3, areaHa: 78.2, role: 'admin' },
    { id: '2', name: 'Marcus Sterling', email: 'm.sterling@valleysprout.com', plan: 'business', fields: 14, areaHa: 1240.5, role: 'user' },
    { id: '3', name: 'Elena Rostova', email: 'elena@grapevine-estates.fr', plan: 'pro', fields: 6, areaHa: 142.0, role: 'user' },
    { id: '4', name: 'Liam Davies', email: 'liam@midlands-cereal.co.uk', plan: 'free', fields: 2, areaHa: 34.0, role: 'user' },
  ];

  const demoMessages = [
    { id: '1', name: 'Tom Bradley', email: 'tom@bradleyfarms.org', subject: 'Enterprise API Access Question', message: 'Hi AgriEye team, we manage 15,000 hectares of winter wheat and would like to sync daily NDVI tiles into our tractor telematics system. What is your API rate limit?', date: '2026-10-30', status: 'unread' },
    { id: '2', name: 'Maria Gonzalez', email: 'mgonzalez@andes-agri.cl', subject: 'South America Satellite Revisit Frequency', message: 'Do you offer Sentinel-2 composite downloads in southern Chile during peak blueberry harvest season?', date: '2026-10-28', status: 'replied' },
  ];

  return (
    <div className="min-h-screen bg-sand-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 bg-white hover:bg-forest-900 hover:text-white px-3.5 py-2 rounded-xl border border-forest-900/10 shadow-sm transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Field Map</span>
          </Link>
          <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-3 py-1 rounded-full uppercase flex items-center gap-1.5">
            <ShieldAlert className="w-4 h-4 text-amber-700" />
            Admin Operations Console
          </span>
        </div>

        {/* Overview Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="glass-panel p-5 rounded-3xl border border-white/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Total Platform Users</span>
              <Users className="w-4 h-4 text-forest-700" />
            </div>
            <div className="text-2xl font-bold font-serif text-forest-950">1,248</div>
            <span className="text-[10px] text-lime-700 font-medium">+18% this month</span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Active Fields Monitored</span>
              <Layers className="w-4 h-4 text-forest-700" />
            </div>
            <div className="text-2xl font-bold font-serif text-forest-950">8,920</div>
            <span className="text-[10px] text-gray-500">Across 22 countries</span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Monthly GEE Quota</span>
              <Server className="w-4 h-4 text-forest-700" />
            </div>
            <div className="text-2xl font-bold font-serif text-forest-950">34.2%</div>
            <span className="text-[10px] text-lime-700 font-medium">Healthy headroom</span>
          </div>

          <div className="glass-panel p-5 rounded-3xl border border-white/80 space-y-1">
            <div className="flex justify-between items-center text-xs text-gray-500">
              <span>Support Inquiries</span>
              <Mail className="w-4 h-4 text-forest-700" />
            </div>
            <div className="text-2xl font-bold font-serif text-forest-950">1 Unread</div>
            <span className="text-[10px] text-amber-700 font-medium">Avg response &lt; 2h</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="glass-panel rounded-3xl p-6 shadow-sm border border-white/80 space-y-4">
          <div className="flex items-center gap-2 border-b border-forest-900/10 pb-3 text-xs">
            {[
              { id: 'users', label: 'Registered Users', icon: <Users className="w-3.5 h-3.5" /> },
              { id: 'quota', label: 'Earth Engine Health & Latency', icon: <Server className="w-3.5 h-3.5" /> },
              { id: 'messages', label: 'Support Messages', icon: <Mail className="w-3.5 h-3.5" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl font-medium transition-all ${
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

          {activeTab === 'users' && (
            <div className="overflow-x-auto text-xs">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-forest-900/10 text-gray-500 font-bold uppercase">
                    <th className="pb-3 pl-2">Name</th>
                    <th className="pb-3">Email</th>
                    <th className="pb-3">Plan</th>
                    <th className="pb-3">Plots</th>
                    <th className="pb-3">Hectares</th>
                    <th className="pb-3">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-forest-900/5">
                  {demoUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/60">
                      <td className="py-3 pl-2 font-semibold text-charcoal-900">{u.name}</td>
                      <td className="py-3 text-gray-600">{u.email}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-forest-900/10 text-forest-900 font-mono">
                          {u.plan}
                        </span>
                      </td>
                      <td className="py-3 font-mono">{u.fields}</td>
                      <td className="py-3 font-mono">{u.areaHa} ha</td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-700'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'quota' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 bg-white/70 rounded-2xl border border-white/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>Sentinel-2 L2A Harmonized Collection Calls</span>
                  <span className="font-mono">14,200 / 100,000 / day</span>
                </div>
                <div className="w-full bg-gray-200 h-2.5 rounded-full overflow-hidden">
                  <div className="bg-lime-500 h-full rounded-full" style={{ width: '14.2%' }} />
                </div>
              </div>

              <div className="p-4 bg-white/70 rounded-2xl border border-white/80 space-y-2">
                <div className="flex justify-between font-semibold">
                  <span>FastAPI Cloud Run Latency</span>
                  <span className="font-mono text-lime-700">p95 = 480ms</span>
                </div>
                <p className="text-gray-500 text-[11px]">
                  All endpoints healthy. Redis caching active on Sentinel-2 median tile composites.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="space-y-3 text-xs">
              {demoMessages.map((msg) => (
                <div
                  key={msg.id}
                  className="p-4 rounded-2xl bg-white/70 border border-white/80 space-y-2"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-forest-950 text-sm">{msg.subject}</h4>
                      <p className="text-gray-500 text-[11px]">
                        From: {msg.name} ({msg.email}) • {msg.date}
                      </p>
                    </div>
                    <span
                      className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[9px] ${
                        msg.status === 'unread'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-forest-900/10 text-forest-900'
                      }`}
                    >
                      {msg.status}
                    </span>
                  </div>
                  <p className="text-charcoal-800 leading-relaxed bg-forest-900/5 p-3 rounded-xl">
                    {msg.message}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
