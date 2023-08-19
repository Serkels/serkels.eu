//

import { errors } from "@strapi/utils";
import { EntityService, StrapiContext } from "../types";

export default async (
  policyContext: StrapiContext,
  config:
    | { apiName?: string; controllerName?: string; entryName?: string }
    | undefined,
  { strapi },
) => {
  const entityService: EntityService = strapi.entityService;

  const apiName = config?.apiName ?? policyContext.state.route.info.apiName;
  const controllerName =
    config?.controllerName ?? policyContext.state.route.handler.split(".")[0];
  const { id: entry_id } = policyContext.params;

  const entryName = config?.entryName ?? "owner";

  //

  const entry = await entityService.findOne<
    string,
    Record<"owner" | string, { id: number }> | undefined
  >(`${controllerName}.${apiName}`, entry_id, {
    populate: [entryName],
  });
  const user_id = policyContext.state.user?.id;
  const owner_id = (entry ?? {})[entryName]?.id;

  //

  if (user_id && owner_id && Number(user_id) === Number(owner_id)) {
    return true;
  }

  throw new errors.PolicyError(`You are not allowed`, {
    policy: "global::is-owned",
  });
};
