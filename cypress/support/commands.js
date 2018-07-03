const exampleMock = require('../fixtures/ui-fixtures/example.js');

Cypress.Commands.add('useMocks', () => {
  cy.server({ matchBase: false });
  cy.route(/test-cors/, exampleMock);
});