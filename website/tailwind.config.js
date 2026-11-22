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
          50: '#EEF4F6',  // Softest ice-blue tint for light surfaces & badges
          100: '#D5E3E8', // Light slate blue border & container accent
          200: '#ABC6D0', // Subtle sky-slate for pills & borders
          300: '#7FA5B3', // Muted steel blue
          400: '#548293', // Refined clinical slate blue
          500: '#376475', // Vibrant medical blue
          600: '#284E5D', // Rich corporate sapphire
          700: '#1D3D4A', // Deep royal navy
          800: '#15303B', // Midnight navy
          850: '#112A35', // Rich dark navy gradient stop
          900: '#0E2530', // Signature Deep Navy Blue (hero banners, dark cards)
          950: '#081820', // Obsidian navy (darkest gradient stop & footer)
        },
        // Forest mapped directly to Deep Navy Blue for universal consistency
        forest: {
          50: '#EEF4F6',
          100: '#D5E3E8',
          200: '#ABC6D0',
          300: '#7FA5B3',
          400: '#548293',
          500: '#376475',
          600: '#284E5D',
          700: '#1D3D4A',
          800: '#15303B',
          850: '#112A35',
          900: '#0E2530', // Exact signature Deep Navy Blue
          950: '#081820', // Obsidian dark navy
        },
        // Warm White & Soft Ivory Clean Backgrounds
        cream: {
          50: '#F6F9F8',  // Clean porcelain warm white (page body)
          100: '#EEF3F2', // Soft ivory pearl
          200: '#E1E9E7',
          300: '#CBD8D5',
          400: '#B8C9C5',
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
          100: '#EEF4F6',
          200: '#E2ECF5',
          300: '#C8DBEE',
        },
        muga: {
          50: '#FBF6EA', 100: '#F5E8C7', 200: '#EBD08F', 300: '#DFB559', 400: '#D29C36',
          500: '#C08427', 600: '#A3691F', 700: '#82501C', 800: '#6A411C', 900: '#58371A',
        },
        // Accent: Warm Terracotta Orange (Complements GRD Red Logo & Navy)
        terracotta: {
          50: '#ECF8F7',
          100: '#CDEEEB',
          200: '#9DDDD7',
          300: '#66C5BD',
          400: '#34A89F',
          500: '#0E7570', // Primary CTA button & active indicator
          600: '#0D5E5B', // Hover state
          700: '#0E4B49',
          800: '#0D3E3D',
          900: '#0B3333',
        }
      },
      fontFamily: {
        serif: ['"Familjen Grotesk"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        display: ['"Familjen Grotesk"', '"IBM Plex Sans"', 'system-ui', 'sans-serif'],
        sans: ['"IBM Plex Sans"', 'system-ui', 'sans-serif'],
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
