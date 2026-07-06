const { defineConfig } = require('cypress');

module.exports = defineConfig({
  // Variáveis de ambiente acessíveis nos testes via Cypress.env('<chave>')
  env: {
    apiBaseUrl: 'https://serverest.dev',
  },
  e2e: {
    // URL base do frontend (usada por cy.visit com caminhos relativos)
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    fixturesFolder: 'cypress/fixtures',
    screenshotOnRunFailure: true,
    video: true,
    defaultCommandTimeout: 10000,
    requestTimeout: 15000,
    responseTimeout: 15000,
    viewportWidth: 1280,
    viewportHeight: 720,
    setupNodeEvents(on, config) {
      // Garante o fallback de apiBaseUrl caso não venha do bloco env
      config.env.apiBaseUrl = config.env.apiBaseUrl || 'https://serverest.dev';
      return config;
    },
  },
  // O cypress-multi-reporters garante que múltiplos specs gerem um
  // relatório consolidado pelo Mochawesome (sem conflito de JSON).
  reporter: 'cypress-multi-reporters',
  reporterOptions: {
    reporterEnabled: 'mochawesome',
    mochawesomeReporterOptions: {
      reportDir: 'cypress/reports/mocha',
      overwrite: false,
      html: false,
      json: true,
    },
  },
});
