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
  const title = `Exchange :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  await TRPC_SSR.exchange.find.prefetchInfinite({});

  return (
    <TRPC_Hydrate>
      <main>
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
