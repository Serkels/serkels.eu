//

import type { Params } from ":pipes/opportunity_slug";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { SeeAlso_Provider } from "./context";
import Page_Client from "./page.client";

//

export default async function Page({ params }: { params: Params }) {
  const { slug } = await params;

  const opportunity = await TRPC_SSR.opportunity.by_slug.fetch(slug);
  const {
    id,
    category: { slug: category },
  } = opportunity;

  await TRPC_SSR.opportunity.find.prefetchInfinite({
    category,
    limit: 5,
  });

  return (
    <TRPC_Hydrate>
      <SeeAlso_Provider category={category} exclude_ids={[id]}>
        <Page_Client />
      </SeeAlso_Provider>
    </TRPC_Hydrate>
  );
}
