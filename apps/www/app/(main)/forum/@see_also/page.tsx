//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import List from ":widgets/opportunities/list";
import type { ForumSearchParams } from "@1.modules/forum.domain";
import Link from "next/link";

//

export default async function Page({
  searchParams,
}: {
  searchParams: ForumSearchParams;
}) {
  const { category } = await searchParams;

  await Promise.all([
    TRPC_SSR.opportunity.find.prefetchInfinite({
      category,
      limit: 5,
    }),
    TRPC_SSR.opportunity.find.prefetchInfinite({
      limit: 5,
    }),
  ]);

  return (
    <article>
      <Link href="/opportunities">
        <h2 className="mb-7 text-center text-lg font-bold text-Congress_Blue">
          Voir aussi : Opportunités pros
        </h2>
      </Link>
      <TRPC_Hydrate>
        <List category={category} />
      </TRPC_Hydrate>
    </article>
  );
}
