//

import { StrapiContext } from "../types";

export default (policyContext: StrapiContext) => {
  return Boolean(policyContext.state.user);
};
