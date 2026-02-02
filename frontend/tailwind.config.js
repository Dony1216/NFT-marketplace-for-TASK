export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  plugins: [],

  theme: {
  extend: {
    keyframes: {
      fadeIn: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
      scaleIn: {
        "0%": { opacity: 0, transform: "scale(0.95)" },
        "100%": { opacity: 1, transform: "scale(1)" },
      },
    },
animation: {
  fadeIn: "fadeIn 1s ease-out forwards",
  scaleIn: "scaleIn 0.8s ease-out forwards",
},

  },
},

}
