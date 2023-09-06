export default [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "blob:",
            "cdn-media-toctoc.s3.eu-west-3.amazonaws.com",
            "data:",
            "dl.airtable.com",
            "market-assets.strapi.io",
          ],
          "media-src": [
            "'self'",
            "blob:",
            "cdn-media-toctoc.s3.eu-west-3.amazonaws.com",
            "data:",
            "dl.airtable.com",
            "market-assets.strapi.io",
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
