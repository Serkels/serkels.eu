//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import Infinite_Exchange_List from "./_client/Infinite_Exchange_List";
import SearchForm from "./_client/SearchForm";

//

export default async function Page() {
  await TRPC_SSR.exchanges.me.find.prefetchInfinite({});

  return (
    <TRPC_Hydrate>
      <div className={column_screen({ className: "pt-10" })}>
        <SearchForm className="px-8" />
        <nav className="my-8 min-h-0 flex-1 overflow-y-auto">
          <Infinite_Exchange_List />
        </nav>
      </div>
    </TRPC_Hydrate>
  );
}
