//

import { errors } from "@strapi/utils";
import { EntityService, StrapiContext } from "../types";

export default async (policyContext: StrapiContext, _config, { strapi }) => {
  const apiName = policyContext.state.route.info.apiName;
  const controllerName = policyContext.state.route.handler.split(".")[0];
  const { id: entry_id } = policyContext.params;

  const entityService: EntityService = strapi.entityService;
  const entry = await entityService.findOne<string, { owner: { id: number } }>(
    `${controllerName}.${apiName}`,
    entry_id,
    { populate: ["owner"] },
  );

  if (Number(policyContext.state.user?.id) === Number(entry?.owner.id)) {
    return true;
  }

  throw new errors.PolicyError(`You are not allowed`, {
    policy: "global::is-owned",
  });
};
