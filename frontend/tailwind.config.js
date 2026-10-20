/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1A24",
        surface: "#142430",
        "surface-raised": "#1B303F",
        border: "#24404F",
        coral: {
          DEFAULT: "#FF7A59",
          soft: "#FF9A80",
        },
        amber: {
          DEFAULT: "#FFB454",
          soft: "#FFCB85",
        },
        horizon: {
          DEFAULT: "#6FC3DF",
          soft: "#9BD8EA",
        },
        ink2: "#86A0AD",
      },
      fontFamily: {
        display: ["'Bricolage Grotesque'", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
    },
  },
  plugins: [],
};
