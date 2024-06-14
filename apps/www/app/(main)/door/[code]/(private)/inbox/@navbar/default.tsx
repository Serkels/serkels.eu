//

import BackButton from ":components/button/BackButton";
import { TRPC_SSR } from ":trpc/server";
import { button } from "@1.ui/react/button/atom";
import { column_screen } from "@1.ui/react/grid/atom";
import { PenSquare } from "@1.ui/react/icons";
import Link from "next/link";
import Infinite_Thread_List from "./_client/Infinite_Thread_List";
import SearchForm from "./_client/SearchForm";

//

export default async function Page() {
  await TRPC_SSR.inbox.find.prefetchInfinite({});

  return (
    <div className={column_screen({ className: "pt-10 [&>*]:px-8" })}>
      <div className="flex items-center justify-between">
       
        <h6 className="pl-2 text-2xl font-bold">Messages</h6>
        <Link
          className={button({ intent: "danger" })}
          href={"/@~/inbox/write_to"}
        >
          Écrire
          <PenSquare className="ml-2 size-4" />
        </Link>
      </div>
      <SearchForm />
      <nav className="flex-1 overflow-y-auto py-8">
        <Infinite_Thread_List />
      </nav>
    </div>
  );
}
