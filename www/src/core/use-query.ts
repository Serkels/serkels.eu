//

import type { Common_PaginationMeta_Schema } from "@1/strapi-openapi";

export function getNextPageParam(lastPage: Common_PaginationMeta_Schema) {
  const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
  const { pageCount, page } = pagination;
  if (pageCount === undefined || page === undefined) return;

  return page >= pageCount ? undefined : page + 1;
}

export function getPreviousPageParam(lastPage: Common_PaginationMeta_Schema) {
  const pagination = lastPage.meta?.pagination ?? { page: 0 };
  const { page } = pagination;
  if (page === undefined) return;

  return page > 0 ? page - 1 : undefined;
}
