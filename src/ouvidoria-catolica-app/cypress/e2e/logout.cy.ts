describe("Logout",()=>{

    beforeEach(()=>{

        cy.login("teste@teste","teste");

    });

    it("Deve limpar token",()=>{

        cy.clearLocalStorage();

        cy.window().then(win=>{

            expect(
                win.localStorage.getItem("@Ouvidoria:token")
            ).to.be.null;

        });

    });

    it("Deve limpar role",()=>{

        cy.clearLocalStorage();

        cy.window().then(win=>{

            expect(
                win.localStorage.getItem("@Ouvidoria:role")
            ).to.be.null;

        });

    });

    it("Deve limpar sessão",()=>{

        cy.clearLocalStorage();

        cy.window().then(win=>{

            expect(
                win.localStorage.getItem("@Ouvidoria:user")
            ).to.be.null;

        });

    });

    it("Não deve acessar rota após limpar sessão",()=>{

        cy.clearLocalStorage();

        cy.visit("/admin");

        cy.url().should("eq",Cypress.config().baseUrl+"/");

    });

    it("Refresh após logout continua bloqueado",()=>{

        cy.clearLocalStorage();

        cy.reload();

        cy.visit("/user");

        cy.url().should("eq",Cypress.config().baseUrl+"/");

    });

});