//

import { type CodeParms } from ":pipes/code";
import { TRPC_SSR } from ":trpc/server";
import { column_screen } from "@1.ui/react/grid/atom";
import type { Metadata, ResolvingMetadata } from "next";
import { redirect } from "next/navigation";
import Infinite_Contacts_List from "./_client/Infinite_Contacts_List";

//

export async function generateMetadata(
  _: never,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const title = `Cercles :: ${(await parent).title?.absolute}`;

  return {
    title,
    openGraph: {
      title,
    },
  };
}

//

export default async function Page(props: { params: Promise<CodeParms> }) {
  const params = await props.params;
  if (params.code !== "~") {
    redirect(`/@${params.code}`);
  }

  await TRPC_SSR.profile.me.contacts.prefetchInfinite({});

  return (
    <main className={column_screen({ className: "bg-white text-black" })}>
      <h6 className="mt-10 pl-6 text-2xl font-bold md:pl-8">Mes cercles : </h6>
      <Infinite_Contacts_List />
    </main>
  );
}
