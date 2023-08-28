//

import type { EntityService } from "@strapi/strapi/lib/services/entity-service";
import { errors } from "@strapi/utils";
import type { StrapiRequestContext } from "strapi-typed";
import type { AsyncPolicyImplementation } from "~/types";

//

export default <
  AsyncPolicyImplementation<
    | { apiName?: string; controllerName?: string; entryName?: string }
    | undefined
  >
>(async (policyContext, config, { strapi }) => {
  const entityService: EntityService = strapi.entityService;
  const strapi_ctx = policyContext as any as StrapiRequestContext & {
    state: { route: { handler: string; info: { apiName: string } } };
  };
  const apiName = config?.apiName ?? strapi_ctx.state.route.info.apiName;
  const controllerName =
    config?.controllerName ?? strapi_ctx.state.route.handler.split(".")[0];
  const { id: entry_id } = strapi_ctx.params;

  const entryName = config?.entryName ?? "owner";

  //

  const entry = await entityService.findOne<
    string,
    Record<"owner" | string, { id: number }> | undefined
  >(`${controllerName}.${apiName}`, entry_id, {
    populate: [entryName],
  });
  const user_id = strapi_ctx.state.user?.id;
  const owner_id = (entry ?? {})[entryName]?.id;

  //

  if (user_id && owner_id && Number(user_id) === Number(owner_id)) {
    return true;
  }

  throw new errors.PolicyError(`You are not allowed`, {
    policy: "global::is-owned",
  });
});
