//

import { with_ui } from "@1.ui/react/tailwind.config.ts";

//

const config = with_ui({
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/__legacy__/ui/{components,domains,helpers,icons,shell,theme}/**/*.{ts,tsx}",
    "../../packages/__legacy__/www/src/**/*.{ts,tsx}",
    // "../../packages/@1/modules/*/ui/src/**/*.{ts,tsx}",
    "../../packages/@1/modules/exchanges/ui/src/**/*.{ts,tsx}",
    "../../packages/@1/modules/opportunity/ui/src/**/*.{ts,tsx}",
    "../../packages/@1/ui/react/src/**/*.{ts,tsx}",
  ],
});
export default config;
