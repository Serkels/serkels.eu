//

import { slug_to_opportunity, type Params } from ":pipes/opportunity_slug";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import to from "await-to-js";
import type { Metadata, ResolvingMetadata } from "next";
import { Mutate_Opportunity_Island } from "./page.client";

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;
  const [, opportunity] = await to(slug_to_opportunity(params));

  const title = `Edit ${opportunity?.title ?? "O_0"} :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { slug } = params;

  await TRPC_SSR.opportunity.by_slug.prefetch(slug);
  await TRPC_SSR.category.opportunity.prefetch();
  return (
    <TRPC_Hydrate>
      <main className="mx-auto my-10 max-w-3xl px-4">
        <Mutate_Opportunity_Island opportunity_slug={slug} />
      </main>
    </TRPC_Hydrate>
  );
}
