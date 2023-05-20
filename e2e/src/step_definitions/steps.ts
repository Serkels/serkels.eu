//

const { I } = inject();

//

Given("I go to the home page", async () => {
  await I.amOnPage("/");
});

Then("I see {string}", async (text: string) => {
  await I.see(text);
});
