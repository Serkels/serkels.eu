//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Partner_Filter } from "@1.modules/opportunity.domain";
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
  const session = await getServerSession();
  const category = String(searchParams["category"]);
  const search = String(searchParams["q"]);
  const filter_parsed_return = Partner_Filter.safeParse(searchParams["f"]);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  if (session) {
    await TRPC_SSR.opportunity.find.private.prefetchInfinite({
      category,
      filter,
      search,
    });
  } else {
    await TRPC_SSR.opportunity.find.public.prefetchInfinite({
      category,
      search,
    });
  }

  return (
    <TRPC_Hydrate>
      <main className="my-10 max-w-6xl">
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
