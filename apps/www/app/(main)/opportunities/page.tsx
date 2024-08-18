//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Partner_Filter } from "@1.modules/opportunity.domain";
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
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const session = await getServerSession();
  const category = String(searchParams["category"]);
  const search = String(searchParams["q"]);
  const filter_parsed_return = Partner_Filter.safeParse(searchParams["f"]);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  if (session) {
    await TRPC_SSR.opportunity.find.private.prefetchInfinite({
      category,
      filter,
      search,
    });
  } else {
    await TRPC_SSR.opportunity.find.public.prefetchInfinite({
      category,
      search,
    });
  }

  return (
    <TRPC_Hydrate>
      <main className="max-w-6xl md:my-10">
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
