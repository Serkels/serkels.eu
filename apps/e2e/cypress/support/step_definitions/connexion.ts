//

import { When } from "@badeball/cypress-cucumber-preprocessor";
import "cypress-maildev";

//

When("je me connecte en tant que {string}", (email: string) => {
  cy.log(email);
  cy.maildevHealthcheck();
});
