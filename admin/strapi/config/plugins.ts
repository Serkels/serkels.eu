//

import globby from "globby";
import { readFileSync } from "node:fs";
import { parse } from "yaml";
import mutate_user_profiles_documentation from "../src/api/user-profile/documentation/mutateDocumentation";
import mutate_comments_documentation from "../src/extensions/comments/documentation/mutateDocumentation";
import mutate_documentation_documentation from "../src/extensions/documentation/documentation/mutateDocumentation";

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
        mutateDocumentation: (generatedDocumentationDraft: {
          components: { schemas: object };
          paths: object;
        }) => {
          try {
            globby
              .sync(["./src/api/*/documentation/mutate/paths/*.yaml"])
              .reduce((document, yaml_file) => {
                try {
                  const path_schema = parse(readFileSync(yaml_file, "utf8"));
                  Object.assign(document.paths, path_schema);
                } catch (error) {
                  throw new Error(yaml_file + "\n" + error.message);
                }
                return document;
              }, generatedDocumentationDraft);
          } catch (e) {
            console.error(e);
          }
          mutate_comments_documentation(generatedDocumentationDraft);
          mutate_documentation_documentation(generatedDocumentationDraft);
          mutate_user_profiles_documentation(generatedDocumentationDraft);
        },
      },
    },
  },
  email: {
    enabled: true,
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
    enabled: true,
    config: {
      provider: "aws-s3",
      sizeLimit: 0.5 * 1_024 * 1_024, // 0.5mb in bytes

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

  comments: {
    enabled: true,
  },
  "users-permissions": {
    config: {},
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
