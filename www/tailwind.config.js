//

const config = require("@1/tailwindcss-config/tailwind.config.js");

module.exports = {
  ...config,
  content: ["app/**/*.{ts,tsx}", "../@1/ui/shell/**/*.{ts,tsx}"],
};
