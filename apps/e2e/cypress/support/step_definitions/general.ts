//

import { Given, Then, When } from "@badeball/cypress-cucumber-preprocessor";

//

Given("je navigue sur la page", function () {
  cy.visit("/");
});

Given("je navigue sur {string}", function (text: string) {
  cy.visit(text);
});

Given("je m'attend a une erreur {string}", function (text: string) {
  cy.on("uncaught:exception", () => {
    return false;
  });
});

//

Then("je vois {string}", function (text: string) {
  cy.contains(text);
});

Then("je vois la légende {string}", function (text: string) {
  cy.get(`[aria-label="${text}"]`);
});

Then("je vois dans le titre {string}", function (text: string) {
  cy.title().should("contain", text);
});

//

When("je clique sur {string}", (text: string) => {
  cy.contains(text).click({ force: true });
});

When("je clique sur le bouton {string}", (text: string) => {
  cy.contains("button", text).click();
});

When("je clique sur le champ {string}", (text: string) => {
  cy.get(`input[placeholder="${text}"]`).click();
});

Then("je clique sur la légende {string}", function (text: string) {
  cy.get(`[aria-label="${text}"]`).click();
});

When("je tape {string}", (text: string) => {
  cy.focused().type(text);
});
