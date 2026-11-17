/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        elyon: {
          obsidian: "#101010",
          cherry: "#241C1C",
          bordeaux: "#4B171C",
          ivory: "#F2EEE5",
          gold: "#B69A63",
          goldHover: "#CDB388",
          silver: "#85817B",
          border: "#2A2424",
          borderIvory: "#E2DCD1",
        },
        luxury: {
          obsidian: "#101010",
          cherry: "#241C1C",
          bordeaux: "#4B171C",
          black: "#101010",
          gold: "#B69A63",
          goldHover: "#CDB388",
          goldDark: "#947A4F",
          ivory: "#F2EEE5",
          stone: "#EAE5DC",
          charcoal: "#242321",
          muted: "#85817B",
          border: "#2A2424",
          borderDark: "#241C1C",
          darkBg: "#101010",
          darkCard: "#191515",
        },
      },
      fontFamily: {
        serif: ["'Bodoni Moda'", "'Cormorant Garamond'", "Georgia", "serif"],
        display: ["'Bodoni Moda'", "'Cormorant Garamond'", "serif"],
        sans: ["'Manrope'", "'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
      },
      letterSpacing: {
        widestLuxury: "0.22em",
        megaLuxury: "0.32em",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.45)",
        goldGlow: "0 0 24px rgba(182, 154, 99, 0.22)",
        bordeauxGlow: "0 0 24px rgba(75, 23, 28, 0.35)",
      },
    },
  },
  plugins: [],
};
