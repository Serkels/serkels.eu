//

import BackButton from ":components/button/BackButton";
import type { Params } from ":pipes/exchange_by_id";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { type Exchange } from "@1.modules/exchange.domain";
import { TitleHeader } from "@1.modules/exchange.ui/aside/TitleHeader";
import { column_screen } from "@1.ui/react/grid/atom";
import { Menu } from "@1.ui/react/menu";
import to from "await-to-js";
import { notFound } from "next/navigation";
import Infinite_Thread_List from "./_client/Infinite_Thread_List";
import { DeleteExchange_ActionItem } from "./_client/menu";

//

export default async function DealNavbarPage(props: {
  params: Promise<Params>;
}) {
  const params = await props.params;
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
    await TRPC_SSR.exchanges.me.archive.has.prefetch({
      exchange_id,
    });

    return (
      <TRPC_Hydrate>
        <div className={column_screen({ className: "pt-10 " })}>
          <header className="flex h-16 items-center gap-4 px-5">
            <BackButton href={"/@~/exchanges/inbox"} />
            <TitleHeader className="flex-1" exchange={exchange} />
            <ExchangeMenu exchange={exchange} />
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
      </TRPC_Hydrate>
    );
  } catch (error) {
    console.error(error);
    notFound();
  }
}

function ExchangeMenu({ exchange }: { exchange: Exchange }) {
  return (
    <Menu>
      <DeleteExchange_ActionItem exchange_id={exchange.id} />
    </Menu>
  );
  // FIXME(douglasduteil): only show delete exchange menu for some exchanges
  // return match({ exchange, is_expired: is_expired_exchange(exchange) })
  //   .with({ is_expired: true }, () => (
  //     <Menu>
  //       <DeleteExchange_ActionItem exchange_id={exchange.id} />
  //     </Menu>
  //   ))
  //   .otherwise(() => null);
}
