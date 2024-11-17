//

import { TRPC_Hydrate } from ":trpc/server";
import { List } from ":widgets/exchanges/list";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import { auth } from "@1.modules/auth.next";
import {
  Exchange_Filter,
  type ExchangeSearchParams,
} from "@1.modules/exchange.domain";
import { card } from "@1.ui/react/card/atom";
import { PlusBox } from "@1.ui/react/icons";
import { link } from "@1.ui/react/link/atom";
import type { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";

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
  searchParams: ExchangeSearchParams;
}) {
  const { category, q: search, f: filter_param } = await searchParams;
  const filter_parsed_return = Exchange_Filter.safeParse(filter_param);
  const filter = filter_parsed_return.success
    ? filter_parsed_return.data
    : undefined;

  await trpc_server.exchanges.find.prefetchInfinite({
    category,
    filter,
    search,
  });

  return (
    <TRPC_Hydrate>
      <main>
        <NewExchangeSection />

        <List key="list" />
      </main>
    </TRPC_Hydrate>
  );
}

async function NewExchangeSection() {
  const session = await auth();

  if (!session) return null;
  if (session.profile.role !== "STUDENT") return null;

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
