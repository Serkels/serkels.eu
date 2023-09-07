//

import type { Event, Params } from "@strapi/database/lib/lifecycles";
import type { PolicyImplementation } from "@strapi/strapi/lib/types/core-api/router";
import type {
  DefaultContextExtends,
  DefaultStateExtends,
  ParameterizedContext,
  Request,
} from "koa";
import { z } from "zod";

//

export interface State extends DefaultStateExtends {
  user?: {
    id: string;
  };

  route: {
    info: {
      apiName: string;
    };
    handler: string;
  };
}

export interface Context<RequestParams = any> extends DefaultContextExtends {
  params: RequestParams;
  query: {
    filters?: Record<string, unknown> | Object;
    populate?: Record<string, unknown> | string | Object;
  };
}

export interface ResponseBody {
  data: Record<string, unknown>;
}

export interface StrapiContext
  extends ParameterizedContext<State, Context, ResponseBody> {}

interface KoaRequest<RequestBody = any> extends Request {
  body?: RequestBody;
}

export interface KoaContext<
  RequestBody = any,
  ResponseBody = any,
  RequestParams = any,
> extends ParameterizedContext<State, Context<RequestParams>, ResponseBody> {
  request: KoaRequest<RequestBody>;
  body: ResponseBody;

  send: (...args: any[]) => void;
}

export interface KoaResponseContext<ResponseBody>
  extends KoaContext<any, ResponseBody> {}

//
//
//

export interface BeforeCreateParams<Data> extends Params {
  data?: Data;
}

export interface BeforeCreateLifecycleEvent<Data> extends Event {
  params: BeforeCreateParams<Data>;
}

export interface BeforeDeleteLifecycleEvent extends Event {
  params: { where: { id: number } };
}

export interface AfterCreateLifecycleEvent<Params = any, Result = any>
  extends Event {
  params: Params;
  result: Result;
}

//
//
//

export type AsyncPolicyImplementation<TCfg = unknown> = (
  ...args: Parameters<PolicyImplementation<TCfg>>
) => Promise<boolean>;

//

export type { EntityService } from "@strapi/strapi/lib/services/entity-service";
export type { Shared } from "@strapi/strapi/lib/types";
export type { PolicyImplementation } from "@strapi/strapi/lib/types/core-api/router";
export type { GetValues } from "@strapi/strapi/lib/types/core/attributes";
export type { Next } from "koa";

//

export type * as ApiContentTypes from "~/types/generated/contentTypes";

//
export const ID_Schema = z.coerce.number().safe().finite().nonnegative().int();

//

export type { Comment } from "strapi-plugin-comments/types/contentTypes";
