//

import type { paths } from "@1/strapi-openapi/v1";
import createClient from "openapi-fetch";

//

export const client = createClient<paths>({
  baseUrl: import.meta.env.VITE_STRAPI_API_URL,
});
