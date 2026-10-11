/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        wardog: {
          bg: '#0a0a0c',
          panel: '#111114',
          panelHover: '#16161a',
          border: '#222327',
          gold: '#c89b3c',
          goldHover: '#dfae4b',
          green: '#1b431e',
          alertRed: '#5c1414',
          muted: '#72757d',
        },
      },
      backgroundImage: {
        'grid-mesh': "linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
}
