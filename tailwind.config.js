/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg-color, #323437)',
        'bg-secondary': 'var(--bg-secondary, #2c2e31)',
        main: 'var(--main-color, #e2b714)',
        caret: 'var(--caret-color, #e2b714)',
        text: 'var(--text-color, #d1d0c5)',
        sub: 'var(--sub-color, #646669)',
        'sub-alt': 'var(--sub-alt-color, #2c2e31)',
        error: 'var(--error-color, #ca4754)',
        accent: 'var(--main-color, #e2b714)',
      },
      fontFamily: {
        mono: ['Roboto Mono', 'ui-monospace', 'monospace'],
        sans: ['Roboto', 'ui-sans-serif', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulse-subtle 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.3s ease-out',
        'bounce-gentle': 'bounce-gentle 0.5s ease-in-out',
      },
      keyframes: {
        'pulse-subtle': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        'slide-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'bounce-gentle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
}
