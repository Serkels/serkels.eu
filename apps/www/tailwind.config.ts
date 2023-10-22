//

import { root as exchange_ui_root } from "@1.modules/exchange.ui/tailwind.config.ts";
import { root as forum_ui_root } from "@1.modules/forum.ui/tailwind.config.ts";
import { root as opportunity_ui_root } from "@1.modules/opportunity.ui/tailwind.config.ts";
import { root as profile_ui_root } from "@1.modules/profile.ui/tailwind.config.ts";
import { root as ui_root, with_ui } from "@1.ui/react/tailwind.config.ts";
import { join, relative } from "node:path";

//

const config = with_ui({
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ...[
      exchange_ui_root,
      forum_ui_root,
      opportunity_ui_root,
      profile_ui_root,
    ].map((ui_module_root) =>
      join(relative(__dirname, ui_module_root), "./src/**/*.{ts,tsx}"),
    ),
    join(relative(__dirname, ui_root), "./src/**/*.{ts,tsx}"),
  ],
});
export default config;
