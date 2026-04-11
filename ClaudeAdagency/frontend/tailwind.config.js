/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./ClaudeAdagency/frontend/pages/**/*.{js,ts,jsx,tsx}",
    "./ClaudeAdagency/frontend/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans:    ['Space Grotesk', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'],
      },
      colors: {
        deep:   '#050B18',
        card:   '#0D1628',
        card2:  '#0A1020',
        blue: {
          DEFAULT: '#4A6CF7',
          dark:    '#3B5BDB',
          light:   '#7C9DFF',
        },
        gold: {
          DEFAULT: '#F59E0B',
          light:   '#FCD34D',
          dark:    '#D97706',
        },
        // Legacy
        ink:    '#050B18',
        surface:'#0D1628',
        lime: {
          DEFAULT: '#4A6CF7',
          dark:    '#3B5BDB',
        },
        violet: {
          DEFAULT: '#F59E0B',
          400:     '#FCD34D',
          300:     '#FDE68A',
        },
      },
      boxShadow: {
        'blue-sm': '0 0 20px rgba(74,108,247,0.2)',
        'blue':    '0 0 40px rgba(74,108,247,0.3)',
        'gold-sm': '0 0 20px rgba(245,158,11,0.2)',
        'gold':    '0 0 40px rgba(245,158,11,0.3)',
        // Legacy
        'lime-sm': '0 0 20px rgba(74,108,247,0.2)',
        'lime':    '0 0 40px rgba(74,108,247,0.3)',
      },
      letterSpacing: {
        display: '0.02em',
        wide:    '0.08em',
        wider:   '0.14em',
      },
      backgroundImage: {
        'space-gradient': 'radial-gradient(ellipse at top, #0D1628 0%, #050B18 60%)',
        'blue-gradient':  'linear-gradient(135deg, #4A6CF7 0%, #3B5BDB 100%)',
        'gold-gradient':  'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
        'hero-gradient':  'radial-gradient(ellipse at 30% 50%, rgba(74,108,247,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 20%, rgba(245,158,11,0.1) 0%, transparent 50%)',
      },
    },
  },
  plugins: [],
};
