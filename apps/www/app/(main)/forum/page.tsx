//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Forum_Filter } from "@1.modules/forum.domain";
import { Idle as CreateCard_Idle } from "@1.modules/forum.ui/CreateCard/Idle";
import InputSearch from "@1.ui/react/input/InputSearch";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { match } from "ts-pattern";

//

const List = dynamic(() => import("./_client/List"), {
  ssr: false,
  loading() {
    return <Spinner />;
  },
});

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

const Create = dynamic(() => import("./_client/Create"), {
  ssr: false,
  loading() {
    return <CreateCard_Idle />;
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
  const session = await getServerSession();

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
        <SearchForm />
        {match(session)
          .with({ profile: { role: "STUDIENT" } }, () => (
            <>
              <hr className="my-5 border-none" />
              <Create />
            </>
          ))
          .otherwise(() => null)}
        <hr className="my-10" />
        <List />
      </main>
    </TRPC_Hydrate>
  );
}
