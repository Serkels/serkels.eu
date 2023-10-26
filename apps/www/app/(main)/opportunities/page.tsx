//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const List = dynamic(() => import("./_client/List"), {
  loading() {
    return <Spinner />;
  },
});

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Opportunities :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const category = String(searchParams["category"]) ?? undefined;
  const search = String(searchParams["q"]) ?? undefined;

  await TRPC_SSR.opportunity.find.prefetchInfinite({
    category,
    search,
  });

  return (
    <TRPC_Hydrate>
      <main className="my-10 max-w-6xl">
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
