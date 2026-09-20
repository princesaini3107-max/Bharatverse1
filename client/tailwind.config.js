/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // BharatVerse heritage palette — indigo ink, saffron/marigold accent,
        // temple-stone neutrals and a peacock teal for interactive highlights.
        ink: {
          DEFAULT: '#1E1B3A',
          soft: '#3A3560',
        },
        saffron: {
          50: '#FFF7ED',
          100: '#FFEAD1',
          200: '#FCD9A8',
          300: '#F8BE6E',
          400: '#F2A03C',
          500: '#E4841B',
          600: '#C56A10',
          700: '#9C5210',
        },
        peacock: {
          50: '#ECFBF7',
          100: '#CFF3E9',
          200: '#9FE6D5',
          400: '#2BB49A',
          500: '#0E9C86',
          600: '#0A7A6A',
        },
        rose: {
          heritage: '#B23A63',
        },
        sand: {
          50: '#FBF7F0',
          100: '#F5EDDF',
          200: '#E9DCC5',
          300: '#D8C6A5',
        },
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(30,27,58,.05), 0 10px 30px rgba(30,27,58,.08)',
        lift: '0 12px 40px rgba(30,27,58,.16)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};
