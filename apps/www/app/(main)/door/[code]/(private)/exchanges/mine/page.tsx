//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { Exchange_Card } from ":widgets/exchanges/card";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";

//

export async function generateMetadata(
  _: unknown,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Mine :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Page({ params }: { params: CodeParms }) {
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);
  const exchanges = await TRPC_SSR.exchanges.me.publications.fetch({});

  return (
    <main className="mx-auto my-10 grid grid-cols-1 gap-y-5 px-4 md:max-w-4xl">
      {exchanges.map((exchange) => (
        <Exchange_Card
          key={exchange.id}
          exchange={exchange}
          profile={profile}
        />
      ))}
    </main>
  );
}
