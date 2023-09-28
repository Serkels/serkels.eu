//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { JWT_TOKEN } from "~/app/api/v1/OpenAPI.repository";
import { injector } from "~/core/di";
import { getQueryClient } from "~/core/getQueryClient";
import { Get_Exchanges_UseCase } from "~/modules/exchange/application/get_exchanges.use-case";
import { Exchange_List } from "./page.client";

//

export const dynamic = "force-dynamic";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  console.log("< src/app/(main)/exchange/page.tsx");
  const category = searchParams["category"] ?? undefined;
  const search = searchParams["q"] ?? undefined;

  const filters = { category, title: search };
  const queryClient = getQueryClient();

  const container = await injector();
  const jwt = container.resolve(JWT_TOKEN);
  console.log("< src/app/(main)/exchange/page.tsx", { jwt });
  await container.resolve(Get_Exchanges_UseCase).prefetch(filters);

  const dehydratedState = dehydrate(queryClient);

  console.log("</ src/app/(main)/exchange/page.tsx");

  return (
    <Hydrate state={dehydratedState}>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <Suspense>
          <Exchange_List />
        </Suspense>
      </main>
    </Hydrate>
  );
}
