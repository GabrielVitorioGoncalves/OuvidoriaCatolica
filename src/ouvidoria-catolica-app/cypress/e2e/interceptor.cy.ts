describe("Interceptor Axios",()=>{

    beforeEach(()=>{

        cy.login("teste@teste","teste");

    });

    it("Toda requisição deve possuir Authorization",()=>{

        cy.intercept("GET","**",req=>{

            expect(req.headers).to.have.property("authorization");

        });

        cy.visit("/user");

    });

    it("Token deve iniciar com Bearer",()=>{

        cy.intercept("GET","**",req=>{

            if(req.headers.authorization){

                expect(req.headers.authorization)
                .to.contain("Bearer");

            }

        });

        cy.visit("/user");

    });

});