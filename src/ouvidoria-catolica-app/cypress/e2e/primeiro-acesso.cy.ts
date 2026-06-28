describe("Primeiro acesso",()=>{

    beforeEach(()=>{

        cy.visit("/");

    });

    it("Deve alterar para modo primeiro acesso",()=>{

        cy.get("input[type='checkbox']")
        .click({force:true});

        cy.contains("Crie sua senha");

    });

    it("Deve voltar para login",()=>{

        cy.get("input[type='checkbox']")
        .click({force:true});

        cy.get("input[type='checkbox']")
        .click({force:true});

        cy.contains("Acessar sua conta");

    });

    it("Deve permitir preencher email",()=>{

        cy.get("input[type='checkbox']")
        .click({force:true});

        cy.get("input")
        .first()
        .type("teste@teste");

    });

    it("Deve permitir preencher senha",()=>{

        cy.get("input[type='checkbox']")
        .click({force:true});

        cy.get("input[type='password']")
        .type("teste");

    });

});