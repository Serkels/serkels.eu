//

const config = require("@1/tailwindcss-config/tailwind.config.js");

module.exports = {
  ...config,
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "../01/ui/{components,domains,helpers,icons,shell,theme}/**/*.{ts,tsx}",
  ],
  plugins: [...config.plugins],
};
