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
        cyber: {
          900: '#0a0f1c', // Deep dark blue background
          800: '#111827', // Card background
          700: '#1f2937', // Hover state
          600: '#374151', // Borders
          green: '#10b981', // Safe
          red: '#ef4444', // Phishing
          yellow: '#f59e0b', // Suspicious
          blue: '#3b82f6', // Accents
          purple: '#8b5cf6', // Accents
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
