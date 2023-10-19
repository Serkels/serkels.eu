//

import TailwindcssConfig from "@douglasduteil/config...tailwindcss";
import type { Config } from "tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

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

const colors = {
  //
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
};

//

const backgroundImage = {
  "primary-gradient": `
    linear-gradient(
      52deg,
      ${Cerulean} 0%,
      ${Eminence} 46%,
      ${RedViolet_Dark} 100%
    )
  `,
  "primary-gradient-74": `
    linear-gradient(
      74deg,
      ${Cerulean} 0%,
      ${Eminence} 52%,
      ${RedViolet_Dark} 100%
    )
  `,
};

//

export default {
  presets: [resolveConfig(TailwindcssConfig)],
  content: [],
  theme: {
    backgroundImage,
    colors,
  },
  // plugins: [custom_icon_set(resolve(__dirname, "icons"))],
} satisfies Config;
