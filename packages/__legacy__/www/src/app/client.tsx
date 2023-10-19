// "use client";

import type { paths } from "@1/strapi-openapi/v1";
import createClient from "openapi-fetch";

export const client = createClient<paths>({ baseUrl: "/api/v1" });
export const { GET } = client;

export function deepSerializer(q: object) {
  const search = new URLSearchParams();
  if (q && typeof q === "object") {
    for (const [k, v] of Object.entries(q)) {
      if (v === undefined || v === null) continue;

      // ! FIXME(douglasduteil): dirty sub JSON Serializer
      // ! This is not working btw...
      // This makes strapi happy
      // And It's makes me cry...
      // copy/paste/inspired by https://github.com/drwpow/openapi-typescript/blob/v6.2.8/packages/openapi-fetch/src/index.ts#L60-L69
      if (v && typeof v === "object") {
        for (const [kk, vv] of Object.entries(v)) {
          if (v === undefined || v === null) continue;
          search.set(`^${k}[${kk}]`, JSON.stringify(vv));
        }
      }
      //
      else {
        search.set(k, String(v));
      }
    }
  }
  return search.toString();
}
