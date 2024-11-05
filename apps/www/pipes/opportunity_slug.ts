//

import { trpc_server } from "@1.infra/trpc/react-query/server";

//

export type Params = Promise<{
  slug: string;
}>;

export async function slug_to_opportunity(params: Params) {
  const { slug } = await params;
  return trpc_server.opportunity.by_slug.fetch(slug);
}
