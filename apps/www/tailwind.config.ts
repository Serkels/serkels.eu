//

import { root as exchange_ui_root } from "@1.modules/exchange.ui/tailwind.config.ts";
import { root as forum_ui_root } from "@1.modules/forum.ui/tailwind.config.ts";
import { root as opportunity_ui_root } from "@1.modules/opportunity.ui/tailwind.config.ts";
import { root as profile_ui_root } from "@1.modules/profile.ui/tailwind.config.ts";
import { with_ui } from "@1.ui/react/tailwind.config.ts";
import { join, relative } from "node:path";

//

const config = with_ui({
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "../../packages/__legacy__/ui/{components,domains,helpers,icons,shell,theme}/**/*.{ts,tsx}",
    "../../packages/__legacy__/www/src/**/*.{ts,tsx}",
    ...[
      exchange_ui_root,
      forum_ui_root,
      opportunity_ui_root,
      profile_ui_root,
    ].map((ui_module_root) =>
      join(relative(__dirname, ui_module_root) + "/src/**/*.{ts,tsx}"),
    ),
    "../../packages/@1/ui/react/src/**/*.{ts,tsx}",
  ],
});
export default config;
