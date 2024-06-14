//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Mutate_Exchange } from "./page.client";

//

export async function generateMetadata(
  params: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const { exchange_id } = params;
  return {
    title: `Edit ${exchange_id} :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: Params }) {
  const { exchange_id } = params;

  const exchange = await TRPC_SSR.exchanges.by_id.fetch(exchange_id);
  const categories = await TRPC_SSR.category.exchange.fetch();
  return (
    <TRPC_Hydrate>
      <main className="mx-auto my-10 max-w-3xl px-4">
        <Mutate_Exchange
          categories={categories}
          exchange={{
            ...exchange,
            category_id: exchange.category_id,
            return_id: exchange.return_id,
          }}
        />
      </main>
    </TRPC_Hydrate>
  );
}
