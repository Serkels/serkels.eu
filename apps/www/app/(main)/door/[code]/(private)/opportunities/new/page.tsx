//

import { TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import CreateOpportunityForm from "./_client/CreateOpportunityForm";

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
  const categories = await TRPC_SSR.category.opportunity.fetch();

  return (
    <main className="mx-auto my-10 max-w-3xl px-4">
      <CreateOpportunityForm categories={categories} />
    </main>
  );
}
