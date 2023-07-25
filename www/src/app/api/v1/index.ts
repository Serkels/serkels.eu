//

import type { paths } from "@1/strapi-openapi/v1";
import createClient, { type QuerySerializer } from "openapi-fetch";
import { stringify } from "qs";

//

const querySerializer: QuerySerializer<unknown> = (q) =>
  stringify(q, { encodeValuesOnly: true });

//

export const fromServer = createClient<paths>({
  baseUrl: process.env["STRAPI_API_URL"] + "/api",
  querySerializer,
});

export const fromClient = createClient<paths>({
  baseUrl: "/api/v1",
  querySerializer,
});

//

export const { GET } = fromServer;
