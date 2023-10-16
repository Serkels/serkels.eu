//

import ui_config from "@1.ui/react/tailwind.config.ts";
import type { Config } from "tailwindcss";

//
const config = {
  ...ui_config,
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/@1/ui/react/src/**/*.{ts,tsx}",
  ],
} satisfies Config;

export default config;
