//

import type { Params } from ":pipes/exchange_by_id";
import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { notFound } from "next/navigation";
import type { PropsWithChildren } from "react";

//

export default async function Layout({
  children,
  params,
}: PropsWithChildren<{ params: Params }>) {
  const { exchange_id } = params;
  try {
    await TRPC_SSR.exchanges.by_id.prefetch(exchange_id);
  } catch {
    notFound();
  }
  return (
    <TRPC_Hydrate>
      <main className="my-14">{children}</main>
    </TRPC_Hydrate>
  );
}
