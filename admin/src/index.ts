export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }) {
    if (strapi.plugin("passwordless")) {
      const override = {
        // Only run this override for version 1.0.0
        info: { version: "1.0.0" },
        paths: {
          "/passwordless": {
            get: {
              responses: { 200: { description: "*" } },
            },
          },
        },
      };
      // const sd = strapi.plugin("passwordless");
      // console.log(sd.services);
    }
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap(/*{ strapi }*/) {},
};
