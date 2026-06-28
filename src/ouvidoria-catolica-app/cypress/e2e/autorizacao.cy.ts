describe("Controle de autorização", () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("Usuário sem login não acessa /admin", () => {

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Usuário sem login não acessa /attendant", () => {

    cy.visit("/attendant");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Usuário sem login não acessa /user", () => {

    cy.visit("/user");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Usuário sem login não acessa TicketAdd", () => {

    cy.visit("/ticketAdd");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Usuário sem login não acessa TicketDetail", () => {

    cy.visit("/ticketDetail/1");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Não deve autenticar apenas alterando role", () => {

    cy.visit("/");

    cy.window().then(win => {

      win.localStorage.setItem("@Ouvidoria:role","3");

    });

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Não deve autenticar apenas criando sessão falsa", () => {

    cy.visit("/");

    cy.window().then(win=>{

      win.localStorage.setItem(
        "@Ouvidoria:user",
        JSON.stringify({
          name:"Administrador",
          role:3
        })
      );

    });

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Token vazio deve impedir acesso",()=>{

    cy.visit("/");

    cy.window().then(win=>{

      win.localStorage.setItem("@Ouvidoria:token","");

    });

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("Token inválido deve impedir acesso",()=>{

    cy.visit("/");

    cy.window().then(win=>{

      win.localStorage.setItem("@Ouvidoria:token","abcdef");

    });

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

  it("JWT mal formado deve impedir acesso",()=>{

    cy.visit("/");

    cy.window().then(win=>{

      win.localStorage.setItem(
        "@Ouvidoria:token",
        "eyJ.corrompido.token"
      );

    });

    cy.visit("/admin");

    cy.url().should("eq", Cypress.config().baseUrl + "/");

  });

});