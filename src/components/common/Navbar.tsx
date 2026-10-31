import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AgriEyeLogo } from './AgriEyeLogo';
import { useAuthStore } from '../../store/authStore';
import { Map, Menu, X, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export const Navbar: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated, user } = useAuthStore();

  const navLinks = [
    { label: 'Features', path: '/features' },
    { label: 'Pricing', path: '/pricing' },
    { label: 'What is NDVI?', path: '/what-is-ndvi' },
    { label: 'FAQ', path: '/faq' },
    { label: 'Blog', path: '/blog' },
    { label: 'Contact', path: '/contact' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-forest-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <AgriEyeLogo size="md" showTagline={true} linkTo="/" />

        {/* Desktop Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive(link.path)
                  ? 'bg-forest-900/10 text-forest-900 font-semibold'
                  : 'text-charcoal-800 hover:text-forest-900 hover:bg-forest-900/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Action CTAs */}
        <div className="hidden md:flex items-center space-x-3">
          {isAuthenticated ? (
            <Link
              to="/app"
              className="inline-flex items-center gap-2 bg-forest-900 hover:bg-forest-800 text-white font-medium px-4 py-2 rounded-xl shadow-sm transition-all hover:shadow hover:scale-[1.01]"
            >
              <Map className="w-4 h-4 text-lime-400" />
              <span>Open Map</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-forest-900 hover:text-forest-700 px-3 py-2"
              >
                Log in
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-white text-sm font-medium px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all"
              >
                <span>Start Free</span>
                <ArrowRight className="w-3.5 h-3.5 text-lime-400" />
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="flex md:hidden items-center space-x-2">
          <Link
            to="/app"
            className="p-2 text-forest-900 bg-lime-400/30 rounded-lg hover:bg-lime-400/50"
            title="Open Map"
          >
            <Map className="w-5 h-5 text-forest-900" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-lg text-charcoal-800 hover:bg-forest-900/5"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-panel border-t border-forest-900/10 px-4 pt-2 pb-6 space-y-2">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-base font-medium ${
                isActive(link.path)
                  ? 'bg-forest-900/10 text-forest-900 font-semibold'
                  : 'text-charcoal-800 hover:bg-forest-900/5'
              }`}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-4 border-t border-forest-900/10 flex flex-col space-y-2">
            <Link
              to="/app"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full flex items-center justify-center gap-2 bg-forest-900 text-white font-medium py-2.5 rounded-xl"
            >
              <Map className="w-4 h-4 text-lime-400" />
              <span>Launch Field Map</span>
            </Link>
            {!isAuthenticated && (
              <Link
                to="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2 text-sm text-forest-900 font-medium"
              >
                Log In to Your Account
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
