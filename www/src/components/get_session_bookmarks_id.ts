//

import type { components } from "@1/strapi-openapi/v1";

type BookmarkDataObject = components["schemas"]["BookmarkResponseDataObject"];
export function get_bookmark_opportunities_ids(
  data: BookmarkDataObject[] | undefined,
) {
  return data
    ?.map(({ attributes }) => attributes?.opportunity?.data?.id)
    .map(Number)
    .filter((id) => !Number.isNaN(id));
}
