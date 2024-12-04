//

import { NotConnected_Placeholder } from ":components/placeholder/NotConnected_Placeholder";
import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Exchange_Card } from ":widgets/exchanges/card";
import { getServerSession } from "@1.modules/auth.next";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `History :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const profile_id = await code_to_profile_id(params);

  if (!profile_id) {
    notFound();
  }

  const profile = await TRPC_SSR.legacy_profile.by_id.fetch(profile_id);
  if (profile.role !== PROFILE_ROLES.Enum.STUDENT) {
    redirect(`/@${params.code}`);
  }

  const { data: exchanges } = await TRPC_SSR.exchanges.by_particitpant.fetch({
    profile_id,
  });
  const session = await getServerSession();
  if (!session) {
    return <NotConnected_Placeholder />;
  }
  if (exchanges.length === 0)
    return <>Il n'y a aucun historique pour le moment</>;
  return (
    <TRPC_Hydrate>
      <main className="grid grid-cols-1 gap-y-5">
        {exchanges.map((exchange) => (
          <Exchange_Card
            key={exchange.id}
            exchange={exchange}
            profile={session.profile}
          />
        ))}
      </main>
    </TRPC_Hydrate>
  );
}
