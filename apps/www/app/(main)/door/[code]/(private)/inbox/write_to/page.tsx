//

import BackButton from ":components/button/BackButton";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import type { Metadata, ResolvingMetadata } from "next";
import Infinite_Contacts_List from "./_client/Infinite_Contacts_List";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Write to :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page() {
  await TRPC_SSR.legacy_profile.me.contacts.prefetchInfinite({});

  return (
    <TRPC_Hydrate>
      <main className={column_screen({ className: "bg-white text-black" })}>
        <div className="flex flex-row items-center gap-2 px-6">
          <BackButton href={"/@~/inbox"} />
          <h6 className="my-10 pl-2 text-2xl font-bold">
            Écrire à mes cercles
          </h6>
        </div>
        <Infinite_Contacts_List />
      </main>
    </TRPC_Hydrate>
  );
}
