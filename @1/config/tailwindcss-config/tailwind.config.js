//

const {
  encodeSvgForCss,
} = require("@iconify/utils/lib/svg/encode-svg-for-css");
const plugin = require("tailwindcss/plugin");

const defaultTheme = require("tailwindcss/defaultTheme");

const path = require("path");
const fs = require("fs");
const svgPath = path.resolve(__dirname, "./icons/binoculars.svg");
const svg = fs.readFileSync(svgPath, "utf8");

//

const Cerulean = "#04AAE8";
const Cerulean_Dark = "#04AAE8";
const Chateau_Green = "#39b154";
const Congress_Blue = "#023f87";
const Eminence = "#782D8E";
const RedViolet = "#CE118B";
const RedViolet_Dark = "#C91489";

//

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        Cerulean,
        Chateau_Green,
        Congress_Blue,
        Eminence,
        RedViolet,
      },

      gridTemplateColumns: {
        "holy-grail-ish": "300px minmax(600px, 1fr)",
        "holy-grail": "auto 1fr auto",
      },
      backgroundImage: {
        "i-binoculars": `url("data:image/svg+xml;utf8,${encodeSvgForCss(
          svg
        )}")`,
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
  plugins: [
    plugin(function ({ addComponents, theme }) {
      addComponents({
        ".icon": {
          backgroundColor: "currentColor",
          color: "inherit",
          backgroundSize: "100% 100%",
          mask: "var(--un-icon) no-repeat",
        },
      });
    }),
  ],
};
