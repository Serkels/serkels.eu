//

import { When } from "@badeball/cypress-cucumber-preprocessor";
import "cypress-maildev";

//

When("je me connecte en tant que {string}", (email: string) => {
  cy.get(`input[placeholder="Adresse email de connexion"]`).type(email);
  cy.contains("button", "Se connecter").click();
  cy.contains("Consultez votre boite mail pour confirmer votre identité");
  cy.maildevGetLastMessage().then((message) => {
    expect(message.subject).to.equal("[Serkels] Connexion");
    cy.maildevVisitMessageById(message.id);
    cy.origin(
      `${Cypress.env("MAILDEV_PROTOCOL")}://${Cypress.env("MAILDEV_HOST")}:${Cypress.env("MAILDEV_API_PORT")}`,
      { args: message.id },
      (id: string) => {
        cy.visit(`/email/${id}/html`);
        cy.contains("Veuillez cliquer ce lien pour vous connecter.")
          .invoke("removeAttr", "target")
          .click();
      },
    );
    cy.maildevDeleteMessageById(message.id);
  });
  cy.contains("Vous êtes connecté");
});

When("je clique sur le lien de connexion", () => {
  cy.maildevGetLastMessage().then((message) => {
    expect(message.subject).to.equal("[Serkels] Connexion");
    cy.maildevGetLastMessage().then((message) => {
      expect(message.subject).to.equal("[Serkels] Connexion");
      cy.maildevVisitMessageById(message.id);
      cy.origin(
        `${Cypress.env("MAILDEV_PROTOCOL")}://${Cypress.env("MAILDEV_HOST")}:${Cypress.env("MAILDEV_API_PORT")}`,
        { args: message.id },
        (id: string) => {
          cy.visit(`/email/${id}/html`);
          cy.contains("Veuillez cliquer ce lien pour vous connecter.")
            .invoke("removeAttr", "target")
            .click();
        },
      );
      cy.maildevDeleteMessageById(message.id);
    });
  });
});
