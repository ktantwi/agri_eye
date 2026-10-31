/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d', // Brand primary
          950: '#052e16',
        },
        lime: {
          400: '#a3e635',
          500: '#84cc16', // Brand accent
          600: '#65a30d',
        },
        sand: {
          50: '#fafaf5', // Warm off-white
          100: '#f4f4ea',
          200: '#e8e8d5',
          300: '#d7d7bb',
        },
        charcoal: {
          800: '#1f2937',
          900: '#111827',
          950: '#0b0f17',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.45)',
        'float': '0 12px 36px -4px rgba(20, 83, 45, 0.18)',
      },
      backdropBlur: {
        'xs': '2px',
      }
    },
  },
  plugins: [],
}
