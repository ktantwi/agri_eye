import React from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Shield } from 'lucide-react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 text-left">
        <header className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Farm Data Sovereignty
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
            Privacy Policy & Data Security
          </h1>
          <p className="text-xs text-gray-500 font-mono">Last updated: October 2026</p>
        </header>

        <div className="prose text-xs sm:text-sm leading-relaxed text-charcoal-800/90 space-y-4">
          <h2 className="font-serif font-bold text-lg text-forest-950">1. Farm Acreage Ownership</h2>
          <p>
            At AgriEye, your farm boundaries, field names, crop rotations, and calculated NDVI analytics belong exclusively to you. We strictly enforce PostgreSQL Row Level Security (RLS) on every database table, ensuring complete multi-tenant tenant isolation.
          </p>

          <h2 className="font-serif font-bold text-lg text-forest-950">2. No Monetization to Commodity Traders</h2>
          <p>
            Unlike many commercial agricultural conglomerates, AgriEye does not monetize, aggregate, or resell your farm's vegetative vigor data, harvest forecasts, or crop health metrics to financial speculators, grain traders, or input retailers.
          </p>

          <h2 className="font-serif font-bold text-lg text-forest-950">3. Satellite Imagery Data Rights</h2>
          <p>
            Copernicus Sentinel-2 satellite imagery is governed by European Space Agency open access terms. Derived analytical rasters and GeoTIFFs computed for your field boundaries are your property and can be deleted or exported at any time.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 text-left">
        <header className="space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Legal Terms
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950">
            Terms of Service
          </h1>
          <p className="text-xs text-gray-500 font-mono">Last updated: October 2026</p>
        </header>

        <div className="prose text-xs sm:text-sm leading-relaxed text-charcoal-800/90 space-y-4">
          <h2 className="font-serif font-bold text-lg text-forest-950">1. Agronomic Advisory Disclaimer</h2>
          <p>
            AgriEye provides remote-sensing vegetation index estimations based on optical satellite reflectance. While highly correlated with chlorophyll content and crop vigor, satellite analytics should be verified with on-the-ground physical scouting and soil tissue testing before applying variable-rate agrochemicals.
          </p>

          <h2 className="font-serif font-bold text-lg text-forest-950">2. Service Level Agreement (SLA)</h2>
          <p>
            We strive for 99.9% uptime on our Google Earth Engine processing microservice. However, satellite pass availability is contingent on European Space Agency orbital operations and local cloud coverage conditions.
          </p>
        </div>
      </main>

      <Footer />
    </div>
  );
};
