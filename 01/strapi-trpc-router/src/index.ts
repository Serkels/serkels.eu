//

import { OpenAPI_Repository } from "@1/core/infra/openapi.repository";
import type { Common_PaginationMeta_Schema } from "@1/strapi-openapi";
import type { paths } from "@1/strapi-openapi/v1";
import createOpenapiClient from "openapi-fetch";
import { z } from "zod";

//

export const createClient: typeof createOpenapiClient<paths> =
  createOpenapiClient<paths>;
export type ApiClient = ReturnType<typeof createOpenapiClient<paths>>;

export interface TRPCOpenAPIContext {
  openapi: OpenAPI_Repository<ApiClient>;
  headers: Headers;
}

export const StrapiPagination_Schema = z.object({
  pagination: z
    .object({
      // page: z.number().int().finite().min(0).default(1),
      pageSize: z.number().int().finite().min(0).default(8),
    })
    .default({}),
});

export function getNextPageParam<
  TQueryFnData extends Common_PaginationMeta_Schema | undefined,
>(lastPage: TQueryFnData) {
  const pagination = lastPage?.meta?.pagination ?? { pageCount: 0, page: 0 };
  const { pageCount, page } = pagination;
  if (pageCount === undefined || page === undefined) return;
  return page >= pageCount ? undefined : page + 1;
}

export function getPreviousPageParam<
  TQueryFnData extends Common_PaginationMeta_Schema | undefined,
>(lastPage: TQueryFnData) {
  const pagination = lastPage?.meta?.pagination ?? { page: 0 };
  const { page } = pagination;
  if (page === undefined) return;

  return page > 0 ? page - 1 : undefined;
}

//

export interface AppContext {
  // subscription_to: {
  //   notifications: (
  //     id: number,
  //   ) => Observable<Notification_New_Answer_Props, unknown>;
  //   messages: (
  //     id: number,
  //   ) => Observable<Notification_New_Answer_Props, unknown>;
  // };
  // verify_jwt: (token: string) => Promise<{ id: number }>;
}
