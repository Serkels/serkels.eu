//

import type { Params } from ":pipes/exchange_by_id";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";
import { Aside } from "./layout.client";

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
  navbar,
  params,
}: PropsWithChildren<{
  navbar: ReactNode;
  params: Params;
}>) {
  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,_300px),_1fr]">
      <Aside className="border-l border-[#F0F0F0]" params={params}>
        {navbar}
      </Aside>
      <div className="bg-white max-lg:has-[>_.hidden]:hidden">{children}</div>
    </div>
  );
}
