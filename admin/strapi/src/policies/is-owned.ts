//

import { errors } from "@strapi/utils";
import { StrapiContext } from "../types";

export default async (policyContext: StrapiContext, config, { strapi }) => {
  const apiName = policyContext.state.route.info.apiName;
  const controllerName = policyContext.state.route.handler.split(".")[0];
  const { id } = policyContext.params;
  const idQuery = { ...(id ? { id: { $eq: id } } : undefined) };

  // const entry = await strapi.entityService.findOne('api::article.article', 1, {
  //   populate: { someRelation: true },
  // });
  // const entity = await strapi.db
  // .query(`api::${apiName}.${controllerName}`)
  // .findMany({
  //   where: {
  //     ...idQuery,
  //     owner: policyContext.state.user.id,
  //   },
  // });

  // policyContext.query.filters.owner = policyContext.state.user.id;

  // const entry = config.queryEntry();
  if (policyContext.state.user.id === policyContext.params.id) {
    return true;
  }

  throw new errors.PolicyError(`You are not allowed`, {
    policy: "global::is-owned",
  });
};
