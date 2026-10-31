import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Sparkles, ArrowRight, X, Check, MapPin, Satellite, Eye, Layers } from 'lucide-react';

export const OnboardingTour: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('agrieye_tour_seen');
    if (!hasSeenTour) {
      setIsOpen(true);
    }
  }, []);

  const tourSteps = [
    {
      title: 'Welcome to AgriEye',
      tagline: 'See your fields from space.',
      description:
        'AgriEye is your interactive satellite GIS platform. Real-time 10-meter Sentinel-2 imagery, vegetative indices, and anomaly detection are mapped directly at your fingertips.',
      icon: <Eye className="w-8 h-8 text-lime-500" />,
      badge: 'Step 1 of 4',
    },
    {
      title: 'Draw or Import Fields',
      tagline: 'Polygons, pivots & Shapefiles',
      description:
        'Use the floating toolbar on the left to draw polygons, center-pivot circles, or upload existing GeoJSON, KML, and zipped Shapefiles. Live area readouts calculate hectares instantly.',
      icon: <Layers className="w-8 h-8 text-lime-500" />,
      badge: 'Step 2 of 4',
    },
    {
      title: 'Multi-Spectral Indices & Stats',
      tagline: 'NDVI, EVI, NDWI & NDRE',
      description:
        'Select any field to view zonal statistics (mean, min, max, std dev), seasonal time-series curves, and pixel-level histograms. Switch between indices with one click.',
      icon: <Satellite className="w-8 h-8 text-lime-500" />,
      badge: 'Step 3 of 4',
    },
    {
      title: 'Timeline & Split Comparison',
      tagline: 'Track crop phenology',
      description:
        'Use the bottom slider to scrub through cloud-free satellite passes over the growing season, or activate Compare Mode to swipe between two dates.',
      icon: <Sparkles className="w-8 h-8 text-lime-500" />,
      badge: 'Step 4 of 4',
    },
  ];

  const handleNext = () => {
    if (currentStep < tourSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    localStorage.setItem('agrieye_tour_seen', 'true');
    setIsOpen(false);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#14532d', '#84cc16', '#a3e635'],
    });
  };

  if (!isOpen) return null;

  const step = tourSteps[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in">
      <div className="glass-panel w-full max-w-md rounded-3xl p-6 shadow-2xl border border-white/80 space-y-4">
        {/* Top step badge */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold text-forest-900 bg-lime-400/30 px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {step.badge}
          </span>
          <button
            onClick={handleComplete}
            className="text-gray-400 hover:text-gray-700 p-1 rounded-lg"
            title="Skip Tour"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Step Content */}
        <div className="space-y-3 text-center py-2">
          <div className="w-16 h-16 rounded-3xl bg-forest-900 text-white flex items-center justify-center mx-auto shadow-md">
            {step.icon}
          </div>

          <div>
            <h3 className="font-serif font-bold text-xl text-forest-950">{step.title}</h3>
            <p className="text-xs font-semibold text-lime-700 uppercase tracking-wide mt-0.5">
              {step.tagline}
            </p>
          </div>

          <p className="text-xs text-charcoal-800 leading-relaxed max-w-sm mx-auto">
            {step.description}
          </p>
        </div>

        {/* Dots indicator */}
        <div className="flex justify-center items-center gap-1.5 pt-2">
          {tourSteps.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i === currentStep ? 'w-6 bg-forest-900' : 'w-2 bg-gray-300'
              }`}
            />
          ))}
        </div>

        {/* Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-forest-900/10">
          <button
            onClick={handleComplete}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800"
          >
            Skip Intro
          </button>

          <button
            onClick={handleNext}
            className="flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            <span>{currentStep === tourSteps.length - 1 ? 'Start Mapping' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
