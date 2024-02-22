//

import { Given } from "@badeball/cypress-cucumber-preprocessor";

//

Given("une base de données nourrie au grain", () => {
  cy.log(" >>> SEED DATABASE <<<");
  cy.exec("pnpm --filter @1.infra/database exec prisma db seed");
});
