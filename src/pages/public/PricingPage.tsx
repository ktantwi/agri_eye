import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Check, ArrowRight, HelpCircle, Shield, Sparkles } from 'lucide-react';

export const PricingPage: React.FC = () => {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const discountMultiplier = billingCycle === 'yearly' ? 0.8 : 1.0;

  const tiers = [
    {
      name: 'Free Starter',
      description: 'Ideal for smallholders and hobby farmers starting out with satellite monitoring.',
      priceMonthly: 0,
      areaLimit: '250 hectares',
      popular: false,
      cta: 'Start Free Forever',
      ctaLink: '/signup',
      features: [
        'Up to 250 ha monitored area',
        '10-meter Sentinel-2 NDVI',
        '30-day historical archive',
        'Interactive polygon drawing tool',
        'Basic PDF summary export',
        'Single user seat',
      ],
    },
    {
      name: 'Pro Agronomist',
      description: 'Built for commercial crop growers, consultants, and independent agronomists.',
      priceMonthly: Math.round(49 * discountMultiplier),
      originalPrice: 49,
      areaLimit: '2,500 hectares',
      popular: true,
      cta: 'Start 14-Day Pro Trial',
      ctaLink: '/signup?plan=pro',
      features: [
        'Up to 2,500 ha monitored area',
        'NDVI, EVI, NDWI, NDRE multi-spectral indices',
        'Full multi-year historical archive (from 2017)',
        '32-bit float GeoTIFF raster downloads',
        'KML, GeoJSON, and Shapefile bulk imports',
        'Automated vegetation stress email alerts',
        'Multi-date swipe compare mode',
        'Priority cloud processing queue',
      ],
    },
    {
      name: 'Business Enterprise',
      description: 'Tailored for ag retail cooperatives, crop insurance syndicates, and farm estates.',
      priceMonthly: Math.round(199 * discountMultiplier),
      originalPrice: 199,
      areaLimit: '25,000 hectares',
      popular: false,
      cta: 'Talk to Enterprise Sales',
      ctaLink: '/contact',
      features: [
        'Up to 25,000 ha monitored area (expandable)',
        'Everything in Pro plan',
        'Unlimited agronomist team seats',
        'Developer REST API & Webhook endpoints',
        'Dedicated Google Earth Engine quota allocation',
        'Custom farm GIS coordinate projection (UTM / State Plane)',
        'SLA 99.9% uptime guarantee & phone support',
        'Annual farm data backup archives',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Transparent Agronomic Plans
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-forest-950">
            Simple, Predictable Acreage Pricing
          </h1>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
            No expensive hardware sensors. No flight booking fees. Monitor your fields with high-resolution Sentinel-2 satellite data on clear, transparent terms.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="pt-4 flex items-center justify-center">
            <div className="glass-panel p-1 rounded-2xl border border-forest-900/20 flex items-center gap-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  billingCycle === 'monthly'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-800 hover:bg-forest-900/5'
                }`}
              >
                Monthly Billing
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                  billingCycle === 'yearly'
                    ? 'bg-forest-900 text-white shadow-sm'
                    : 'text-charcoal-800 hover:bg-forest-900/5'
                }`}
              >
                <span>Annual Billing</span>
                <span className="bg-lime-500 text-forest-950 text-[10px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                  Save 20%
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((tier) => (
            <div
              key={tier.name}
              className={`glass-panel rounded-3xl p-8 border flex flex-col justify-between transition-all relative ${
                tier.popular
                  ? 'border-forest-900 ring-2 ring-forest-900/20 shadow-float bg-white/95'
                  : 'border-white/80 bg-white/70 shadow-sm hover:shadow-md'
              }`}
            >
              {tier.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-forest-900 text-white text-[10px] font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow">
                  Most Popular for Growers
                </div>
              )}

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-2xl text-forest-950">{tier.name}</h3>
                  <p className="text-xs text-gray-500 mt-1">{tier.description}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif font-bold text-4xl text-forest-950">
                      ${tier.priceMonthly}
                    </span>
                    <span className="text-xs text-gray-500">/month</span>
                    {billingCycle === 'yearly' && tier.originalPrice && (
                      <span className="text-xs text-gray-400 line-through ml-1 font-mono">
                        ${tier.originalPrice}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-lime-700 font-bold bg-lime-400/20 px-2.5 py-1 rounded-lg inline-block">
                    Monitoring Capacity: {tier.areaLimit}
                  </p>
                </div>

                <div className="border-t border-forest-900/10 pt-4">
                  <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-3">
                    What's Included:
                  </span>
                  <ul className="space-y-2.5 text-xs text-charcoal-800">
                    {tier.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5">
                        <Check className="w-4 h-4 text-lime-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="pt-8">
                <Link
                  to={tier.ctaLink}
                  className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl text-xs font-semibold transition-all ${
                    tier.popular
                      ? 'bg-forest-900 hover:bg-forest-800 text-white shadow-md'
                      : 'bg-forest-900/10 hover:bg-forest-900/20 text-forest-900'
                  }`}
                >
                  <span>{tier.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Feature Comparison Table */}
        <div className="glass-panel rounded-3xl p-8 border border-white/80 space-y-6">
          <h2 className="font-serif font-bold text-2xl text-forest-950 text-center">
            Detailed Plan Comparison
          </h2>

          <div className="overflow-x-auto text-xs">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-forest-900/10 text-gray-500 font-bold uppercase tracking-wider">
                  <th className="pb-3 pl-2">Feature / Capability</th>
                  <th className="pb-3">Free</th>
                  <th className="pb-3 text-forest-900">Pro</th>
                  <th className="pb-3">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest-900/5">
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Monitored Hectares</td>
                  <td className="py-3 font-mono">250 ha</td>
                  <td className="py-3 font-mono text-forest-900 font-bold">2,500 ha</td>
                  <td className="py-3 font-mono">25,000+ ha</td>
                </tr>
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Imagery Resolution</td>
                  <td className="py-3">10m Sentinel-2</td>
                  <td className="py-3 text-forest-900 font-bold">10m Sentinel-2 + Landsat 9</td>
                  <td className="py-3">10m + Planet 3m on-demand</td>
                </tr>
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Supported Indices</td>
                  <td className="py-3">NDVI</td>
                  <td className="py-3 text-forest-900 font-bold">NDVI, EVI, NDWI, NDRE</td>
                  <td className="py-3">All + Custom Math Formulas</td>
                </tr>
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Export Formats</td>
                  <td className="py-3">PDF, PNG</td>
                  <td className="py-3 text-forest-900 font-bold">GeoTIFF, Shapefile, CSV, PDF</td>
                  <td className="py-3">All + REST API endpoints</td>
                </tr>
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Automated Drop Alerts</td>
                  <td className="py-3 text-gray-400">—</td>
                  <td className="py-3 text-forest-900 font-bold">Email alerts</td>
                  <td className="py-3">Email + SMS + Webhooks</td>
                </tr>
                <tr>
                  <td className="py-3 pl-2 font-semibold text-charcoal-900">Historical Time Series</td>
                  <td className="py-3">30 Days</td>
                  <td className="py-3 text-forest-900 font-bold">Multi-Year (from 2017)</td>
                  <td className="py-3">Full Historical Archive</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
