//

import { with_ui } from "@1.ui/react/tailwind.config.ts";

//

const config = with_ui({
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/@1/ui/react/src/**/*.{ts,tsx}",
  ],
});

export default config;
