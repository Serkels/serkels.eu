//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import { PlusBox } from "@1.ui/react/icons";
import { link } from "@1.ui/react/link/atom";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";

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
  const title = `Exchange :: ${(await parent).title?.absolute}`;

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
  const category = String(searchParams["category"]);
  const search = String(searchParams["q"]);
  const filter_parsed_return = Exchange_Filter.safeParse(searchParams["f"]);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await TRPC_SSR.exchanges.find.prefetchInfinite({ category, filter, search });

  return (
    <TRPC_Hydrate>
      <main>
        <NewExchangeButton />

        <hr className="my-8 border-none"></hr>

        <List />
      </main>
    </TRPC_Hydrate>
  );
}

function NewExchangeButton() {
  const { base } = card();
  return (
    <div className={base()}>
      <Link
        className={link({
          className: "flex items-center justify-center space-x-3 p-3",
        })}
        href={"/@~/exchanges/new"}
      >
        <PlusBox className="h-5" /> <div>Créer un nouvel échange</div>
      </Link>
    </div>
  );
}
