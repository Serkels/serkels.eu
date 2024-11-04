//

import { Exchange_Card } from ":widgets/exchanges/card";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import { auth } from "@1.modules/auth.next";
import type { Metadata, ResolvingMetadata } from "next";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Exchanges :: ${(await parent).title?.absolute}`,
  };
}

//
export default async function Page() {
  const session = await auth();
  const { data: exchanges } =
    await trpc_server.bookmarks.exchanges.find.fetch();

  if (!session) return null;
  if (exchanges.length === 0)
    return <>Il n'y a aucun échange dans vos sauvegardes pour le moment</>;

  return (
    <main className="grid grid-cols-1 gap-y-5">
      {exchanges.map((exchange) => (
        <Exchange_Card
          key={exchange.id}
          exchange={exchange}
          profile={session.profile}
        />
      ))}
    </main>
  );
}
