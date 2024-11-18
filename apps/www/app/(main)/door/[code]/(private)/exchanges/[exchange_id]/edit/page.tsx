//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_Hydrate } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Mutate_Exchange_Island } from "./page.client";
import { trpc_server } from "@1.infra/trpc/react-query/server";

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

export default async function Page(props: { params: Promise<Params> }) {
  const params = await props.params;
  const { exchange_id } = params;

  await trpc_server.exchanges.by_id.prefetch(exchange_id);
  await trpc_server.category.exchange.prefetch();

  return (
    <TRPC_Hydrate>
      <main className="mx-auto my-10 max-w-3xl px-4">
        <Mutate_Exchange_Island exchange_id={exchange_id} />
      </main>
    </TRPC_Hydrate>
  );
}
