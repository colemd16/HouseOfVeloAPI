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
          dark: '#9a8440',
        },
        velo: {
          red: '#B91C1C',
          'red-hover': '#991515',
          'red-light': 'rgba(185, 28, 28, 0.2)',
          black: '#0A0A0A',
          dark: '#111111',
          darker: '#050505',
          gray: '#333333',
          'gray-light': '#1a1a1a',
          'light-gray': '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Oswald', 'Impact', 'sans-serif'],
      },
      boxShadow: {
        'velo': '0 4px 12px rgba(0, 0, 0, 0.3)',
        'velo-hover': '0 10px 24px rgba(0, 0, 0, 0.5)',
        'gold': '0 4px 12px rgba(196, 169, 98, 0.4)',
        'gold-hover': '0 8px 20px rgba(196, 169, 98, 0.6)',
        'gold-glow': '0 0 30px rgba(196, 169, 98, 0.5)',
        'red': '0 12px 40px rgba(185, 28, 28, 0.8)',
        'red-glow': '0 0 30px rgba(185, 28, 28, 0.5)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(ellipse at center, var(--tw-gradient-stops))',
        'gradient-dark': 'linear-gradient(180deg, #0A0A0A 0%, #111111 50%, #0A0A0A 100%)',
        'hero-gradient': 'linear-gradient(180deg, rgba(10,10,10,0.6) 0%, rgba(10,10,10,0.9) 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'slide-up': 'slide-up 0.6s ease-out forwards',
        'slide-down': 'slide-down 0.6s ease-out forwards',
        'fade-in': 'fade-in 0.8s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'bounce-slow': 'bounce-slow 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'glow-pulse': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(196, 169, 98, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(196, 169, 98, 0.6)' },
        },
        'slide-up': {
          '0%': { transform: 'translateY(40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'slide-down': {
          '0%': { transform: 'translateY(-40px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        'bounce-slow': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(8px)' },
        },
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      addUtilities({
        '.text-shadow': {
          'text-shadow': '1px 1px 6px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-lg': {
          'text-shadow': '2px 2px 8px rgba(0, 0, 0, 0.8)',
        },
        '.text-shadow-gold': {
          'text-shadow': '0 0 20px rgba(196, 169, 98, 0.5)',
        },
        '.glass': {
          'backdrop-filter': 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
          'background': 'rgba(10, 10, 10, 0.8)',
        },
        '.glass-light': {
          'backdrop-filter': 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
          'background': 'rgba(255, 255, 255, 0.05)',
        },
      })
    }
  ],
}
