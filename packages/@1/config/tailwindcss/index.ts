//

import TailwindcssConfig from "@douglasduteil/config...tailwindcss";
import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";
import type { KeyValuePair, ResolvableTo } from "tailwindcss/types/config";

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
  "secondary-blue-gradient": `
    linear-gradient(
      38deg,
      #00adee 0%,
      ${Congress_Blue} 100%
    )
  `,
};

//

const height: ResolvableTo<KeyValuePair<string, string>> = ({ theme }) => ({
  "@footer": theme("spacing.24"),
  "@footer/desktop": theme("spacing.8"),
  "@main": `calc(100dvh - ${theme("spacing.16")} - ${theme("spacing.16")})`,
  "@main/desktop": `calc(100dvh - ${theme("spacing.16")} - ${theme("spacing.8")})`,
  "@navbar": theme("spacing.16"),
});

export default {
  presets: [TailwindcssConfig],
  content: [],
  theme: {
    backgroundImage,
    colors,
    height,
    maxHeight: height,
    minHeight: height,
  },
  plugins: [typography()],
  // plugins: [custom_icon_set(resolve(__dirname, "icons"))],
} satisfies Config;
