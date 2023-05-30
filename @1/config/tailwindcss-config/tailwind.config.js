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

const Eminence = "#782D8E";
const Chateau_Green = "#39b154";

const RedViolet = "#CE118B";
const RedViolet_Dark = "#C91489";

/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        Cerulean,
        Eminence,
        RedViolet,
        Chateau_Green,
      },

      gridTemplateColumns: {
        holy: "300px minmax(600px, 1fr) 200px",
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
