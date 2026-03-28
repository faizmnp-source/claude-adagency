/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Space Grotesk', 'sans-serif'],
        serif:   ['Playfair Display', 'serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      colors: {
        ink:    '#08060F',
        surface:'#0E0B18',
        card:   '#13101F',
        gold: {
          DEFAULT: '#C9A84C',
          light:   '#E2C97E',
          dark:    '#9D7A2A',
        },
        violet: {
          DEFAULT: '#7B5EA7',
          light:   '#A78BFA',
        },
      },
      boxShadow: {
        'gold-sm': '0 0 20px rgba(201,168,76,0.15)',
        'gold':    '0 0 40px rgba(201,168,76,0.2)',
        'gold-lg': '0 0 80px rgba(201,168,76,0.3)',
      },
    },
  },
  plugins: [],
};
