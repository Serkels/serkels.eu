//

import { TRPC_SSR } from ":trpc/server";

//

export interface Params {
  slug: string;
}

export async function slug_to_opportunity({ slug }: Params) {
  return TRPC_SSR.opportunity.by_slug.fetch(slug);
}
