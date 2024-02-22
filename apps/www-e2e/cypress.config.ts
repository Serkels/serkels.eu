//

import { addCucumberPreprocessorPlugin } from "@badeball/cypress-cucumber-preprocessor";
import { createEsbuildPlugin } from "@badeball/cypress-cucumber-preprocessor/esbuild";
import createBundler from "@bahmutov/cypress-esbuild-preprocessor";
import { defineConfig } from "cypress";
import { fileURLToPath } from "node:url";

//

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    reporter: fileURLToPath(
      await import.meta.resolve(
        "@badeball/cypress-cucumber-preprocessor/pretty-reporter",
      ),
    ),
    setupNodeEvents,
    specPattern: "**/*.feature",
    supportFile: false,
  },
  video: true,
});

//

async function setupNodeEvents(
  on: Cypress.PluginEvents,
  config: Cypress.PluginConfigOptions,
) {
  await addCucumberPreprocessorPlugin(on, config);

  on(
    "file:preprocessor",
    createBundler({
      plugins: [createEsbuildPlugin(config)],
    }),
  );

  return config;
}
