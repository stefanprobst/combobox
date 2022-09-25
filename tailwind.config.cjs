const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.@(css|ts|tsx)"],
  theme: {
    extend: {
      colors: {
        neutral: { 0: colors.white, ...colors.slate, 1000: colors.black },
        primary: colors.pink,
      },
      zIndex: {
        overlay: "100",
      },
    },
  },
  plugins: [require("@headlessui/tailwindcss")],
};
