//

import { errors } from "@strapi/utils";
import { StrapiContext } from "../types";

export default (policyContext: StrapiContext, config, { strapi }) => {
  if (policyContext.state.user.id === policyContext.params.id) {
    return true;
  }

  throw new errors.PolicyError(`You are not allowed`, {
    policy: "global::is-owned",
  });
};
