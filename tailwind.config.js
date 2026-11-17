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
        luxury: {
          obsidian: "#111111",
          black: "#111111",
          gold: "#B89A6A",
          goldHover: "#CDB388",
          goldDark: "#947A4F",
          ivory: "#F5F2EC",
          stone: "#EAE5DC",
          charcoal: "#242321",
          muted: "#85817A",
          border: "#DED9D0",
          borderDark: "#2B2A27",
          darkBg: "#111111",
          darkCard: "#191817",
        },
      },
      fontFamily: {
        serif: ["'Cormorant Garamond'", "'Playfair Display'", "Georgia", "serif"],
        sans: ["'Inter'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        display: ["'Playfair Display'", "'Cormorant Garamond'", "serif"],
      },
      letterSpacing: {
        widestLuxury: "0.22em",
        megaLuxury: "0.32em",
      },
      boxShadow: {
        luxury: "0 10px 30px -10px rgba(0, 0, 0, 0.35)",
        goldGlow: "0 0 20px rgba(184, 154, 106, 0.2)",
      },
    },
  },
  plugins: [],
};
