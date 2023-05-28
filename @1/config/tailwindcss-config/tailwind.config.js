//

const defaultTheme = require("tailwindcss/defaultTheme");

//

const Cerulean = "#04AAE8";
const Cerulean_Dark = "#04AAE8";

const Eminence = "#782D8E";
const Chateau_Green = "#39b154";

const RedViolet = "#CE118B";
const RedViolet_Dark = "#C91489";

/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: "jit",
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        Cerulean,
        Eminence,
        RedViolet,
        Chateau_Green,
      },
      backgroundImage: {
        "primary-gradient": `
          linear-gradient(
            52deg,
            ${Cerulean_Dark} 0%,
            ${Eminence} 46%,
            ${RedViolet_Dark} 100%
          )
        `,
      },
    },
  },
  plugins: [],
};
