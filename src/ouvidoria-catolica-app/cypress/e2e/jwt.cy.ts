describe("JWT",()=>{

    beforeEach(()=>{

        cy.visit("/");

    });

    it("JWT deve existir após login",()=>{

        cy.login("teste@teste","teste");

        cy.window().then(win=>{

            expect(
                win.localStorage.getItem("@Ouvidoria:token")
            ).to.exist;

        });

    });

    it("JWT não pode ser vazio",()=>{

        cy.window().then(win=>{

            win.localStorage.setItem(
                "@Ouvidoria:token",
                ""
            );

        });

        cy.visit("/admin");

        cy.url().should("include","/");

    });

    it("JWT inválido não autentica",()=>{

        cy.window().then(win=>{

            win.localStorage.setItem(
                "@Ouvidoria:token",
                "123456"
            );

        });

        cy.visit("/admin");

        cy.url().should("include","/");

    });

    it("JWT alterado não autentica",()=>{

        cy.window().then(win=>{

            win.localStorage.setItem(
                "@Ouvidoria:token",
                "abc.def.xyz"
            );

        });

        cy.visit("/admin");

        cy.url().should("include","/");

    });

});