import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  Satellite,
  Layers,
  TrendingUp,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Clock,
  Compass,
  FileText,
  BarChart3,
  MapPin,
  ChevronRight,
  Eye,
  Sliders,
  Play
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  // Interactive demo widget state in Hero section
  const [demoIndex, setDemoIndex] = useState<'NDVI' | 'EVI' | 'NDWI'>('NDVI');
  const [demoDate, setDemoDate] = useState('July Peak Vigor');

  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col selection:bg-lime-500 selection:text-forest-950">
      <Navbar />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Headlines & CTA */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 bg-forest-900/10 border border-forest-900/20 px-3.5 py-1.5 rounded-full text-xs font-semibold text-forest-900">
                <Satellite className="w-3.5 h-3.5 text-lime-600 animate-pulse" />
                <span>10-Meter Sentinel-2 Satellite Vegetation Intelligence</span>
              </div>

              <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-forest-950 leading-[1.1] tracking-tight">
                See your fields <br />
                <span className="text-lime-600 italic">from space.</span>
              </h1>

              <p className="text-base sm:text-lg text-charcoal-800/80 leading-relaxed max-w-xl">
                AgriEye transforms raw European Space Agency satellite data into crisp, actionable 10-meter NDVI crop health maps. Draw your boundary, track seasonal biomass trends, detect water stress, and generate variable-rate nitrogen prescriptions in seconds.
              </p>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
                <Link
                  to="/app"
                  className="inline-flex items-center justify-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-float hover:shadow-lg transition-all text-sm group"
                >
                  <Eye className="w-4 h-4 text-lime-400" />
                  <span>Launch Interactive Map</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                <Link
                  to="/what-is-ndvi"
                  className="inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 text-forest-950 font-semibold px-5 py-3.5 rounded-2xl border border-forest-900/20 shadow-sm transition-all text-sm"
                >
                  <span>Learn What is NDVI</span>
                </Link>
              </div>

              {/* Social Proof Badges */}
              <div className="pt-4 flex items-center gap-6 text-xs text-gray-600 border-t border-forest-900/10">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-600" />
                  <span>Free Starter Plan (No Credit Card)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-lime-600" />
                  <span>5-Day Orbital Revisit Schedule</span>
                </div>
              </div>
            </div>

            {/* Right Column: Live Interactive NDVI Map Demo Preview */}
            <div className="lg:col-span-6 relative">
              <div className="glass-panel p-3 rounded-3xl shadow-float border border-white/80 relative overflow-hidden">
                {/* Header bar of the simulated viewer */}
                <div className="flex items-center justify-between pb-2.5 px-2 border-b border-forest-900/10">
                  <div className="flex items-center gap-2">
                    <span className="flex h-2.5 w-2.5 rounded-full bg-lime-500 animate-ping" />
                    <span className="text-xs font-bold text-forest-950 font-sans">
                      Prairie View Plot #4 — 38.4 ha
                    </span>
                  </div>

                  {/* Index switcher */}
                  <div className="flex items-center gap-1 bg-forest-900/10 p-0.5 rounded-xl text-[10px] font-bold">
                    {(['NDVI', 'EVI', 'NDWI'] as const).map((idx) => (
                      <button
                        key={idx}
                        onClick={() => setDemoIndex(idx)}
                        className={`px-2 py-0.5 rounded-lg transition-all ${
                          demoIndex === idx
                            ? 'bg-forest-900 text-white shadow-xs'
                            : 'text-forest-900 hover:bg-forest-900/10'
                        }`}
                      >
                        {idx}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Simulated Map Viewport with SVG Vegetation Field Raster */}
                <div className="relative h-72 sm:h-80 w-full rounded-2xl overflow-hidden mt-2 bg-forest-950 flex items-center justify-center">
                  {/* Satellite background texture */}
                  <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#84cc16_1px,transparent_1px)] [background-size:16px_16px]" />

                  {/* Simulated Dynamic SVG Field with realistic NDVI Color Ramp */}
                  <svg viewBox="0 0 400 300" className="w-full h-full p-4 drop-shadow-2xl">
                    <defs>
                      <linearGradient id="ndviGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={demoIndex === 'NDWI' ? '#0284c7' : '#84cc16'} />
                        <stop offset="35%" stopColor={demoIndex === 'NDWI' ? '#38bdf8' : '#65a30d'} />
                        <stop offset="70%" stopColor={demoIndex === 'NDWI' ? '#0369a1' : '#15803d'} />
                        <stop offset="100%" stopColor={demoIndex === 'NDWI' ? '#0c4a6e' : '#14532d'} />
                      </linearGradient>
                      <pattern id="cropRows" width="12" height="12" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
                        <line x1="0" y1="0" x2="0" y2="12" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.15" />
                      </pattern>
                    </defs>

                    {/* Surrounding landscape */}
                    <rect width="400" height="300" fill="#1b281f" opacity="0.8" />

                    {/* Field Boundary Polygon */}
                    <polygon
                      points="50,60 350,45 365,240 65,260"
                      fill="url(#ndviGrad)"
                      stroke="#84cc16"
                      strokeWidth="3"
                      strokeDasharray="4 2"
                    />
                    <polygon
                      points="50,60 350,45 365,240 65,260"
                      fill="url(#cropRows)"
                    />

                    {/* Stress Anomaly Zone Highlight */}
                    <ellipse cx="280" cy="180" rx="35" ry="25" fill="#f59e0b" fillOpacity="0.85" />
                    <text x="280" y="184" fill="#ffffff" fontSize="9" fontWeight="bold" textAnchor="middle">
                      Stress Anomaly
                    </text>

                    {/* Probe Point Cursor */}
                    <circle cx="160" cy="130" r="6" fill="#84cc16" stroke="#ffffff" strokeWidth="2" />
                  </svg>

                  {/* Floating Pixel Readout Badge */}
                  <div className="absolute top-4 left-4 glass-panel rounded-xl px-3 py-1.5 shadow border border-white/70 text-xs">
                    <span className="text-gray-500 font-mono text-[10px] block">Mean {demoIndex}:</span>
                    <span className="text-base font-bold font-mono text-forest-900">
                      {demoIndex === 'NDVI' ? '0.842' : demoIndex === 'EVI' ? '0.695' : '0.412'}
                    </span>
                    <span className="text-[9px] text-lime-700 block font-semibold">Healthy Canopy</span>
                  </div>

                  {/* Floating Date Selector */}
                  <div className="absolute bottom-4 right-4 glass-panel rounded-xl px-3 py-1.5 shadow border border-white/70 text-xs flex items-center gap-2">
                    <Satellite className="w-3.5 h-3.5 text-forest-800" />
                    <span className="font-mono text-[11px] font-semibold text-forest-950">
                      Sentinel-2 Pass: July 28
                    </span>
                  </div>
                </div>

                {/* Bottom interactive link */}
                <div className="pt-2 px-1 flex items-center justify-between text-xs text-forest-900">
                  <span className="text-gray-500">Live preview of AgriEye map canvas</span>
                  <Link to="/app" className="font-bold flex items-center gap-1 hover:underline">
                    <span>Open Full Map Experience</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 3-Step "How It Works" Section */}
      <section className="py-20 bg-sand-100 border-y border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-700 bg-lime-400/20 px-3 py-1 rounded-full">
              Seamless Workflow
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
              How AgriEye Works: Draw → Analyze → Act
            </h2>
            <p className="text-sm text-gray-600">
              No complex GIS software, no manual satellite downloads, and zero drone flights required.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="glass-panel p-8 rounded-3xl text-left space-y-4 border border-white/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-serif font-bold text-lg">
                1
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-950">
                Draw or Upload Boundary
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Draw your field perimeter with polygons or center-pivots, or import your existing farm boundaries in GeoJSON, KML, or zipped Shapefiles. Live area calculates in hectares.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-forest-900">
                <Compass className="w-4 h-4 text-lime-600" />
                <span>Instant Hectares Calculation</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="glass-panel p-8 rounded-3xl text-left space-y-4 border border-white/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-serif font-bold text-lg">
                2
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-950">
                Automatic Satellite Processing
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Our Google Earth Engine engine pulls fresh 10m Sentinel-2 Surface Reflectance (L2A) bands, filters cloud shadow using Scene Classification (SCL), and renders high-res NDVI tiles.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-forest-900">
                <Satellite className="w-4 h-4 text-lime-600" />
                <span>Sub-second Cloud Masking</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="glass-panel p-8 rounded-3xl text-left space-y-4 border border-white/80 relative">
              <div className="w-12 h-12 rounded-2xl bg-forest-900 text-white flex items-center justify-center font-serif font-bold text-lg">
                3
              </div>
              <h3 className="font-serif font-bold text-xl text-forest-950">
                Actionable Field Decisions
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Inspect pixel-level vigor variations, compare growth across multi-week time series, receive automatic drop alerts, and export prescription GeoTIFFs or PDF agronomist reports.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-forest-900">
                <TrendingUp className="w-4 h-4 text-lime-600" />
                <span>Variable-Rate Prescriptions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
              Platform Features
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
              Built for Ground-Truth Precision
            </h2>
            <p className="text-sm text-gray-600">
              The full-screen map IS the app. Zero clutter, floating glass panels, and instant response.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <Satellite className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                10-Meter Resolution
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Copernicus Sentinel-2 multispectral sensors provide 10-meter ground sample distance per pixel — sharp enough to detect clogged pivot nozzles, compaction, and weed patches.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <Clock className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                5-Day Orbital Revisit Schedule
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                With dual satellites Sentinel-2A and Sentinel-2B in synchronized orbit, imagery refreshes every 5 days worldwide, supplemented by Landsat 8/9 for multi-decade baselines.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <Sliders className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                Automated Cloud Filtering
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Our Cloud Score+ and Scene Classification algorithm eliminates cloud shadows and cirrus haze before computing vegetation indices, so your time series never gets skewed.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <Layers className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                4 Multi-Spectral Vegetation Indices
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Switch instantly between NDVI (vegetative biomass), EVI (dense canopy sensitivity), NDWI (canopy moisture/water stress), and NDRE (early-stage nitrogen chlorophyll).
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                Zonal Stats & Histogram Distribution
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Compute mean, min, max, standard deviation, and pixel frequency histograms for any field in sub-seconds using server-side reduceRegion operations.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-forest-900/10 text-forest-900 flex items-center justify-center">
                <FileText className="w-5 h-5 text-forest-800" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                GIS Export & PDF Agronomist Reports
              </h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Export 32-bit floating point GeoTIFF rasters directly for John Deere Operations Center or Climate FieldView, along with client-ready branded PDF reports.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Target Audience: Who It's For */}
      <section className="py-20 bg-sand-100 border-y border-forest-900/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-700 bg-lime-400/20 px-3 py-1 rounded-full">
              Industry Solutions
            </span>
            <h2 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
              Who Uses AgriEye?
            </h2>
            <p className="text-sm text-gray-600">
              Tailored geospatial workflows for every sector in modern agricultural production.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3 text-left">
              <span className="text-2xl">🚜</span>
              <h3 className="font-serif font-bold text-base text-forest-950">Commercial Farmers</h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Spot irrigation leaks, nutrient deficiencies, and drainage bottlenecks weeks before they appear on tractor monitors. Save on nitrogen inputs.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3 text-left">
              <span className="text-2xl">🔬</span>
              <h3 className="font-serif font-bold text-base text-forest-950">Crop Agronomists</h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Scout 50,000 hectares from your laptop before driving out. Direct your field scouts to the exact GPS coordinates with declining vegetation vigor.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3 text-left">
              <span className="text-2xl">📑</span>
              <h3 className="font-serif font-bold text-base text-forest-950">Crop Insurers</h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Verify drought, hail, and flood claim benchmarks with unbiased Copernicus satellite orbital records. Track before-and-after NDVI drops accurately.
              </p>
            </div>

            <div className="glass-panel p-6 rounded-3xl border border-white/80 space-y-3 text-left">
              <span className="text-2xl">🍇</span>
              <h3 className="font-serif font-bold text-base text-forest-950">Estate Managers</h3>
              <p className="text-xs text-charcoal-800/80 leading-relaxed">
                Monitor high-value vineyards, almond orchards, and rotational forestry. Segment parcels by harvest readiness and water stress.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Pricing Teaser */}
      <section className="py-20 text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Transparent Pricing
          </span>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
            Start Free. Upgrade As Your Acreage Grows.
          </h2>
          <p className="text-sm text-gray-600 max-w-xl mx-auto">
            Free forever for up to 250 hectares. Pro tier for agronomists at $49/mo with full multi-year archives and GeoTIFF exports.
          </p>

          <div className="pt-4 flex justify-center items-center gap-4">
            <Link
              to="/pricing"
              className="bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3 rounded-2xl text-xs transition-all shadow-sm"
            >
              View All Plans & Features
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
