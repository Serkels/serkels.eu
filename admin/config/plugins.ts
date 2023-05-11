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
        mutateDocumentation: (generatedDocumentationDraft) => {
          // TODO(douglasduteil): my what to manually add passwordless open api here
          // console.log(generatedDocumentationDraft);
        },
      },
    },
  },
};
