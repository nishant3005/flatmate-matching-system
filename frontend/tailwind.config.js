/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Outfit', 'sans-serif'] },
      colors: {
        primary: {
          50:  '#f0f0ff', 100: '#e0e0ff', 200: '#c4c6ff',
          300: '#a5a0ff', 400: '#8678f8', 500: '#7c3aed',
          600: '#6d28d9', 700: '#5b21b6', 800: '#4c1d95', 900: '#2e1065',
        },
        accent: { 400: '#22d3ee', 500: '#06b6d4', 600: '#0891b2' },
        dark:   { 900: '#0a0a12', 800: '#111120', 700: '#1a1a2e', 600: '#16213e' },
      },
      animation: {
        'float':       'float 6s ease-in-out infinite',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4,0,0.6,1) infinite',
        'spin-slow':   'spin 8s linear infinite',
        'slide-up':    'slideUp 0.4s ease-out',
        'fade-in':     'fadeIn 0.5s ease-out',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-12px)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(20px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
