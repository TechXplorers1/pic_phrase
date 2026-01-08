/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        game: {
          bg: '#0B0E14', // Deepest Void
          card: '#151923', // Void Layer
          surface: '#2A303C', // Lighter Surface
          primary: '#6366f1', // Indigo 500 (Vibrant)
          primaryHover: '#4f46e5', // Indigo 600
          secondary: '#ec4899', // Pink 500 (Neon)
          accent: '#06b6d4', // Cyan 500 (Electric)
          text: '#f8fafc', // Slate 50
          muted: '#94a3b8', // Slate 400
          success: '#10b981', // Emerald 500
          error: '#ef4444', // Red 500
          gold: '#f59e0b', // Amber 500
        },
        difficulty: {
          easy: '#22c55e',
          medium: '#f59e0b',
          hard: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['"Outfit"', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shine': 'shine 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shine: {
          'from': { backgroundPosition: '0 0' },
          'to': { backgroundPosition: '-200% 0' },
        }
      }
    },
  },
  plugins: [],
}
