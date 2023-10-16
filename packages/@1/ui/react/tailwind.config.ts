//

import base from "@1.config/tailwindcss";
import { withTV } from "tailwind-variants/transformer";
import type { Config } from "tailwindcss";

//

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: base.theme,
  },
  plugins: [],
} satisfies Config;

export default withTV(config);
