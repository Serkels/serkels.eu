//

import { TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import { CreateExchangeForm } from "./page.client";

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
  const categories = await TRPC_SSR.category.exchange.fetch();
  return (
    <main className="mx-auto my-10 max-w-3xl px-4">
      <CreateExchangeForm categories={categories} />
    </main>
  );
}
