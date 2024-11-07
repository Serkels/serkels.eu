//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Exchange_Card } from ":widgets/exchanges/card";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import { tv } from "tailwind-variants";

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

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    notFound();
  }

  const profile = await TRPC_SSR.profile.by_id.fetch(profile_id);
  const exchanges = await TRPC_SSR.exchanges.me.publications.fetch({});

  const { base, empty } = main();
  if (exchanges.length === 0) {
    return (
      <main className={base()}>
        <div className={empty()}>Aucun échange trouvé</div>
      </main>
    );
  }

  return (
    <TRPC_Hydrate>
      <main className={base()}>
        {exchanges.map((exchange) => (
          <Exchange_Card
            key={exchange.id}
            exchange={exchange}
            profile={profile}
          />
        ))}
      </main>
    </TRPC_Hydrate>
  );
}

const main = tv({
  base: `
    mx-auto
    my-10
    grid
    grid-cols-1
    gap-y-5
    px-4
    md:max-w-4xl
  `,
  slots: {
    empty: `
      my-20
      text-center
      text-2xl
      font-bold
    `,
  },
});
