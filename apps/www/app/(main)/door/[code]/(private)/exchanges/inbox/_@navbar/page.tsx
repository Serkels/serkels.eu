//

import { TRPC_SSR } from ":trpc/server";
import { getServerSession } from "@1.modules/auth.next";
import { column_screen } from "@1.ui/react/grid/atom";
import InputSearch from "@1.ui/react/input/InputSearch";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import Infinite_Exchange_List from "./_client/Infinite_Exchange_List";

//

const SearchForm = dynamic(() => import("./_client/SearchForm"), {
  ssr: false,
  loading() {
    return <InputSearch />;
  },
});

//

export default async function Page() {
  const session = await getServerSession();
  if (!session) {
    notFound();
  }
  const profile_id = session.profile.id;

  await TRPC_SSR.exchanges.by_profile.prefetchInfinite({ profile_id });

  return (
    <div className={column_screen()}>
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
        <Infinite_Exchange_List profile_id={profile_id} />
      </nav>
    </div>
  );
}
