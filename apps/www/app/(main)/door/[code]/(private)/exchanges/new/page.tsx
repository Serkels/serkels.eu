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
    <main className="col-span-full my-10 px-4 md:col-span-6 xl:col-span-8">
      <CreateExchangeForm categories={categories} />
    </main>
  );
}
