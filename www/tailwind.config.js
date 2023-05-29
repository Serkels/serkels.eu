//

module.exports = {
  ...require("@1/tailwindcss-config/tailwind.config.js"),
  content: [
    "./src/**/*.{ts,tsx}",
    "../@1/ui/{components,domains,helpers,icons,shell}/**/*.{ts,tsx}",
  ],
};
