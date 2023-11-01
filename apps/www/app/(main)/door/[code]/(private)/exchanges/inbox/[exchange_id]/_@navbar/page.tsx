//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import { notFound } from "next/navigation";
import Infinite_Thread_List from "./_client/Infinite_Thread_List";

//

export default async function Page({ params }: { params: Params }) {
  const { exchange_id } = params;

  try {
    const exchange = await TRPC_SSR.exchanges.by_id.fetch(exchange_id);

    await TRPC_SSR.exchanges.me.inbox.by_exchange_id.prefetchInfinite({
      exchange_id,
    });

    return (
      <div className={column_screen({ className: "[&>*]:px-8" })}>
        <header className="flex h-16 items-center justify-start space-x-7">
          <h6 className="line-clamp-2 flex-1 text-xl font-bold">
            {exchange.title}
          </h6>
        </header>

        <hr className="my-6 border-2 border-[#F0F0F0]" />

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
