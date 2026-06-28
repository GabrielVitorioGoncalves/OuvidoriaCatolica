declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, senha: string): Chainable<void>;
    }
  }
}

Cypress.Commands.add("login", (email: string, senha: string) => {
  cy.visit("/");

  cy.get("input")
    .first()
    .clear()
    .type(email);

  cy.get('input[type="password"]')
    .clear()
    .type(senha);

  cy.contains("Entrar").click();
});

export {};