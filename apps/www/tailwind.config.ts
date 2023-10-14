//

import base from "@1.config/tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

export default {
  presets: [resolveConfig(base)],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  plugins: [],
};
