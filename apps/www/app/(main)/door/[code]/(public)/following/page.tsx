//

import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const List = dynamic(() => import("./_client/List"), {
  ssr: false,
  loading() {
    return <Spinner />;
  },
});

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

export default async function Page() {
  await TRPC_SSR.profile.me.follows.prefetchInfinite({});

  return (
    <main className={column_screen({ className: "bg-white text-black" })}>
      <h6 className="mt-10 px-8 text-2xl font-bold">Liste d'abonnés : </h6>
      <List />
    </main>
  );
}
