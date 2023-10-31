//

import { TRPC_SSR } from ":trpc/server";
import { Spinner } from "@1.ui/react/spinner";
import type { Metadata, ResolvingMetadata } from "next";
import dynamic from "next/dynamic";
import { tv } from "tailwind-variants";

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

  const { base } = layout();
  return (
    <main className={base()}>
      <h6 className="my-10 px-8 text-2xl font-bold">Écrire à</h6>
      <Infinite_Contacts_List />
    </main>
  );
}

const layout = tv({
  base: `
    grid
    h-full
    max-h-[calc(100vh_-_theme(spacing.16)-_theme(spacing.8))]
    bg-white
    text-black
  `,
  slots: {
    list: "",
  },
});
