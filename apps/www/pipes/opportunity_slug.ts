//

import { trpc_server } from "@1.infra/trpc/react-query/server";

//

export interface Params {
  slug: string;
}

export async function slug_to_opportunity({ slug }: Params) {
  return trpc_server.opportunity.by_slug.fetch(slug);
}
