/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#e2b714',
        background: '#323437',
        'background-secondary': '#2c2e31',
        text: '#d1d5db',
        'text-secondary': '#9ca3af',
        accent: '#e2b714',
      },
    },
  },
  plugins: [],
}
