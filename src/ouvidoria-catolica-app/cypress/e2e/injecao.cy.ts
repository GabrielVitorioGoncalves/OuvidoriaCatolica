describe("Testes de Injeção",()=>{

    beforeEach(()=>{

        cy.visit("/");

    });

    it("SQL Injection clássico",()=>{

        cy.get("input")
        .first()
        .type("' OR 1=1 --");

        cy.get('input[type="password"]')
        .type("' OR 1=1 --");

        cy.contains("Entrar").click();

        cy.contains("Credenciais inválidas");

    });

    it("SQL Injection UNION",()=>{

        cy.get("input")
        .first()
        .type("' UNION SELECT * FROM users --");

        cy.get('input[type="password"]')
        .type("123");

        cy.contains("Entrar").click();

    });

    it("SQL Injection DROP",()=>{

        cy.get("input")
        .first()
        .type("'; DROP TABLE users; --");

        cy.get('input[type="password"]')
        .type("123");

        cy.contains("Entrar").click();

    });

    it("XSS Script",()=>{

        cy.get("input")
        .first()
        .type("<script>alert(1)</script>");

        cy.get('input[type="password"]')
        .type("<script>alert(1)</script>");

        cy.contains("Entrar").click();

    });

    it("XSS IMG",()=>{

        cy.get("input")
        .first()
        .type('<img src=x onerror=alert(1)>');

        cy.get('input[type="password"]')
        .type("123");

        cy.contains("Entrar").click();

    });

    it("String gigante",()=>{

        cy.get("input")
        .first()
        .type("A".repeat(5000));

        cy.get('input[type="password"]')
        .type("A".repeat(5000));

        cy.contains("Entrar").click();

    });

});