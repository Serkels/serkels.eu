//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import { PlusBox } from "@1.ui/react/icons";
import { link } from "@1.ui/react/link/atom";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import List from "./_client/List";

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

  await TRPC_SSR.exchanges.find.prefetchInfinite({
    category,
    filter,
    search,
  });

  return (
    <TRPC_Hydrate>
      <main>
        <NewExchangeSection />

        <List />
      </main>
    </TRPC_Hydrate>
  );
}

async function NewExchangeSection() {
  const session = await getServerSession();

  if (!session) return null;

  const { base } = card();
  return (
    <section>
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
      <hr className="my-8 border-none"></hr>
    </section>
  );
}
