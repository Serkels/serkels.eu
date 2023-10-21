//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Forum_Filter } from "@1.modules/forum.domain";
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
  const title = `Forum StudHelp :: ${(await parent).title?.absolute}`;

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
  const filter_parsed_return = Forum_Filter.safeParse(searchParams["f"]);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await TRPC_SSR.forum.question.find.prefetchInfinite({
    category,
    search,
    filter,
  });

  return (
    <TRPC_Hydrate>
      <main>
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
