//

import { createClient, querySerializer } from "@1/strapi-openapi";

//

export const fromServer = createClient({
  baseUrl: process.env["STRAPI_API_URL"] + "/api",
  querySerializer,
});

export const fromClient = createClient({
  baseUrl: "/api/v1",
  querySerializer,
});

export const API_CLIENT = Symbol.for("API_CLIENT");

//

export const { GET } = fromServer;
