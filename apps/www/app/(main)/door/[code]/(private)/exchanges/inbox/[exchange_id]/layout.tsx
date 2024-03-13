//

import type { Params } from ":pipes/exchange_by_id";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";

//

export async function generateMetadata(
  params: Params,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  return {
    title: `${params.exchange_id} :: ${(await parent).title?.absolute}`,
  };
}

//
export default function Layout({
  children,
  nav,
  params,
}: PropsWithChildren<{ params: Params; nav: ReactNode }>) {
  //! HACK(douglasduteil): Investigate way the param is "undefined" on direct page access
  if (params.exchange_id === "undefined") return null;

  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,_300px),_1fr]">
      <aside className="hidden pt-10 md:block">{nav}</aside>
      <div className="bg-white">{children}</div>
    </div>
  );
}
