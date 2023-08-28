//

import type {
  DefaultContextExtends,
  DefaultStateExtends,
  ParameterizedContext,
} from "koa";

import type { PolicyImplementation } from "@strapi/strapi/lib/types/core-api/router";

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

export interface Context extends DefaultContextExtends {
  params?: {
    id: string;
  };
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
export type { Context, Next } from "koa";
export type * as ApiContentTypes from "~/types/generated/contentTypes";
