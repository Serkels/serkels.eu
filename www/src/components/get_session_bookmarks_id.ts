//

import type { components } from "@1/strapi-openapi/v1";

type Bookmark = components["schemas"]["Bookmark"];
export function get_bookmark_opportunities_ids(data: Bookmark | undefined) {
  return data?.opportunities?.data?.map(({ id }) => Number(id)) ?? [];
}
