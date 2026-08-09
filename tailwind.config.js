/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cyber-dark': '#070514',
        'cyber-card': 'rgba(19, 12, 45, 0.65)',
        'cyber-card-light': 'rgba(31, 21, 71, 0.75)',
        'neon-purple': '#8b5cf6',
        'neon-indigo': '#6d28d9',
        'neon-pink': '#ec4899',
        'neon-accent': '#f97316',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(139, 92, 246, 0.25), 0 0 40px rgba(109, 40, 217, 0.15)',
        'neon-sm': '0 0 10px rgba(139, 92, 246, 0.25)',
        'neon-lg': '0 0 35px rgba(168, 85, 247, 0.45), inset 0 0 15px rgba(139, 92, 246, 0.15)',
        'neon-border': '0 0 12px rgba(139, 92, 246, 0.35)',
      },
      fontFamily: {
        sans: ['Vazirmatn', 'Shabnam', 'Tahoma', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
