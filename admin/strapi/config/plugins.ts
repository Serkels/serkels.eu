module.exports = ({ env }) => ({
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
  email: {
    config: {
      provider: "nodemailer",
      providerOptions: {
        host: env("SMTP_HOST", "localhost"),
        port: env("SMTP_PORT", 587),
        auth: {
          user: env("SMTP_USERNAME"),
          pass: env("SMTP_PASSWORD"),
        },
      },
      settings: {
        defaultFrom: env("EMAIL_DEFAULT_FROM"),
        defaultReplyTo: env("EMAIL_DEFAULT_REPLY_TO"),
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
});
