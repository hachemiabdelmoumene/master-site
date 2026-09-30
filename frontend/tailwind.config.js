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
        background: '#0B0F19',
        surface: {
          light: '#1E293B',
          DEFAULT: '#111827',
          dark: '#0B0F19',
        },
        cyber: {
          green: '#10B981',
          purple: '#8B5CF6',
          amber: '#F59E0B',
          rose: '#F43F5E',
          cyan: '#0EA5E9',
          teal: '#14B8A6',
          fuchsia: '#D946EF',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
