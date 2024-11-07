//

import { code_to_profile_id, type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { Card } from ":widgets/opportunities/card";
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

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  const profile_id = await code_to_profile_id(params);
  if (!profile_id) {
    notFound();
  }

  const { data: opportunities } =
    await TRPC_SSR.opportunity.by_profile_id.fetch({
      profile_id,
    });

  if (!opportunities.length) {
    return (
      <main>
        <figure className="mt-28  text-center">
          <h3 className="text-xl">Aucune opportunité publiée.</h3>
        </figure>
      </main>
    );
  }
  return (
    <main
      className="
        max-w-8xl
        mx-10
        my-10
        grid
        grid-flow-row
        grid-cols-2
        gap-8
        lg:grid-cols-5
      "
    >
      {opportunities.map((data) => (
        <Card key={data.id} opportunity={data} />
      ))}
    </main>
  );
}
