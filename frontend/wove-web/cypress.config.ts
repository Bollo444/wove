import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000', // Assuming local dev server runs on port 3000
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.ts',
    setupNodeEvents(on, config) {
      // implement node event listeners here
      // (e.g., for tasks, plugins)
    },
    // Viewport settings for responsive testing
    viewportWidth: 1280,
    viewportHeight: 720,
    // Default command timeout
    defaultCommandTimeout: 10000, // 10 seconds
    // Video recording on failure (can be true or path)
    video: false,
    // Screenshots on failure
    screenshotOnRunFailure: true,
  },

  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
    specPattern: 'src/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/component.ts',
  },
});
