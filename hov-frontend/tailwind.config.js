/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // House of Velo Brand Colors
        gold: {
          DEFAULT: '#C4A962',
          hover: '#b39852',
          light: 'rgba(196, 169, 98, 0.15)',
        },
        velo: {
          red: '#B91C1C',
          'red-hover': '#991515',
          black: '#0A0A0A',
          gray: '#333333',
          'light-gray': '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Arial', 'sans-serif'],
      },
      boxShadow: {
        'velo': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'velo-hover': '0 10px 24px rgba(0, 0, 0, 0.5)',
        'gold': '0 4px 12px rgba(196, 169, 98, 0.4)',
        'gold-hover': '0 8px 20px rgba(196, 169, 98, 0.6)',
        'red': '0 12px 40px rgba(185, 28, 28, 0.8)',
      },
    },
  },
  plugins: [],
}
