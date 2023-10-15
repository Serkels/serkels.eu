//

import base from "@1.config/tailwindcss";
import type { Config } from "tailwindcss";
// import { content } from "@1.ui/react/tailwind.config.ts";
import resolveConfig from "tailwindcss/resolveConfig";

//

export default {
  presets: [resolveConfig(base)],
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/@1/ui/react/src/**/*.{ts,tsx}",
  ],
  plugins: [],
} satisfies Config;
