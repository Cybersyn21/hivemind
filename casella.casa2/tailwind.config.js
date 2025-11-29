/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#c29541',
        secondary: '#a07c34',
        accent: '#856826',
        dark: '#1e293b',
        light: '#f8fafc',
        gold: '#FFD700',
        emerald: '#25D366'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif']
      }
    },
  },
  plugins: [],
}
