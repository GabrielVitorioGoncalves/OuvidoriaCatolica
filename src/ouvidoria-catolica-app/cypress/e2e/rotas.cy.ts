describe("Proteção das rotas",()=>{

    beforeEach(()=>{

        cy.clearLocalStorage();

    });

    const rotas=[
        "/admin",
        "/attendant",
        "/user",
        "/ticketAdd",
        "/ticketDetail/1",
        "/admin/manageuser"
    ];

    rotas.forEach((rota)=>{

        it(`Não deve acessar ${rota}`,()=>{

            cy.visit(rota);

            cy.url().should("eq",Cypress.config().baseUrl+"/");

        });

    });

});