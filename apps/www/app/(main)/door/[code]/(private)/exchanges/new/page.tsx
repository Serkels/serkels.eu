//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { Create_Exchange_Island } from "./page.client";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `New :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page() {
  await TRPC_SSR.category.exchange.prefetch();

  return (
    <TRPC_Hydrate>
      <main className="mx-auto my-10 max-w-3xl px-4">
        <Create_Exchange_Island />
      </main>
    </TRPC_Hydrate>
  );
}
