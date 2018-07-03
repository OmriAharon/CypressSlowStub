describe('simple block', function () {
  beforeEach(function () {
    cy.useMocks();
    cy.visit('/');
  });

  it('should stub fast', function () {
    cy.get('[data-cy="Test"]');
  });
});