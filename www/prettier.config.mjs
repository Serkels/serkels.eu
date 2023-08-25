//

/** @type {import("prettier").Options} */
const config = {
  plugins: [
    "prettier-plugin-tailwind-styled-components",
    "prettier-plugin-tailwindcss",
  ],
  tailwindFunctions: ["clsx", "tv", "tw"],
};

export default config;
