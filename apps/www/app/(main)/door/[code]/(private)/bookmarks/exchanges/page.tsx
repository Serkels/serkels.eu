//

import { TRPC_SSR } from ":trpc/server";
import { Exchange_Card } from ":widgets/exchanges/card";
import { getServerSession } from "@1.modules/auth.next";
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
  const session = await getServerSession();
  const { data: exchanges } = await TRPC_SSR.bookmarks.exchanges.find.fetch();

  if (!session) return null;
  if (exchanges.length === 0) return <>N/A exchanges</>;

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
