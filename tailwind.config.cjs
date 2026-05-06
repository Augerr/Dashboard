module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "768px",
      md: "1024px",
      lg: "1280px",
      xl: "1536px",
      '2xl': "1920px",
      '3xl': "2560px",
      '4xl': "3840px",

      "below-tablet": { max: "767px" },
      "below-kiosk": { max: "1023px" },
      "below-tv": { max: "1919px" },
    },
    extend: {},
  },
  plugins: [],
}