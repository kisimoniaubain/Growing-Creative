/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"],
      },
      colors: {
        ink: "#204020",
        ocean: "#608020",
        mint: "#a0c040",
        sunrise: "#ec8a27",
        sand: "#fef9e3",
      },
      boxShadow: {
        soft: "0 18px 48px -24px rgba(32, 64, 32, 0.35)",
      },
      backgroundImage: {
        aura: "radial-gradient(circle at 20% 10%, rgba(160, 192, 64, 0.32), transparent 35%), radial-gradient(circle at 80% 0%, rgba(236, 138, 39, 0.3), transparent 30%), linear-gradient(140deg, #204020 18%, #608020 100%)",
      },
    },
  },
  plugins: [],
};
