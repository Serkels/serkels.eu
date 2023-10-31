//

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

export default async function Page() {
  await TRPC_SSR.inbox.find.prefetchInfinite({});

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
        <Infinite_Thread_List />
      </nav>
    </div>
  );
}
