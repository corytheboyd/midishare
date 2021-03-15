// https://tailwindcss.com/docs/configuration
module.exports = {
  purge: ["./src/**/*.tsx", "./src/**/*.html"],
  plugins: [require("tailwindcss-filters")],
  theme: {
    filter: {
      none: "none",
      grayscale: "grayscale(1)",
      invert: "invert(1)",
      sepia: "sepia(1)",
    },
    backdropFilter: {
      none: "none",
      blur: "blur(20px)",
    },
  },
  variants: {
    filter: ["responsive"],
    backdropFilter: ["responsive"],
    opacity: ["disabled"],
  },
};
