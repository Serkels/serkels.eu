//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import Infinite_Thread_List from "./_client/Infinite_Thread_List";

//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

//

export default async function Page({ params }: { params: Params }) {
  const { exchange_id } = params;
  await TRPC_SSR.exchanges.me.inbox.by_exchange_id.prefetchInfinite({
    exchange_id,
  });

  return (
    <div className={column_screen({ className: "[&>*]:px-8" })}>
      <SearchForm />
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
}
