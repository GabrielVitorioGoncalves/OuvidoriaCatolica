describe("API de Login", () => {

  beforeEach(() => {
    cy.visit("/");
  });

  it("Deve chamar o endpoint de login", () => {

    cy.intercept("POST", "**/auth/login").as("login");

    cy.get("input").first().type("teste@teste");
    cy.get('input[type="password"]').type("teste");

    cy.contains("Entrar").click();

    cy.wait("@login");

  });

  it("Deve retornar HTTP 200 para login válido", () => {

    cy.intercept("POST", "**/auth/login").as("login");

    cy.login("teste@teste", "teste");

    cy.wait("@login")
      .its("response.statusCode")
      .should("eq", 200);

  });

  it("Deve retornar erro para login inválido", () => {

    cy.intercept("POST", "**/auth/login").as("login");

    cy.login("usuario@teste.com", "123456");

    cy.wait("@login")
      .its("response.statusCode")
      .should((status) => {

        expect([400,401,403]).to.include(status);

      });

  });

  it("Deve enviar email corretamente", () => {

    cy.intercept("POST", "**/auth/login").as("login");

    cy.login("teste@teste","teste");

    cy.wait("@login").then((interception)=>{

      expect(interception.request.body.email)
        .to.eq("teste@teste");

    });

  });

  it("Deve enviar senha corretamente", () => {

    cy.intercept("POST", "**/auth/login").as("login");

    cy.login("teste@teste","teste");

    cy.wait("@login").then((interception)=>{

      expect(interception.request.body.password)
        .to.eq("teste");

    });

  });

});