//

import { OpenAPI_Repository } from "@1/core/infra/openapi.repository";
import createOpenapiClient, { type QuerySerializer } from "openapi-fetch";
import { stringify } from "qs";
import { z } from "zod";
import type { components, paths } from "./v1";

//

export const createClient = createOpenapiClient<paths>;
export type ApiClient = ReturnType<typeof createOpenapiClient<paths>>;

export const querySerializer: QuerySerializer<unknown> = (q) =>
  stringify(q, { encodeValuesOnly: true });

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
//
//

type Schemas = components["schemas"];
export module Strapi_OpenApi_Schemas {
  export module Opportunity {
    export type ListResponse = Schemas["OpportunityListResponse"];
    export type ResponseDataObject = Schemas["OpportunityResponseDataObject"];
    export type Schema = Schemas["Opportunity"];
  }
}

//

export type With_Id = { id: number };

//
//
//

export type Common_PaginationMeta_Schema = {
  meta?: {
    pagination?: {
      page?: number;
      pageCount?: number;
      pageSize?: number;
      total?: number;
    };
  };
};

export type Comment_ListSchema = Schemas["CommentListResponse"];
export type Comment_Schema = Schemas["CommentsComment"];
export type Category_ItemSchema = Schemas["CategoryResponseDataObject"];

//
//
//
export type Exchange_Schema = Schemas["Exchange"];
export type Exchange_RequestSchema = Schemas["ExchangeRequest"];
export type Exchange_ListSchema = Schemas["ExchangeListResponse"];
export type Exchange_ItemSchema = Schemas["ExchangeResponseDataObject"];

//
//
//

export type Exchange_DealListSchema = {
  data?: Exchange_Deal_ItemSchema[];
} & Common_PaginationMeta_Schema;

export type Exchange_Deal_Schema = Schemas["ExchangeDeal"];
export type Exchange_Deal_ItemSchema =
  Schemas["ExchangeDealResponseDataObject"];
export type Exchange_Deal_RequestSchema = Schemas["ExchangeDealRequest"];

//
//
//

export type New_Answer_Schema = any & With_Id;

//
//
//

export type Notification_Schema = any & With_Id;

//
//
//

export type Profile_Schema = Schemas["UserProfileResponseDataObject"];
export type Partner_Schema = Schemas["PartnerResponseDataObject"];
export type Partner_RequestSchema = Schemas["PartnerRequest"];

//
//
//

export type Question_ListSchema = Schemas["QuestionListResponse"];
export type Question_Schema = Schemas["Question"];

//

export type Inbox_ListSchema = Schemas["InboxListResponse"];
export type Inbox_ItemSchema = Schemas["InboxResponseDataObject"];
export type Inbox_Schema = Schemas["Inbox"];

//

export type Opportunity_Strapi_ListResponse =
  Schemas["OpportunityListResponse"];
export type Opportunity_Strapi_ResponseDataObject =
  Schemas["OpportunityResponseDataObject"];
export type Opportunity_Strapi_Schema = Schemas["Opportunity"];

//
