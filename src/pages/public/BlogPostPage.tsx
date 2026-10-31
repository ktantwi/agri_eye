import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Navbar } from '../../components/common/Navbar';
import { Footer } from '../../components/common/Footer';
import { BLOG_ARTICLES } from './BlogPage';
import { ArrowLeft, Clock, Calendar, Share2, Eye, CheckCircle2 } from 'lucide-react';

export const BlogPostPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = BLOG_ARTICLES.find((a) => a.slug === slug);

  if (!article) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <div className="min-h-screen bg-sand-50 text-charcoal-800 flex flex-col">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto space-y-8 text-left">
        {/* Breadcrumb Navigation */}
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 text-xs font-semibold text-forest-900 hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Agronomy Articles</span>
        </Link>

        {/* Article Header */}
        <header className="space-y-4">
          <div className="flex items-center gap-2">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${article.badgeColor}`}
            >
              {article.tag}
            </span>
            <span className="text-xs text-gray-400 font-mono">• {article.readTime}</span>
          </div>

          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-forest-950 leading-tight">
            {article.title}
          </h1>

          <div className="flex items-center gap-3 pt-2 text-xs text-gray-500 border-b border-forest-900/10 pb-6">
            <div className="w-8 h-8 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold font-serif">
              {article.author[0]}
            </div>
            <div>
              <p className="font-bold text-charcoal-900">{article.author}</p>
              <p className="text-[11px] text-gray-400">Published on {article.date}</p>
            </div>
          </div>
        </header>

        {/* Article Body Content */}
        <article className="prose prose-forest text-sm sm:text-base leading-relaxed text-charcoal-800/90 space-y-6">
          <p className="font-serif italic text-lg text-forest-900 bg-forest-900/5 p-4 rounded-2xl border-l-4 border-lime-500">
            "{article.summary}"
          </p>

          <h2 className="font-serif font-bold text-2xl text-forest-950 pt-4">
            1. Why Conventional Visual Scouting Misses Early Decline
          </h2>
          <p>
            Human eyes observe visible wavelengths between 400 nm and 700 nm. By the time corn or soybean leaves display visible yellow chlorosis or afternoon leaf curling to an agronomist walking the field rows, permanent cellular stress has already occurred.
          </p>
          <p>
            In contrast, Sentinel-2's Near-Infrared (Band 8 at 842 nm) and Short-Wave Infrared (SWIR Band 11 at 1610 nm) sensors detect the collapse of cell turgor pressure up to 7 to 10 days before visual symptoms emerge.
          </p>

          <div className="glass-panel p-6 rounded-2xl border border-white/80 my-6 space-y-2">
            <h3 className="font-serif font-bold text-base text-forest-950">
              Key Field Takeaway:
            </h3>
            <p className="text-xs text-charcoal-800">
              Correlating sudden NDVI dips of &gt;0.12 within a 5-day pass window against weather station rainfall data allows immediate irrigation scheduling before irreversible yield compromise occurs.
            </p>
          </div>

          <h2 className="font-serif font-bold text-2xl text-forest-950 pt-4">
            2. Implementing the 3-Step Satellite Protocol
          </h2>
          <p>
            To operationalize this inside AgriEye:
          </p>
          <ol className="list-decimal pl-5 space-y-2 text-xs sm:text-sm">
            <li>
              <strong>Set Anomaly Thresholds:</strong> Configure AgriEye alerts to trigger when mean field NDVI dips below the 3-year historical baseline for that specific growth week.
            </li>
            <li>
              <strong>Switch to NDWI during heatwaves:</strong> Review plant water content directly using the NDWI toggle.
            </li>
            <li>
              <strong>Export Variable-Rate Prescription:</strong> Generate a GeoTIFF zone map to calibrate pivot nozzle speeds or spot sprayer runs.
            </li>
          </ol>
        </article>

        {/* Bottom CTA to App */}
        <div className="glass-panel p-6 rounded-3xl border border-lime-500/50 bg-white/80 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div>
            <h4 className="font-serif font-bold text-base text-forest-950">
              Ready to test this on your own fields?
            </h4>
            <p className="text-xs text-gray-500">
              Draw your boundaries in AgriEye and inspect 10m Sentinel-2 indices instantly.
            </p>
          </div>
          <Link
            to="/app"
            className="inline-flex items-center gap-1.5 bg-forest-900 text-white font-semibold text-xs px-4 py-2.5 rounded-xl hover:bg-forest-800 transition-all shrink-0"
          >
            <Eye className="w-4 h-4 text-lime-400" />
            <span>Launch Field Map</span>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
};
