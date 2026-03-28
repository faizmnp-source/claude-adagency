/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Space Grotesk', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        ink:    '#080808',
        surface:'#101010',
        card:   '#141414',
        lime: {
          DEFAULT: '#C8FF00',
          dark:    '#9DC400',
        },
        violet: '#7C3AED',
      },
      boxShadow: {
        'lime-sm': '0 0 20px rgba(200,255,0,0.15)',
        'lime':    '0 0 40px rgba(200,255,0,0.25)',
      },
      letterSpacing: {
        display: '0.02em',
        wide:    '0.08em',
        wider:   '0.14em',
      },
    },
  },
  plugins: [],
};
