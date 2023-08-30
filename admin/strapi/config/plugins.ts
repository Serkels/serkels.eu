//

import mutateExchangeDealDocumentation from "../src/api/exchange-deal/documentation/mutateDocumentation";
import mutateExchangeDocumentation from "../src/api/exchange/documentation/mutateDocumentation";
import mutateQuestionDocumentation from "../src/api/question/documentation/mutateDocumentation";
import mutate_thread_documentation from "../src/api/thread/documentation/mutateDocumentation";
import mutateCommentsDocumentation from "../src/extensions/comments/documentation/mutateDocumentation";
import mutateDocumentationDocumentation from "../src/extensions/documentation/documentation/mutateDocumentation";

//

export default ({ env }) => ({
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
          mutateCommentsDocumentation(generatedDocumentationDraft);
          mutateDocumentationDocumentation(generatedDocumentationDraft);
          mutateExchangeDocumentation(generatedDocumentationDraft);
          mutateExchangeDealDocumentation(generatedDocumentationDraft);
          mutateQuestionDocumentation(generatedDocumentationDraft);
          mutate_thread_documentation(generatedDocumentationDraft);
        },
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
  sentry: {
    enabled: true,
    config: {
      dsn: env("SENTRY_DSN"),
      sendMetadata: true,
    },
  },

  upload: {
    config: {
      provider: "aws-s3",
      sizeLimit: 1 * 1_024 * 1_024, // 1mb in bytes
      providerOptions: {
        s3Options: {
          accessKeyId: env("AWS_ACCESS_KEY_ID"),
          secretAccessKey: env("AWS_ACCESS_SECRET"),
          region: env("AWS_REGION"),
          params: {
            Bucket: env("AWS_BUCKET"),
          },
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
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
