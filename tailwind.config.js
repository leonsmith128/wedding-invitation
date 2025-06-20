module.exports = {
  content: [
    "./*.html",
    "./**/*.html",
    "./*.js",
    "./**/*.js",
  ],
  theme: {
    extend: {
        fontFamily: {
            poppins: ['Poppins', 'sans-serif'],
      },
    },
  },
  
  plugins: [
    require('@tailwindcss/aspect-ratio'),
    require('tailwind-scrollbar'),
    require('tailwind-scrollbar-hide'),
  ],
}