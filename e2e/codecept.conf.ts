import { setCommonPlugins, setHeadlessWhen } from "@codeceptjs/configure";
// turn on headless mode when running with HEADLESS=true environment variable
// export HEADLESS=true && npx codeceptjs run
setHeadlessWhen(process.env.HEADLESS);

// enable all common plugins https://github.com/codeceptjs/configure#setcommonplugins
setCommonPlugins();

export const config: CodeceptJS.MainConfig = {
  tests: "./*_test.ts",
  output: "./output",
  fullPromiseBased: true,
  helpers: {
    Playwright: {
      url: "http://localhost:3000",
      show: true,
      browser: "chromium",
    },
    JSONResponse: {
      requestHelper: "Playwright",
    },
  },
  include: {},
  mocha: {},
  bootstrap: null,
  timeout: null,
  teardown: null,
  hooks: [],
  gherkin: {
    features: "./features/*.feature",
    steps: ["./src/step_definitions/steps.ts"],
  },
  plugins: {
    screenshotOnFail: {
      enabled: true,
    },
  },
  stepTimeout: 0,
  stepTimeoutOverride: [
    {
      pattern: "wait.*",
      timeout: 0,
    },
    {
      pattern: "amOnPage",
      timeout: 0,
    },
  ],
  name: "e2e",
};
