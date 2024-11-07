//

import type { Params } from ":pipes/exchange_by_id";
import { proxyClient } from ":trpc/server";
import type { Metadata, ResolvingMetadata } from "next";
import type { PropsWithChildren, ReactNode } from "react";
import { Aside } from "./layout.client";

//

export async function generateMetadata(
  props: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const params = await props.params;

  const { exchange_id } = params;

  const { title } = await proxyClient.exchanges.by_id.query(exchange_id);
  return {
    title: `${title} :: ${(await parent).title?.absolute}`,
  };
}

//

export default async function Layout(
  props: PropsWithChildren<{
    navbar: ReactNode;
    params: Params;
  }>,
) {
  const params = await props.params;

  const { children, navbar } = props;

  return (
    <div className="grid h-full lg:grid-cols-[minmax(0,_300px),_1fr]">
      <Aside className="border-l border-[#F0F0F0]" params={params}>
        {navbar}
      </Aside>
      <div className="bg-white max-lg:has-[>_.hidden]:hidden">{children}</div>
    </div>
  );
}
