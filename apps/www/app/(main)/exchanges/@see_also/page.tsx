//

import { TRPC_Hydrate } from ":trpc/server";
import List from ":widgets/opportunities/list";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import type { ExchangeSearchParams } from "@1.modules/exchange.domain";
import Link from "next/link";

//

export default async function Page({
  searchParams,
}: {
  searchParams: ExchangeSearchParams;
}) {
  const { category } = await searchParams;

  await trpc_server.opportunity.find.prefetchInfinite({
    category,
    limit: 5,
  });

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
