//

import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";

//

const Infinite_Contacts_List = dynamic(
  () => import("./_client/Infinite_Contacts_List"),
  {
    ssr: false,
    loading() {
      return <Spinner />;
      // return <InputSearch />;
    },
  },
);

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
  await TRPC_SSR.profile.me.contacts.prefetchInfinite({});

  return (
    <main className={column_screen({ className: "bg-white text-black" })}>
      <h6 className="my-10 px-8 text-2xl font-bold">Écrire à</h6>
      <Infinite_Contacts_List />
    </main>
  );
}
