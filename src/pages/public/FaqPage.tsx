import React, { useState } from 'react';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { ChevronDown, ChevronUp, HelpCircle, Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FaqItem {
  q: string;
  a: string;
  category: 'satellite' | 'accuracy' | 'features' | 'billing';
}

export const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [search, setSearch] = useState('');

  const faqs: FaqItem[] = [
    {
      q: 'What is NDVI?',
      a: 'Normalized Difference Vegetation Index (NDVI) is a remote-sensing measurement calculated from satellite sensors. It compares how much Near-Infrared light (reflected by healthy leaf cellular structure) versus Red light (absorbed by chlorophyll for photosynthesis) bounces off your crops. The resulting number ranges between -1.0 and +1.0. Numbers above 0.6 indicate lush, dense, and vigorous green crops, while lower numbers reveal sparse emergence, bare soil, or crop stress.',
      category: 'satellite',
    },
    {
      q: 'How accurate is it?',
      a: 'AgriEye uses calibrated Level-2A Bottom-Of-Atmosphere (BOA) Surface Reflectance imagery from Sentinel-2. This means atmospheric Rayleigh scattering, aerosol dust, and water vapor distortion have been removed mathematically. Each pixel corresponds to a precise 10m x 10m ground footprint (100 square meters), calibrated to ±5% radiometric accuracy. It reliably distinguishes between healthy and stressed zones within the same field parcel.',
      category: 'accuracy',
    },
    {
      q: 'Which satellites does AgriEye use?',
      a: 'Our primary constellation is the European Space Agency’s (ESA) Copernicus Sentinel-2 mission, consisting of twin optical satellites (Sentinel-2A and Sentinel-2B) operating in the same sun-synchronous orbit 786 km above Earth. We also integrate USGS/NASA Landsat 8 and Landsat 9 as secondary sensors to extend historical baselines back over a decade.',
      category: 'satellite',
    },
    {
      q: 'How often is imagery updated?',
      a: 'Every 5 days worldwide. Because Sentinel-2 operates two identical satellites phased 180 degrees apart along the same orbital plane, any point on Earth’s land surface is photographed every 5 days under consistent solar illumination conditions. In mid-latitudes, orbital swaths overlap, providing revisit opportunities as frequently as every 2 to 3 days.',
      category: 'satellite',
    },
    {
      q: 'How big can my field be?',
      a: 'On the Free Starter plan, you can monitor up to 250 hectares (approx. 617 acres) in total. The Pro plan supports up to 2,500 hectares (6,177 acres) per account. The Business Enterprise plan supports 25,000+ hectares with custom tiling pipelines. Individual single field polygons can be as large as thousands of continuous hectares with no performance degradation.',
      category: 'features',
    },
    {
      q: 'Can I upload my own boundaries?',
      a: 'Yes! AgriEye includes a universal geospatial importer. You can drag and drop standard GeoJSON (.geojson, .json), Google Earth KML (.kml), or zipped ESRI Shapefiles (.zip). Our parser automatically validates the polygon geometry, detects coordinate reference systems, and calculates acreage immediately.',
      category: 'features',
    },
    {
      q: 'Why is my map cloudy or empty?',
      a: 'Optical satellites cannot see through dense cloud decks. If a heavy storm or overcast weather occurred on the day of the satellite pass, those pixels will be masked out to prevent misleading NDVI numbers. Use AgriEye’s bottom timeline slider or date picker to select a previous or subsequent cloud-free pass. You can also adjust the "Max Cloud Filter" slider to include scenes with light scattered cirrus.',
      category: 'satellite',
    },
    {
      q: 'What do the colours mean?',
      a: 'In the standard AgriEye palette: Brown and burnt orange indicate bare ground, tillage residue, or standing water (NDVI < 0.2). Yellow indicates early seedling emergence or stressed canopy (0.2 to 0.4). Light lime green reflects moderate, developing biomass (0.4 to 0.65). Deep forest green represents dense, vigorous, high-photosynthesis foliage (> 0.75). We also provide a colorblind-safe Viridis palette (purple to yellow).',
      category: 'accuracy',
    },
    {
      q: 'Can I export data?',
      a: 'Absolutely. You can export 32-bit float GeoTIFF raster grids (ready to import into machinery displays like John Deere Operations Center or Climate FieldView), high-resolution PNG map snapshots, multi-temporal CSV spreadsheets with dates and means, and professional branded PDF summary reports.',
      category: 'features',
    },
    {
      q: 'Is my data private?',
      a: 'Yes, 100%. Your field boundaries, agronomic notes, and historical analyses are stored with strict PostgreSQL Row Level Security (RLS). Only your authenticated account can read or query your field coordinates. We never sell or share farm acreage data with third-party commodity traders, input suppliers, or competitors.',
      category: 'billing',
    },
    {
      q: 'How does pricing work?',
      a: 'AgriEye offers a transparent tiered subscription model. Free Starter includes 250 hectares forever with no credit card required. Pro Agronomist is $49/month (or $39/month billed annually) for up to 2,500 hectares, multi-index calculations (EVI, NDWI, NDRE), and GeoTIFF exports. Business Enterprise is $199/month for up to 25,000 hectares and API access.',
      category: 'billing',
    },
    {
      q: 'Can I use AgriEye for insurance or compliance?',
      a: 'Yes. Because Sentinel-2 satellite data is independently recorded and timestamped by the European Space Agency, AgriEye PDF and CSV exports serve as neutral, tamper-proof evidentiary records for crop insurance damage claims (hail, drought, freeze, flood) and carbon credit verification audits.',
      category: 'features',
    },
    {
      q: 'Do you support teams and multiple users?',
      a: 'Yes. Our Business Enterprise plan allows you to invite agronomists, farm managers, and scouting interns with role-based access control. Everyone shares the same field catalog and can annotate ground observations collaboratively.',
      category: 'features',
    },
  ];

  const filteredFaqs = faqs.filter(
    (item) =>
      !search ||
      item.q.toLowerCase().includes(search.toLowerCase()) ||
      item.a.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            Knowledge Base
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-forest-950">
            Frequently Asked Questions
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Everything you need to know about AgriEye satellite imagery, NDVI accuracy, field boundaries, and data export.
          </p>

          {/* Search bar */}
          <div className="pt-2 max-w-md mx-auto">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search FAQ questions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl glass-panel border border-forest-900/15 text-xs text-charcoal-900 focus:outline-none focus:ring-2 focus:ring-forest-900/30"
              />
            </div>
          </div>
        </div>

        {/* FAQ Accordion List */}
        <div className="space-y-3">
          {filteredFaqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={faq.q}
                className="glass-panel rounded-2xl border border-white/80 overflow-hidden shadow-xs transition-all"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-white/50 transition-colors"
                >
                  <h3 className="font-serif font-bold text-base text-forest-950">
                    {faq.q}
                  </h3>
                  <div className="p-1 rounded-lg text-forest-900 shrink-0">
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-charcoal-800/85 leading-relaxed border-t border-forest-900/5 pt-3 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Still have questions banner */}
        <div className="glass-panel rounded-3xl p-8 border border-white/80 text-center space-y-3">
          <h3 className="font-serif font-bold text-xl text-forest-950">
            Have a question about a specific crop or custom farm coordinate system?
          </h3>
          <p className="text-xs text-gray-600 max-w-md mx-auto">
            Our agronomy and GIS engineering team is available to assist with custom Shapefiles and enterprise setups.
          </p>
          <div className="pt-2">
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 bg-forest-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-forest-800 transition-all"
            >
              <span>Contact AgriEye Agronomists</span>
              <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
