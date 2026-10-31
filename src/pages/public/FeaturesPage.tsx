import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import {
  Satellite,
  Layers,
  Sparkles,
  TrendingUp,
  Download,
  Shield,
  Sliders,
  Calendar,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export const FeaturesPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Engineering Specifications
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-forest-950">
            Precision Satellite Infrastructure Built for Agriculture
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            AgriEye combines the European Space Agency's Copernicus constellation with Google Earth Engine's distributed planetary compute engine to deliver fast, reliable vegetation maps.
          </p>
        </div>

        {/* Feature Deep Dive 1: Indices */}
        <div className="glass-panel rounded-3xl p-8 border border-white/80 space-y-6">
          <div className="max-w-xl space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-700">Multi-Spectral Indices</span>
            <h2 className="font-serif font-bold text-2xl text-forest-950">
              Beyond NDVI: 4 Specialized Spectral Ratios
            </h2>
            <p className="text-xs text-gray-600">
              Different crops and growing stages require different spectral sensitivity. AgriEye supports 4 research-backed indices out of the box.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
            <div className="p-5 bg-white/70 rounded-2xl border border-white/80 space-y-2">
              <span className="font-bold text-forest-900 text-sm font-mono block">NDVI</span>
              <p className="text-xs font-semibold text-charcoal-900">Normalized Difference Vegetation Index</p>
              <p className="text-[11px] text-gray-500 font-mono">(B8 - B4) / (B8 + B4)</p>
              <p className="text-xs text-charcoal-800/80 pt-1">
                The global gold standard for chlorophyll activity and total green vegetative biomass. Ideal for mid-season vigor tracking.
              </p>
            </div>

            <div className="p-5 bg-white/70 rounded-2xl border border-white/80 space-y-2">
              <span className="font-bold text-forest-900 text-sm font-mono block">EVI</span>
              <p className="text-xs font-semibold text-charcoal-900">Enhanced Vegetation Index</p>
              <p className="text-[11px] text-gray-500 font-mono">2.5 * (B8 - B4) / (B8 + 6*B4 - 7.5*B2 + 1)</p>
              <p className="text-xs text-charcoal-800/80 pt-1">
                Optimized for high-biomass crops (corn, sugarcane) where standard NDVI saturates. Decouples atmospheric aerosol background noise.
              </p>
            </div>

            <div className="p-5 bg-white/70 rounded-2xl border border-white/80 space-y-2">
              <span className="font-bold text-forest-900 text-sm font-mono block">NDWI</span>
              <p className="text-xs font-semibold text-charcoal-900">Normalized Difference Water Index</p>
              <p className="text-[11px] text-gray-500 font-mono">(B3 - B8) / (B3 + B8)</p>
              <p className="text-xs text-charcoal-800/80 pt-1">
                Sensitive to liquid water molecules within the leaf internal mesophyll structure. Detects water deficit stress before wilting occurs.
              </p>
            </div>

            <div className="p-5 bg-white/70 rounded-2xl border border-white/80 space-y-2">
              <span className="font-bold text-forest-900 text-sm font-mono block">NDRE</span>
              <p className="text-xs font-semibold text-charcoal-900">Normalized Difference Red Edge</p>
              <p className="text-[11px] text-gray-500 font-mono">(B8 - B5) / (B8 + B5)</p>
              <p className="text-xs text-charcoal-800/80 pt-1">
                Uses Sentinel-2's narrow Band 5 (705 nm) Red Edge band. Excellent for variable-rate mid-season nitrogen top-dressing decisions.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Deep Dive 2: Processing Pipeline */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="glass-panel p-8 rounded-3xl border border-white/80 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Satellite className="w-5 h-5 text-lime-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-forest-950">
              Copernicus Sentinel-2 Harmonized Engine
            </h3>
            <p className="text-xs text-charcoal-800/80 leading-relaxed">
              We ingest raw Level-2A Bottom-Of-Atmosphere (BOA) Surface Reflectance imagery directly from the European Space Agency. Every scene passes through sen2cor atmospheric correction, removing Rayleigh scattering and water vapor interference.
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>10m Spatial Resolution across Red, Green, Blue, NIR</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>20m Red Edge & Short-Wave Infrared (SWIR)</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>Synchronized 5-day dual satellite orbit (S2A & S2B)</span>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-8 rounded-3xl border border-white/80 space-y-4">
            <div className="w-10 h-10 rounded-2xl bg-forest-900 text-white flex items-center justify-center">
              <Sliders className="w-5 h-5 text-lime-400" />
            </div>
            <h3 className="font-serif font-bold text-xl text-forest-950">
              Cloud Score+ & SCL Shadow Masking
            </h3>
            <p className="text-xs text-charcoal-800/80 leading-relaxed">
              Nothing is more frustrating than cloudy pixels corrupting your field statistics. AgriEye applies a multi-criteria mask on each pixel, isolating cloud shadows, cirrus haze, and high-probability cumulus before computing median time composites.
            </p>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>Pixel-level Scene Classification Layer (SCL) validation</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>User-adjustable 0% to 50% cloud filter slider</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-lime-600 shrink-0" />
                <span>Automatic fallback to Landsat 8/9 when S2 is obscured</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center py-8">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-float text-sm"
          >
            <span>Explore on Interactive Map</span>
            <ArrowRight className="w-4 h-4 text-lime-400" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
