import React from 'react';
import { Link } from 'react-router-dom';
import { AgriEyeLogo } from './AgriEyeLogo';
import { Satellite, Globe2, Shield, Mail, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-sand-100 border-t border-forest-900/60 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-forest-900/40">
          {/* Column 1: Brand & mission */}
          <div className="lg:col-span-2 space-y-4">
            <AgriEyeLogo size="lg" showTagline={true} theme="dark" linkTo="/" />
            <p className="text-sand-200/80 text-sm leading-relaxed max-w-sm pt-2">
              AgriEye empowers farmers, crop consultants, agronomists, and agricultural insurers with real-time 10-meter Sentinel-2 satellite vegetation intelligence, time-series NDVI analytics, and automated stress anomaly detection.
            </p>
            <div className="flex items-center gap-3 pt-2 text-xs text-lime-400">
              <span className="flex items-center gap-1.5 bg-forest-900/70 border border-forest-800 px-3 py-1.5 rounded-full">
                <Satellite className="w-3.5 h-3.5 text-lime-400" />
                Copernicus Sentinel-2 & Landsat 9
              </span>
              <span className="flex items-center gap-1.5 bg-forest-900/70 border border-forest-800 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-lime-400" />
                RLS Encrypted
              </span>
            </div>
          </div>

          {/* Column 2: Platform */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase font-sans">Platform</h4>
            <ul className="space-y-2 text-sm text-sand-200/70">
              <li><Link to="/app" className="hover:text-lime-400 transition-colors">Satellite Field Map</Link></li>
              <li><Link to="/features" className="hover:text-lime-400 transition-colors">Vegetation Indices (NDVI, EVI)</Link></li>
              <li><Link to="/what-is-ndvi" className="hover:text-lime-400 transition-colors">What is NDVI?</Link></li>
              <li><Link to="/pricing" className="hover:text-lime-400 transition-colors">Pricing & Plans</Link></li>
              <li><Link to="/app/reports" className="hover:text-lime-400 transition-colors">PDF & GeoTIFF Export</Link></li>
            </ul>
          </div>

          {/* Column 3: Resources */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase font-sans">Resources</h4>
            <ul className="space-y-2 text-sm text-sand-200/70">
              <li><Link to="/blog" className="hover:text-lime-400 transition-colors">Agronomy Blog</Link></li>
              <li><Link to="/faq" className="hover:text-lime-400 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link to="/blog/sentinel-2-vs-landsat-9-agriculture" className="hover:text-lime-400 transition-colors">Sentinel-2 vs Landsat 9</Link></li>
              <li><Link to="/blog/variable-rate-nitrogen-ndvi-guide" className="hover:text-lime-400 transition-colors">Variable Rate Fertilizer Guide</Link></li>
              <li><Link to="/contact" className="hover:text-lime-400 transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Column 4: Legal & Security */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase font-sans">Privacy & Trust</h4>
            <ul className="space-y-2 text-sm text-sand-200/70">
              <li><Link to="/privacy" className="hover:text-lime-400 transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-lime-400 transition-colors">Terms of Service</Link></li>
              <li><span className="text-sand-300/50 cursor-pointer hover:text-sand-200">Cookie Preferences</span></li>
              <li><span className="text-sand-300/50">GDPR & Farm Data Sovereignty</span></li>
              <li><span className="text-sand-300/50">Service Level Agreement</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-sand-300/60 gap-4">
          <p>© {new Date().getFullYear()} AgriEye Technologies Inc. All rights reserved. Built for precision agriculture.</p>
          <div className="flex items-center gap-4">
            <Link to="/contact" className="hover:text-lime-400 transition-colors">Contact Agronomists</Link>
            <span>•</span>
            <Link to="/privacy" className="hover:text-lime-400 transition-colors">Privacy</Link>
            <span>•</span>
            <Link to="/terms" className="hover:text-lime-400 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
