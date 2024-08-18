//

import base from "./index.js";
import tailwindcss from "@douglasduteil/config...tailwindcss/prettier.config.mjs";

//

/** @type {import("prettier").Config} */
const config = {
  ...base,
  ...tailwindcss,
  plugins: [...base.plugins, ...tailwindcss.plugins],
};

export default config;
