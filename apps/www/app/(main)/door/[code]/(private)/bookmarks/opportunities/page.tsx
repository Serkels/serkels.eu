//

import { Item } from ":app/(main)/opportunities/_client/Item";
import { TRPC_SSR } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Opportunities :: ${(await parent).title?.absolute}`,
  };
}

//
export default async function Page() {
  const { data: opportunities } =
    await TRPC_SSR.bookmarks.opportunities.find.fetch();

  if (opportunities.length === 0)
    return (
      <>Il n'y a aucune opportunité pro dans vos sauvegardes pour le moment</>
    );

  return (
    <main
      className="
        grid
        grid-flow-row
        grid-cols-2
        gap-8
        lg:grid-cols-3
      "
    >
      {opportunities.map((data) => (
        <Item key={data.id} opportunity={data} />
      ))}
    </main>
  );
}
