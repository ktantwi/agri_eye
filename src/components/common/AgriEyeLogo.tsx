import React from 'react';
import { Link } from 'react-router-dom';

interface AgriEyeLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
  className?: string;
  linkTo?: string;
  theme?: 'light' | 'dark';
}

export const AgriEyeLogo: React.FC<AgriEyeLogoProps> = ({
  size = 'md',
  showTagline = false,
  className = '',
  linkTo = '/',
  theme = 'light',
}) => {
  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-12 h-12',
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
  };

  const content = (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {/* Eye whose iris is a leaf + pixel-grid satellite view */}
      <div className={`relative flex items-center justify-center shrink-0 ${iconSizes[size]}`}>
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          {/* Outer Orbital Eye Shape */}
          <path
            d="M3 18C7 9.5 12.5 5 18 5C23.5 5 29 9.5 33 18C29 26.5 23.5 31 18 31C12.5 31 7 26.5 3 18Z"
            fill="none"
            stroke="#14532d"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Satellite Pixel Grid Iris (Center Circle) */}
          <circle cx="18" cy="18" r="8" fill="#84cc16" fillOpacity="0.3" stroke="#84cc16" strokeWidth="1.5" />

          {/* Leaf / Pixel Field Cells inside the pupil */}
          <rect x="15" y="15" width="2.5" height="2.5" rx="0.5" fill="#14532d" />
          <rect x="18.5" y="15" width="2.5" height="2.5" rx="0.5" fill="#84cc16" />
          <rect x="15" y="18.5" width="2.5" height="2.5" rx="0.5" fill="#65a30d" />
          <rect x="18.5" y="18.5" width="2.5" height="2.5" rx="0.5" fill="#14532d" />

          {/* Leaf vein arc accent curving across */}
          <path
            d="M13 22C14.5 16.5 19 13 23 13"
            stroke="#14532d"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>

        {/* Small pulsing satellite ping badge */}
        <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-lime-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-lime-500"></span>
        </span>
      </div>

      <div className="flex flex-col leading-none">
        <span
          className={`font-serif font-bold tracking-tight ${textSizes[size]} ${
            theme === 'dark' ? 'text-white' : 'text-forest-900'
          }`}
        >
          Agri<span className="text-lime-600">Eye</span>
        </span>
        {showTagline && (
          <span
            className={`text-[10px] font-medium tracking-wide uppercase mt-0.5 ${
              theme === 'dark' ? 'text-gray-400' : 'text-forest-700/80'
            }`}
          >
            See your fields from space
          </span>
        )}
      </div>
    </div>
  );

  if (linkTo) {
    return (
      <Link to={linkTo} className="inline-flex hover:opacity-95 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
};
