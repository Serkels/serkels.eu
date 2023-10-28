//

import { TRPC_SSR } from ":trpc/server";
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
    <div className="flex h-full max-h-[calc(100vh_-_theme(spacing.36))] flex-col space-y-6">
      <div className="flex justify-between">
        <h6 className="px-8 text-2xl font-bold">Messages</h6>
        <button>Écrire</button>
      </div>
      <SearchForm />
      <nav
        className="
          -mx-8
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
