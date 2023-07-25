//

import type { paths } from "@1/strapi-openapi/v1";
import createClient from "openapi-fetch";
import { stringify } from "qs";

//

export const client = createClient<paths>({
  baseUrl: process.env["STRAPI_API_URL"] + "/api",

  querySerializer(q) {
    return stringify(q, { encodeValuesOnly: true });
  },
});

export const { GET } = client;
