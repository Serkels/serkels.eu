//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { Card } from ":widgets/opportunities/card";
import { PROFILE_ROLES } from "@1.modules/profile.domain";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound, redirect } from "next/navigation";

//

export async function generateMetadata(
  _: any,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `Opportunities :: ${(await parent).title?.absolute}`,
  };
}

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const profile_id = await code_to_profile_id(params);

  if (!profile_id) {
    return notFound();
  }

  const profile = await TRPC_SSR.legacy_profile.by_id.fetch(profile_id);
  if (profile.role !== PROFILE_ROLES.Enum.PARTNER) {
    redirect(`/@${params.code}`);
  }

  const { data: opportunities } =
    await TRPC_SSR.opportunity.by_profile_id.fetch({
      profile_id,
    });

  if (opportunities.length === 0)
    return <>Il n'y a aucune opportunité à afficher pour le moment</>;

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
        <Card key={data.id} opportunity={data} />
      ))}
    </main>
  );
}
