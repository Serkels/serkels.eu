//

import {
  createClient,
  type ApiClient as OpenApiClient,
} from "@1/strapi-openapi";
import { type QuerySerializer } from "openapi-fetch";
import { stringify } from "qs";

//

const querySerializer: QuerySerializer<unknown> = (q) =>
  stringify(q, { encodeValuesOnly: true });

//

/**
 * @deprecated use `import { ApiClient } from "@1/strapi-openapi";` *
 * @see {@link OpenApiClient}
 */
export type ApiClient = OpenApiClient;

export const fromServer = createClient({
  baseUrl: process.env["STRAPI_API_URL"] + "/api",
  querySerializer,
});

export const fromClient = createClient({
  baseUrl: "/api/v1",
  querySerializer,
});

//

export const { GET } = fromServer;
