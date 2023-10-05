//

import { get_trpc } from ":trpc/server";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { Exchange_List } from "./page.client";

//

export default async function Outlet(props: any) {
  const trpc = await get_trpc();
  await Promise.all([
    trpc.profile.me.prefetch(),
    trpc.exchange.all.prefetchInfinite({}),
  ]);

  const dehydratedState = dehydrate(trpc.queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <Page {...props} />
    </Hydrate>
  );
}

export async function Page() {
  return (
    <main>
      <Suspense>
        <Exchange_List />
      </Suspense>
    </main>
  );
}
