import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AgriEyeLogo } from '../common/AgriEyeLogo';
import { useMapStore } from '../../store/mapStore';
import { useAuthStore } from '../../store/authStore';
import { BasemapType } from '../../types/field';
import {
  Search,
  Layers,
  MapPin,
  User,
  Settings,
  FileText,
  Bell,
  LogOut,
  ChevronDown,
  Sparkles,
  HelpCircle,
  ShieldAlert,
  Loader2,
  X
} from 'lucide-react';

interface GeocodeResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

export const FloatingTopBar: React.FC<{ onFlyToCoordinates?: (lng: number, lat: number) => void }> = ({
  onFlyToCoordinates,
}) => {
  const navigate = useNavigate();
  const { activeBasemap, setActiveBasemap } = useMapStore();
  const { user, logout } = useAuthStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodeResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [basemapMenuOpen, setBasemapMenuOpen] = useState(false);

  const searchRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Search geocoding with debounce (Nominatim OSM)
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=5&addressdetails=1`
        );
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data);
          setSearchOpen(true);
        }
      } catch (err) {
        console.error('Geocoding error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 450);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectLocation = (result: GeocodeResult) => {
    const lng = parseFloat(result.lon);
    const lat = parseFloat(result.lat);
    if (onFlyToCoordinates) {
      onFlyToCoordinates(lng, lat);
    }
    setSearchQuery(result.display_name.split(',')[0]);
    setSearchOpen(false);
  };

  const basemapOptions: { id: BasemapType; label: string; iconLabel: string }[] = [
    { id: 'satellite', label: 'Esri Satellite', iconLabel: '🛰️' },
    { id: 'streets', label: 'Streets (OSM)', iconLabel: '🗺️' },
    { id: 'terrain', label: 'Topo / Terrain', iconLabel: '⛰️' },
  ];

  return (
    <header className="fixed top-3 left-3 right-3 z-30 flex items-center justify-between gap-3 pointer-events-none">
      {/* Left: Brand Pill */}
      <div className="glass-panel rounded-2xl px-3.5 py-2 flex items-center gap-2 shadow-lg border border-white/70 pointer-events-auto">
        <AgriEyeLogo size="sm" showTagline={false} linkTo="/" />
      </div>

      {/* Middle: Place Search Bar (Nominatim) */}
      <div ref={searchRef} className="relative flex-1 max-w-md pointer-events-auto">
        <div className="glass-panel rounded-2xl flex items-center px-3.5 py-2 shadow-lg border border-white/70 focus-within:ring-2 focus-within:ring-forest-900/40 transition-all">
          <Search className="w-4 h-4 text-forest-800 shrink-0 mr-2.5" />
          <input
            type="text"
            placeholder="Search farm, city, county, or coords (lat, lng)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => searchResults.length > 0 && setSearchOpen(true)}
            className="w-full bg-transparent text-xs text-charcoal-900 placeholder:text-gray-400 focus:outline-none"
          />
          {isSearching && <Loader2 className="w-3.5 h-3.5 animate-spin text-forest-700 shrink-0" />}
          {searchQuery && !isSearching && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSearchResults([]);
              }}
              className="text-gray-400 hover:text-gray-700 ml-1"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Dropdown Results */}
        {searchOpen && searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1.5 glass-panel rounded-xl shadow-xl border border-white/80 py-1.5 overflow-hidden z-50 animate-in fade-in duration-150">
            {searchResults.map((res) => (
              <button
                key={res.place_id}
                onClick={() => handleSelectLocation(res)}
                className="w-full px-3.5 py-2 text-left hover:bg-forest-900/5 flex items-start gap-2.5 transition-colors text-xs text-charcoal-800"
              >
                <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0 mt-0.5" />
                <span className="line-clamp-1">{res.display_name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Basemap Switcher & User Menu */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {/* Basemap Switcher Pill */}
        <div className="relative">
          <div className="glass-panel rounded-2xl p-1 shadow-lg border border-white/70 flex items-center gap-1">
            {basemapOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveBasemap(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                  activeBasemap === opt.id
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-800 hover:bg-forest-900/5'
                }`}
                title={`Switch to ${opt.label}`}
              >
                <span>{opt.iconLabel}</span>
                <span className="hidden sm:inline">{opt.label.split(' ')[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* User Menu */}
        <div ref={userMenuRef} className="relative">
          <button
            onClick={() => setUserMenuOpen(!userMenuOpen)}
            className="glass-panel rounded-2xl px-3 py-2 shadow-lg border border-white/70 flex items-center gap-2 hover:bg-white/90 transition-all text-xs font-medium text-forest-950"
          >
            <div className="w-6 h-6 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-[11px]">
              {user?.full_name ? user.full_name[0].toUpperCase() : 'U'}
            </div>
            <span className="hidden md:inline font-semibold max-w-[100px] truncate">
              {user?.full_name || 'Account'}
            </span>
            <span className="bg-lime-500/20 text-forest-900 border border-lime-500/40 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
              {user?.plan || 'pro'}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-gray-500" />
          </button>

          {/* User Menu Dropdown */}
          {userMenuOpen && (
            <div className="absolute right-0 top-full mt-2 w-56 glass-panel rounded-2xl shadow-2xl border border-white/80 p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 border-b border-forest-900/10 mb-1">
                <p className="text-xs font-bold text-forest-950 truncate">{user?.full_name}</p>
                <p className="text-[11px] text-gray-500 truncate">{user?.email}</p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="bg-forest-900 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
                    Plan: {user?.plan || 'Free'}
                  </span>
                  {user?.role === 'admin' && (
                    <span className="bg-amber-600 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full uppercase">
                      Admin
                    </span>
                  )}
                </div>
              </div>

              <div className="space-y-0.5 text-xs text-charcoal-800">
                <Link
                  to="/app/reports"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-900/5 transition-colors"
                >
                  <FileText className="w-4 h-4 text-forest-700" />
                  <span>Reports & Exports</span>
                </Link>
                <Link
                  to="/app/alerts"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-900/5 transition-colors"
                >
                  <Bell className="w-4 h-4 text-forest-700" />
                  <span>NDVI Anomaly Alerts</span>
                </Link>
                <Link
                  to="/app/settings"
                  onClick={() => setUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-forest-900/5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-forest-700" />
                  <span>Account & Billing</span>
                </Link>

                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-amber-900 hover:bg-amber-50 transition-colors"
                  >
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    <span>Admin Console</span>
                  </Link>
                )}

                <div className="border-t border-forest-900/10 my-1 pt-1">
                  <button
                    onClick={() => {
                      logout();
                      setUserMenuOpen(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-red-700 hover:bg-red-50 transition-colors text-left"
                  >
                    <LogOut className="w-4 h-4 text-red-600" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
