/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // important pour le mode sombre via la classe "dark"
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {keyframes: {
        'fade-slide': {
          '0%': { opacity: 0, transform: 'translateY(20px) scale(0.95)' },
          '100%': { opacity: 1, transform: 'translateY(0) scale(1)' },
        }
      },
      animation: {
        'fade-slide': 'fade-slide 0.3s ease-out forwards',
      },},
  },
  plugins: [],
}


