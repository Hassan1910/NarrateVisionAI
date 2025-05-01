/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          light: 'var(--primary-light)',
          dark: 'var(--primary-dark)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          light: 'var(--accent-light)',
          dark: 'var(--accent-dark)',
        },
      },
      animation: {
        'kenBurns': 'kenBurns 20s ease-in-out infinite',
        'slowZoom': 'slowZoom 15s ease-in-out infinite alternate',
        'panLeft': 'panLeft 15s ease-in-out infinite',
        'panRight': 'panRight 15s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}
