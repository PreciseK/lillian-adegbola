/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'dancing': ['Dancing Script', 'cursive'],
      },
      colors: {
        navy: {
          600: '#0A4B66',
          700: '#064A5B',
          800: '#032B44',
          900: '#001f33'
        },
        gold: {
          400: '#F8E231',
          500: '#FFD700',
          600: '#DAA520'
        },
        luxury: {
          cream: '#FDF6E3',
          pearl: '#F8F6F0',
          charcoal: '#2C2C2C'
        },
        emerald: {
          500: '#10b981',
          600: '#059669'
        },
        teal: {
          600: '#0d9488'
        },
        purple: {
          500: '#8b5cf6',
          600: '#7c3aed'
        },
        indigo: {
          600: '#4f46e5'
        },
        orange: {
          500: '#f97316'
        },
        red: {
          500: '#ef4444'
        },
        pink: {
          500: '#ec4899',
          600: '#db2777'
        },
        rose: {
          600: '#e11d48'
        },
        cyan: {
          500: '#06b6d4'
        },
        blue: {
          600: '#2563eb'
        }
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #032B44 0%, #001f33 50%, #2C2C2C 100%)',
        'gold-gradient': 'linear-gradient(135deg, #FFD700 0%, #F8E231 50%, #DAA520 100%)',
        'pearl-gradient': 'linear-gradient(135deg, #FDF6E3 0%, #F8F6F0 100%)'
      },
      spacing: {
        '60': '15rem',
        '70': '17.5rem',
        '18': '4.5rem'
      },
      screens: {
        'xs': '375px',
      },
      maxWidth: {
        'xs': '20rem',
      }
    },
  },
  plugins: [],
}