module.exports = {
  documentation: {
    enabled: true,
    config: {
      "x-strapi-config": {
        plugins: [
          "comments",
          "sentry",
          "email",
          "i18n",
          "passwordless",
          "upload",
          "users-permissions",
        ],
      },
    },
  },
  // passwordless: {
  //   enabled: true,
  //   config: {
  //     settings: {
  //       message_text:
  //         "Hiiii!\n" +
  //         "Please click on the link below to login on a strapi driven site.\n" +
  //         "<%= URL %>?loginToken=<%= CODE %>\n" +
  //         "Thanks.",
  //     },
  //   },
  // },
};
