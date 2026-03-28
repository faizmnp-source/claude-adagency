/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Syne', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#faf5ff',
          100: '#f3e8ff',
          400: '#c084fc',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          900: '#4c1d95',
        },
        pink:  { 500: '#ec4899', 600: '#db2777' },
        orange:{ 500: '#f97316' },
        dark:  {
          900: '#020008',
          800: '#0a0014',
          700: '#120020',
          600: '#1a0030',
        },
      },
      backgroundImage: {
        'grad-brand': 'linear-gradient(135deg, #7c3aed, #db2777, #f97316)',
        'grad-subtle': 'linear-gradient(135deg, rgba(124,58,237,0.15), rgba(219,39,119,0.1))',
      },
      boxShadow: {
        'glow-sm': '0 0 20px rgba(124,58,237,0.25)',
        'glow':    '0 0 40px rgba(124,58,237,0.35)',
        'glow-lg': '0 0 80px rgba(124,58,237,0.45)',
        'glow-pink': '0 0 40px rgba(219,39,119,0.3)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%':     { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
};
