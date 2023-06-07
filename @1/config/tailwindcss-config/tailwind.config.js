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
const Chateau_Green = "#39b154";
const Congress_Blue = "#023f87";
const Eminence = "#782D8E";
const RedViolet = "#CE118B";
const RedViolet_Dark = "#C91489";
const Violet_Eggplant = "#AA1E8B";

//

const COLUMNS_SIZE = 77;
const GAP_SIZE = 35;

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
        Violet_Eggplant,
      },
      width: {
        "cols-6": `${COLUMNS_SIZE * 6 + GAP_SIZE * 5}px`,
        "cols-3": `${COLUMNS_SIZE * 3 + GAP_SIZE * 2}px`,
      },
      maxWidth: {
        "cols-3": `${COLUMNS_SIZE * 3 + GAP_SIZE * 2}px`,
        "cols-6": `${COLUMNS_SIZE * 6 + GAP_SIZE * 5}px`,
      },
      gridTemplateColumns: {
        "2-holy-grail": `${COLUMNS_SIZE * 3}px minmax(600px, 1fr)`,
        "holy-grail-ish": "300px minmax(600px, 1fr)",
        "holy-grail": "auto 1fr auto",
      },
      backgroundImage: {
        "i-binoculars": `url("data:image/svg+xml;utf8,${encodeSvgForCss(
          svg
        )}")`,
        "secondary-blue-gradient": `
          linear-gradient(
            38deg,
            #00adee 0%,
            ${Congress_Blue} 100%
          )
        `,
        "primary-gradient": `
          linear-gradient(
            52deg,
            ${Cerulean} 0%,
            ${Eminence} 46%,
            ${RedViolet_Dark} 100%
          )
        `,
        "primary-gradient-large": `
          linear-gradient(
            41deg,
            ${Cerulean} 0%,
            ${Eminence} 52%,
            ${Violet_Eggplant} 91%,
            ${RedViolet_Dark} 100%
          )
        `,
      },

      boxShadow: {
        primary: "5px 5px 10px #7E7E7E33",
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
          mask: "var(--tw-icon) no-repeat",
        },
      });
    }),
  ],
};
