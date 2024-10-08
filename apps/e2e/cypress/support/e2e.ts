//

import { match, P } from "ts-pattern";

//
// from https://www.twistedbrackets.com/next-js-server-side-action-redirects-with-cypress/
//
Cypress.on("uncaught:exception", (err) => {
  return match(err as Error & { digest: string })
    .with(
      // This block is added to handle server-side redirects in Next.js.
      // Next.js often performs server-side redirects for various reasons, such as:
      // - Authentication flows (redirecting to login page if not authenticated)
      // - Conditional rendering based on user data
      // - Route changes based on server-side logic
      // When these redirects occur, they can throw a "NEXT_REDIRECT" error,
      // which is expected behavior and should not cause the test to fail.
      // Returning false here prevents Cypress from failing the test when such an error is encountered.
      { message: P.string.includes("NEXT_REDIRECT") },
      { digest: P.string.includes("NEXT_REDIRECT") },
      () => false,
    )
    .otherwise(() => {
      throw err;
    });
});
