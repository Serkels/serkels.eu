//

import type { components } from "@1/strapi-openapi/v1";

//

export function Opportunity(
  raw: components["schemas"]["OpportunityListResponseDataItem"]
) {
  const { id, attributes } = raw as Required<
    components["schemas"]["OpportunityListResponseDataItem"]
  >;
  const { title, description, expireAt } = attributes;
  // console.log({ title, description, expireAt });
  return {
    id,
    title,
    description,
    expireAt: new Date(expireAt!),
  };
}
