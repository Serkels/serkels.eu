//

import base from "@1.config/tailwindcss";
import { withTV } from "tailwind-variants/transformer";
import type { Config } from "tailwindcss";

//

export const root = __dirname;

const config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: base.theme,
  },
  plugins: [],
} satisfies Config;

export const with_ui = (tailwindConfig: Config) => {
  return withTV({ ...config, ...tailwindConfig });
};

export default withTV(config);
