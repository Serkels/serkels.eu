//

import { TRPC_SSR } from ":trpc/server";
import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Client_Page } from "./page.client";

export default async function Page() {
  console.log("app/(_)/test/page.tsx");
  await TRPC_SSR.hello.prefetch({ name: "Dino" });
  console.log("TRPC_SSR.hello.prefetch");

  const dehydratedState = dehydrate(TRPC_SSR.queryClient);

  return (
    <main>
      <h1>Test Page</h1>

      <br />

      <Hydrate state={dehydratedState}>
        <Client_Page />
      </Hydrate>
    </main>
  );
}
