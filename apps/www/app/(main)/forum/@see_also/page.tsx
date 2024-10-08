//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import List from ":widgets/opportunities/list";
import Link from "next/link";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = String(searchParams["category"] ?? "");

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
