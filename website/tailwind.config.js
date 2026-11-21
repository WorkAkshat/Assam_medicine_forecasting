/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Theme: Deep Navy Blue (Executive, clinical, authoritative pharmaceutical palette)
        navy: {
          50: '#F0F5FA',  // Softest ice-blue tint for light surfaces & badges
          100: '#DFEAF5', // Light slate blue border & container accent
          200: '#BFD5ED', // Subtle sky-slate for pills & borders
          300: '#8EB5DE', // Muted steel blue
          400: '#5A8FCB', // Refined clinical slate blue
          500: '#2E6BB3', // Vibrant medical blue
          600: '#23528F', // Rich corporate sapphire
          700: '#1A3D6D', // Deep royal navy
          800: '#122B4E', // Midnight navy
          850: '#0E2340', // Rich dark navy gradient stop
          900: '#0A192F', // Signature Deep Navy Blue (hero banners, dark cards)
          950: '#050E1C', // Obsidian navy (darkest gradient stop & footer)
        },
        // Forest mapped directly to Deep Navy Blue for universal consistency
        forest: {
          50: '#F0F5FA',
          100: '#DFEAF5',
          200: '#BFD5ED',
          300: '#8EB5DE',
          400: '#5A8FCB',
          500: '#2E6BB3',
          600: '#23528F',
          700: '#1A3D6D',
          800: '#122B4E',
          850: '#0E2340',
          900: '#0A192F', // Exact signature Deep Navy Blue
          950: '#050E1C', // Obsidian dark navy
        },
        // Warm White & Soft Ivory Clean Backgrounds
        cream: {
          50: '#FAFBFD',  // Clean porcelain warm white (page body)
          100: '#F4F6F9', // Soft ivory pearl
          200: '#E9EDF2',
          300: '#DCE2EA',
          400: '#CAD2DE',
        },
        // Light Blue & Subtle Neutral Shades for Cards & Secondary Elements
        sage: {
          50: '#F1F6FA',  // Soft ice blue
          100: '#E4EDF5', // Soft clinical blue container
          200: '#D0E0EF',
          300: '#B2CCE3',
        },
        ice: {
          50: '#F8FAFC',
          100: '#F0F5FA',
          200: '#E2ECF5',
          300: '#C8DBEE',
        },
        // Accent: Warm Terracotta Orange (Complements GRD Red Logo & Navy)
        terracotta: {
          50: '#FDF6F0',
          100: '#FAECE1',
          200: '#F5D6C2',
          300: '#EDB597',
          400: '#E28761',
          500: '#C85A2E', // Primary CTA button & active indicator
          600: '#B5481F', // Hover state
          700: '#963717',
          800: '#7A2D14',
          900: '#642613',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(10, 25, 47, 0.06)',
        'card-hover': '0 12px 30px -4px rgba(10, 25, 47, 0.12)',
        'soft': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'navy': '0 10px 30px -5px rgba(10, 25, 47, 0.25)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
