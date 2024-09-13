//

import tailwindcss from "@douglasduteil/config...tailwindcss/prettier.config.mjs";
import base from "./index.js";

//

/** @type {import("prettier").Config} */
const config = {
  ...base,
  ...tailwindcss,
  plugins: [...base.plugins, ...tailwindcss.plugins],
};

export default config;
