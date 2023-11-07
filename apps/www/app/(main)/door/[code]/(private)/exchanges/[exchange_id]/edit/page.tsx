//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_SSR } from ":trpc/server";
import {
  Exchange_Create_Schema,
  type Exchange_Create,
} from "@1.modules/exchange.domain";
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
    <main className="mx-auto my-10 max-w-3xl px-4">
      <Mutate_Exchange
        categories={categories}
        exchange={Exchange_Create_Schema.parse({
          ...exchange,
          category: exchange.category_id,
          return: exchange.return_id,
        } as Exchange_Create)}
      />
    </main>
  );
}
