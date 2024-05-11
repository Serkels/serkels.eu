//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import to from "await-to-js";
import Link from "next/link";
import { notFound } from "next/navigation";
import Infinite_Thread_List from "./_client/Infinite_Thread_List";

//

export default async function DealNavbarPage({ params }: { params: Params }) {
  const { exchange_id } = params;

  try {
    const [exchange_err, exchange] = await to(
      TRPC_SSR.exchanges.by_id.fetch(exchange_id),
    );
    if (exchange_err) {
      notFound();
    }

    await TRPC_SSR.exchanges.me.inbox.by_exchange_id.prefetchInfinite({
      exchange_id,
    });

    return (
      <div className={column_screen({ className: "pt-10 [&>*]:px-8" })}>
        <header className="flex h-16 items-center justify-start space-x-7">
          <div className="flex flex-col">
            <h6 className="line-clamp-2 flex-1 text-xl font-bold">
              {exchange.title}
            </h6>
            <Link
              href={{
                pathname: "/exchanges",
                query: { q: exchange.title },
              }}
            >
              Consulter l'échange
            </Link>
          </div>
        </header>

        <hr className="my-6 border border-[#F0F0F0]" />

        <nav
          className="
            my-8
            min-h-0
            flex-1
            overflow-y-auto
            px-8
          "
        >
          <Infinite_Thread_List exchange_id={exchange_id} />
        </nav>
      </div>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}
