//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import {
  Partner_Filter,
  type OpportunitySearchParams,
} from "@1.modules/opportunity.domain";
import type { _1_HOUR_ } from "@douglasduteil/datatypes...hours-to-seconds";
import type { Metadata, ResolvingMetadata } from "next";
import List from "./_client/List";

//

export const revalidate: _1_HOUR_ = 3600;

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Opportunities :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({
  searchParams,
}: {
  searchParams: OpportunitySearchParams;
}) {
  const { category, q: search, f: filter_param } = await searchParams;
  const filter_parsed_return = Partner_Filter.safeParse(filter_param);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await TRPC_SSR.opportunity.find.prefetchInfinite({
    category,
    filter,
    search,
  });

  return (
    <TRPC_Hydrate>
      <main className="md:my-10">
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
