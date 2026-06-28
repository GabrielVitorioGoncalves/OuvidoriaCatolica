describe("Autenticação e Sessão", () => {

  beforeEach(() => {
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it("Deve salvar o token JWT após login", () => {

    cy.login("teste@teste", "teste");

    cy.window().then((win) => {

      const token = win.localStorage.getItem("@Ouvidoria:token");

      expect(token).to.not.be.null;
      expect(token).to.not.equal("");

    });

  });

  it("Deve salvar o role do usuário", () => {

    cy.login("teste@teste", "teste");

    cy.window().then((win) => {

      const role = win.localStorage.getItem("@Ouvidoria:role");

      expect(role).to.not.be.null;

    });

  });

  it("Deve salvar a sessão do usuário", () => {

    cy.login("teste@teste", "teste");

    cy.window().then((win) => {

      const user = win.localStorage.getItem("@Ouvidoria:user");

      expect(user).to.not.be.null;

    });

  });

  it("Deve permanecer autenticado após atualizar a página", () => {

    cy.login("teste@teste", "teste");

    cy.reload();

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:token")
      ).to.not.be.null;

    });

  });

  it("Não deve existir token antes do login", () => {

    cy.visit("/");

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:token")
      ).to.be.null;

    });

  });

  it("Não deve existir role antes do login", () => {

    cy.visit("/");

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:role")
      ).to.be.null;

    });

  });

  it("Não deve existir sessão antes do login", () => {

    cy.visit("/");

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:user")
      ).to.be.null;

    });

  });

  it("Deve manter token após refresh", () => {

    cy.login("teste@teste", "teste");

    cy.reload();

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:token")
      ).to.exist;

    });

  });

  it("Deve permitir limpar a sessão manualmente", () => {

    cy.login("teste@teste", "teste");

    cy.clearLocalStorage();

    cy.visit("/");

    cy.window().then((win) => {

      expect(
        win.localStorage.getItem("@Ouvidoria:token")
      ).to.be.null;

    });

  });

  it("Não deve aceitar token vazio", () => {

    cy.visit("/");

    cy.window().then((win) => {

      win.localStorage.setItem("@Ouvidoria:token", "");

    });

    cy.visit("/user");

    cy.url().should("include", "/");

  });

  it("Não deve aceitar token inválido", () => {

    cy.visit("/");

    cy.window().then((win) => {

      win.localStorage.setItem("@Ouvidoria:token", "abc123");

    });

    cy.visit("/user");

    cy.url().should("include", "/");

  });

  it("Não deve aceitar token corrompido", () => {

    cy.visit("/");

    cy.window().then((win) => {

      win.localStorage.setItem(
        "@Ouvidoria:token",
        "eyJhbGciOiJIUzI1NiJ9.corrompido"
      );

    });

    cy.visit("/user");

    cy.url().should("include", "/");

  });

  it("Não deve autenticar apenas com role salvo", () => {

    cy.visit("/");

    cy.window().then((win) => {

      win.localStorage.setItem("@Ouvidoria:role", "3");

    });

    cy.visit("/admin");

    cy.url().should("include", "/");

  });

  it("Não deve autenticar apenas com sessão salva", () => {

    cy.visit("/");

    cy.window().then((win) => {

      win.localStorage.setItem(
        "@Ouvidoria:user",
        JSON.stringify({
          name: "Administrador",
          role: 3
        })
      );

    });

    cy.visit("/admin");

    cy.url().should("include", "/");

  });

  it("Deve possuir apenas um token salvo", () => {

    cy.login("teste@teste", "teste");

    cy.window().then((win) => {

      const keys = Object.keys(win.localStorage);

      const quantidade = keys.filter(k =>
        k.includes("@Ouvidoria:token")
      );

      expect(quantidade.length).to.eq(1);

    });

  });

});