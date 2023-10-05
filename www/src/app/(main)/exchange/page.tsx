//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";
import { getQueryClient } from "~/core/getQueryClient";
import { Get_Exchanges_UseCase } from "~/modules/exchange/application/get_exchanges.use-case";

import { NextTsyringe } from "@1/next-tsyringe";
import { Exchange_Module } from "./layout";
import { Exchange_List } from "./page.client";

//

export const dynamic = "force-dynamic";

//

@NextTsyringe.module({
  parent: Exchange_Module,
})
export class Exchange_PageModule {
  static Provider = Exchange_Page;
}
export default Exchange_PageModule.Provider;

//
//
//

export async function Exchange_Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const category = searchParams["category"] ?? undefined;
  const search = searchParams["q"] ?? undefined;

  const filters = { category, title: search };
  const queryClient = getQueryClient();

  const container = NextTsyringe.injector(Exchange_Module);
  await container.resolve(Get_Exchanges_UseCase).prefetch(filters);

  const dehydratedState = dehydrate(queryClient);

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
