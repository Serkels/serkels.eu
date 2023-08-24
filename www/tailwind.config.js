//

const config = require("@1/tailwindcss-config/tailwind.config.js");
module.exports = {
  ...config,
  content: [
    "./src/**/*.{ts,tsx}",
    "../@1/ui/{components,domains,helpers,icons,shell,theme}/**/*.{ts,tsx}",
  ],
  plugins: [...config.plugins],
};
