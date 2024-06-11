//

import type { CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import List from "./_client/List";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Abonnés :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({ params }: { params: CodeParms }) {
  if (params.code !== "~") {
    redirect(`/@${params.code}`);
  }

  await TRPC_SSR.profile.me.follows.prefetchInfinite({});

  return (
    <main className={column_screen({ className: "bg-white text-black" })}>
      <h6 className="mt-10 pl-2 text-2xl font-bold">Liste d'abonnés : </h6>
      <List />
    </main>
  );
}
