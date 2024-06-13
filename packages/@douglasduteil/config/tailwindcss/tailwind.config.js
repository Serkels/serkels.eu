//

const plugin = require("tailwindcss/plugin");

const { withTV } = require("tailwind-variants/transformer");

//

const Bittersweet = "#FF5F5F";
const Cerulean = "#04AAE8";
const Chateau_Green = "#39b154";
const Congress_Blue = "#023f87";
const Dove_Gray = "#656565";
const Eminence = "#782D8E";
const Gamboge = "#E3A007";
const Guardsman_Red = "#C10000";
const RedViolet = "#CE118B";
const RedViolet_Dark = "#C91489";
const Silver_Chalice = "#AAAAAA";
const Violet_Eggplant = "#AA1E8B";

//

const COLUMNS_SIZE = 77;
const GAP_SIZE = 35;

//

/** @type {import('tailwindcss').Config} */
module.exports = withTV({
  theme: {
    extend: {
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1536px",

        // xs: 0,
        // sm: 576px,
        // md: 768px,
        // lg: 992px,
        // xl: 1200px,
        // xxl: 1400px
      },
      colors: {
        Bittersweet,
        Cerulean,
        Chateau_Green,
        Congress_Blue,
        Dove_Gray,
        Eminence,
        Gamboge,
        RedViolet,
        Silver_Chalice,
        Violet_Eggplant,
        //
        primary: Chateau_Green,
        secondary: Cerulean,
        tertiary: Congress_Blue,
        quaternary: Eminence,
        quinary: RedViolet,
        //
        error: Guardsman_Red,
        success: Chateau_Green,
        warning: Gamboge,
        danger: Bittersweet,
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
        "primary-gradient-74": `
          linear-gradient(
            74deg,
            ${Cerulean} 0%,
            ${Eminence} 52%,
            ${RedViolet_Dark} 100%
          )
        `,
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
            ${Cerulean} -20%,
            ${Eminence} 40%,
            ${Violet_Eggplant} 100%
          )
        `,
      },
      opacity: {
        45: "0.45",
      },

      boxShadow: {
        primary: "5px 5px 10px #7E7E7E33",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    plugin(function ({ addBase, addComponents, addVariant, theme }) {
      addBase({
        html: { fontSize: "14px" },
      });
      addComponents({
        ".icon": {
          backgroundColor: "currentColor",
          color: "inherit",
          backgroundSize: "100% 100%",
          mask: "var(--tw-icon) no-repeat",
        },
      });
      addVariant("search-cancel", "&::-webkit-search-cancel-button");
    }),
  ],
});
