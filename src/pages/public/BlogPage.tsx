import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { Calendar, Clock, ArrowRight, Tag } from 'lucide-react';

export interface Article {
  slug: string;
  title: string;
  summary: string;
  author: string;
  date: string;
  readTime: string;
  tag: string;
  badgeColor: string;
}

export const BLOG_ARTICLES: Article[] = [
  {
    slug: 'detect-crop-water-stress-ndvi',
    title: 'How to Detect Crop Water Stress Before It’s Visible: An Agronomist’s Guide',
    summary:
      'Why waiting for leaf wilting costs you 15-20% in yield potential. Combining NDWI with 10m Sentinel-2 bands allows early pivot and drip irrigation adjustments.',
    author: 'Dr. Sarah Jenkins',
    date: 'Oct 24, 2026',
    readTime: '6 min read',
    tag: 'Irrigation & Water',
    badgeColor: 'bg-blue-100 text-blue-800',
  },
  {
    slug: 'sentinel-2-vs-landsat-9-agriculture',
    title: 'Sentinel-2 vs Landsat 9: Which Satellite Constellation is Best for Precision Agriculture?',
    summary:
      'A deep dive comparing spatial resolution (10m vs 30m), temporal revisit cycles (5 days vs 8 days), and red-edge spectral bands across modern remote sensing platforms.',
    author: 'Marcus Vance, Senior Remote Sensing Scientist',
    date: 'Oct 18, 2026',
    readTime: '8 min read',
    tag: 'Satellites & Sensors',
    badgeColor: 'bg-lime-100 text-forest-900',
  },
  {
    slug: 'variable-rate-nitrogen-ndvi-guide',
    title: 'Decoding Variable Rate Nitrogen Application Using Mid-Season NDVI Maps',
    summary:
      'Stop applying flat nitrogen rates across variable soils. Step-by-step methodology to turn July satellite vigor composites into prescription rate Shapefiles for your sprayer.',
    author: 'David Chen, CCA Agronomist',
    date: 'Oct 10, 2026',
    readTime: '9 min read',
    tag: 'Nutrient Management',
    badgeColor: 'bg-amber-100 text-amber-900',
  },
];

export const BlogPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-forest-900 bg-forest-900/10 px-3 py-1 rounded-full">
            The Precision Agronomy Blog
          </span>
          <h1 className="font-serif font-bold text-4xl sm:text-5xl text-forest-950">
            Insights from the Satellite Frontier
          </h1>
          <p className="text-sm text-gray-600 leading-relaxed">
            Practical guides on remote sensing, variable-rate fertilizer prescriptions, and satellite imagery for agronomists.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {BLOG_ARTICLES.map((article) => (
            <article
              key={article.slug}
              className="glass-panel rounded-3xl p-6 border border-white/80 flex flex-col justify-between hover:shadow-float transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${article.badgeColor}`}
                  >
                    {article.tag}
                  </span>
                  <span className="text-[11px] text-gray-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" /> {article.readTime}
                  </span>
                </div>

                <h2 className="font-serif font-bold text-xl text-forest-950 group-hover:text-forest-700 transition-colors leading-snug">
                  <Link to={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>

                <p className="text-xs text-charcoal-800/80 leading-relaxed">
                  {article.summary}
                </p>
              </div>

              <div className="pt-6 border-t border-forest-900/10 mt-6 flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-charcoal-900 block">{article.author}</span>
                  <span className="text-[10px] text-gray-400">{article.date}</span>
                </div>

                <Link
                  to={`/blog/${article.slug}`}
                  className="font-bold text-forest-900 flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                >
                  <span>Read Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 text-lime-600" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
};
