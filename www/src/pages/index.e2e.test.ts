//

import { afterAll, beforeAll, beforeEach, test } from "e2e/+tester";

//

beforeAll({ headless: true });
afterAll();
beforeEach();

test("/ have content", async ({ page, localhost, expect }) => {
  await page.goto(localhost("/"), { waitUntil: "networkidle" });

  const text = await page.locator("body > div").textContent();

  expect(text).toContain("Toc Toc");
  expect(text).toContain("Créer un compte");
  expect(text).toContain("Explorer sans créer un compte !");
  expect(text).toContain("Liste de propositions");
});
