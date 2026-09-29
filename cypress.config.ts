import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on) {
      on("before:browser:launch", (browser, launchOptions) => {
        if (browser.family === "chromium" && browser.name !== "electron") {
          launchOptions.args.push("--force-device-scale-factor=1");
          launchOptions.args.push("--window-size=1400,1000");
        }
        return launchOptions;
      });
    },
    baseUrl: process.env.CYPRESS_BASE_URL ?? "http://127.0.0.1:3456",
    specPattern: "cypress/e2e/**/*.cy.ts",
    supportFile: "cypress/support/e2e.ts",
    video: false,
    screenshotOnRunFailure: true,
    viewportWidth: 1280,
    viewportHeight: 800,
    defaultCommandTimeout: 10000,
  },
});
