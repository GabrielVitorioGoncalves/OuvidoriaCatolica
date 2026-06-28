describe("Login", () => {

    beforeEach(() => {
        cy.visit("/")
    })

    it("Deve exibir a tela de login", () => {

        cy.contains("Acessar sua conta")
        cy.contains("Entrar")

    })

    it("Deve realizar login com sucesso", () => {

        cy.get("input")
            .first()
            .type("teste@teste")

        cy.get('input[type="password"]')
            .type("teste")

        cy.contains("Entrar").click()

        cy.url().should("not.include","/")

    })

    it("Não deve autenticar usuário inválido", () => {

        cy.get("input")
            .first()
            .type("usuario@teste.com")

        cy.get('input[type="password"]')
            .type("123")

        cy.contains("Entrar").click()

        cy.contains("Credenciais inválidas")

    })

    it("Não deve aceitar senha incorreta", () => {

        cy.get("input")
            .first()
            .type("teste@teste")

        cy.get('input[type="password"]')
            .type("senhaerrada")

        cy.contains("Entrar").click()

        cy.contains("Credenciais inválidas")

    })

    it("Não deve permitir campos vazios", () => {

        cy.contains("Entrar").click()

        cy.url().should("include","/")

    })

})