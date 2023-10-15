//

import base from "@1.config/tailwindcss";
import resolveConfig from "tailwindcss/resolveConfig";

export default {
  presets: [resolveConfig(base)],
  content: ["./src/**/*.{ts,tsx}"],
  plugins: [],
};
