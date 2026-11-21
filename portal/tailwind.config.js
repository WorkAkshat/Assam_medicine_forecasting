/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#7E9BB8',
          500: '#5F82A6',
          600: '#456990',
          700: '#2E5279',
          800: '#214369',
          900: '#1A3C66', // Authentic corporate blue, slightly lighter & refined
          950: '#122B4A', // Softer midnight blue with clear blue undertone
        },
        terracotta: {
          50: '#FDF6F0',
          100: '#FAECE1',
          200: '#F4D4C0',
          300: '#EBB498',
          400: '#DF8D67',
          500: '#D36B3D',
          600: '#C85A2E',
          700: '#A64522',
          800: '#86381E',
          900: '#6E311D',
        },
        cream: {
          50: '#FAFBFD',
          100: '#F4F6F9',
          200: '#E8ECF2',
          300: '#D9DFEB',
        },
        grdred: {
          50: '#FEF2F2',
          500: '#DC2626',
          600: '#B91C1C',
          700: '#991B1B',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        mono: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        '2xs': '0 1px 2px 0 rgba(15, 23, 42, 0.04)',
        card: '0 1px 3px 0 rgba(15, 37, 68, 0.05), 0 1px 2px -1px rgba(15, 37, 68, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(15, 37, 68, 0.08), 0 4px 6px -4px rgba(15, 37, 68, 0.04)',
        drawer: '-10px 0 25px -5px rgba(10, 25, 47, 0.15)',
      }
    },
  },
  plugins: [],
};
