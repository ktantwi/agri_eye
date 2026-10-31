import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ArrowRight, Lightbulb, Sun, Sprout, ShieldAlert, Sparkles, Eye } from 'lucide-react';

export const WhatIsNdviPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12 text-left">
        {/* Header */}
        <div className="space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Agronomy Masterclass
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-forest-950">
            What is NDVI? The Science of Satellite Crop Monitoring
          </h1>
          <p className="text-base text-gray-600 leading-relaxed">
            Normalized Difference Vegetation Index (NDVI) is the universal remote-sensing standard used to assess plant health, chlorophyll absorption, and photosynthetic biomass from Earth orbit.
          </p>
        </div>

        {/* The Formula Box */}
        <div className="glass-panel rounded-3xl p-8 border border-white/80 space-y-4 text-center">
          <span className="text-xs font-bold text-lime-700 uppercase tracking-wider">
            The Fundamental Remote Sensing Formula
          </span>

          <div className="py-6 px-4 bg-forest-950 text-white rounded-2xl max-w-lg mx-auto shadow-inner space-y-2">
            <div className="font-serif font-bold text-2xl sm:text-3xl text-lime-400 tracking-wide">
              NDVI = (NIR - Red) / (NIR + Red)
            </div>
            <p className="text-xs text-sand-200/70">
              Where <strong className="text-lime-300">NIR</strong> is Sentinel-2 Band 8 (842 nm) and <strong className="text-red-300">Red</strong> is Band 4 (665 nm).
            </p>
          </div>

          <p className="text-xs text-charcoal-800/80 max-w-xl mx-auto">
            Values strictly range from <strong>-1.0 to +1.0</strong>. Negative values represent water and cloud cover. Values between 0.0 and 0.2 indicate bare soil or sand. Values above 0.6 indicate vigorous, dense green foliage.
          </p>
        </div>

        {/* Biological Mechanism */}
        <div className="space-y-4">
          <h2 className="font-serif font-bold text-2xl text-forest-950">
            How Plants Reflect Light: The Physics Behind the Sensor
          </h2>
          <p className="text-sm text-gray-700 leading-relaxed">
            Healthy plant leaves contain green chlorophyll pigment that strongly absorbs visible red light (wavelength ~660 nm) for photosynthesis. At the same time, the spongy mesophyll cell structure inside healthy leaves strongly scatters and reflects Near-Infrared (NIR) radiation (~840 nm) to avoid thermal heat damage.
          </p>
        </div>

        {/* Comparison Diagram */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-3xl border border-lime-500/40 bg-white/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-forest-900 text-white flex items-center justify-center">
                <Sprout className="w-4 h-4 text-lime-400" />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                Healthy, Vigorous Crop
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center justify-between border-b border-gray-100 pb-1">
                <span>Red Light Absorption:</span>
                <strong className="text-forest-900">High (92%)</strong>
              </li>
              <li className="flex items-center justify-between border-b border-gray-100 pb-1">
                <span>Near-Infrared Reflectance:</span>
                <strong className="text-lime-700">Very High (50%)</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Resulting NDVI:</span>
                <strong className="font-mono text-forest-950 font-bold bg-lime-400/20 px-2 py-0.5 rounded">
                  0.72 – 0.90
                </strong>
              </li>
            </ul>
          </div>

          <div className="glass-panel p-6 rounded-3xl border border-amber-500/40 bg-white/80 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-600 text-white flex items-center justify-center">
                <ShieldAlert className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-serif font-bold text-base text-amber-950">
                Stressed or Diseased Crop
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-charcoal-800">
              <li className="flex items-center justify-between border-b border-gray-100 pb-1">
                <span>Red Light Absorption:</span>
                <strong className="text-amber-700">Low (Chlorosis/Loss)</strong>
              </li>
              <li className="flex items-center justify-between border-b border-gray-100 pb-1">
                <span>Near-Infrared Reflectance:</span>
                <strong className="text-amber-700">Reduced (Cell Collapse)</strong>
              </li>
              <li className="flex items-center justify-between">
                <span>Resulting NDVI:</span>
                <strong className="font-mono text-amber-950 font-bold bg-amber-400/20 px-2 py-0.5 rounded">
                  0.25 – 0.45
                </strong>
              </li>
            </ul>
          </div>
        </div>

        {/* Color Scale Breakdown */}
        <div className="glass-panel rounded-3xl p-8 border border-white/80 space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950">
            AgriEye NDVI Color Scale Interpretation
          </h2>

          <div className="space-y-2 text-xs">
            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60">
              <div className="w-6 h-6 rounded-md bg-[#8B4513] shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-charcoal-900">&lt; 0.10 — Barren Soil / Open Water:</span>
                <span className="text-gray-600 ml-1">Pre-emergence tillage or drainage ponds.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60">
              <div className="w-6 h-6 rounded-md bg-[#FFD700] shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-charcoal-900">0.20 to 0.40 — Early Emergence / Stressed:</span>
                <span className="text-gray-600 ml-1">Germinating seedlings, patchy stands, or nutrient drag.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60">
              <div className="w-6 h-6 rounded-md bg-[#ADFF2F] shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-charcoal-900">0.40 to 0.65 — Moderate Vegetative Canopy:</span>
                <span className="text-gray-600 ml-1">V6-V10 corn stage, rapid biomass accumulation.</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/60">
              <div className="w-6 h-6 rounded-md bg-[#006400] shrink-0" />
              <div className="flex-1">
                <span className="font-bold text-charcoal-900">&gt; 0.75 — Dense, Peak Vegetative Vigor:</span>
                <span className="text-gray-600 ml-1">Full canopy closure, high photosynthetic yield potential.</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            to="/app"
            className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-semibold px-6 py-3.5 rounded-2xl shadow-float text-sm"
          >
            <Eye className="w-4 h-4 text-lime-400" />
            <span>Inspect Your Fields with Real NDVI</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
