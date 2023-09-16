//

import { Hydrate, dehydrate, type InfiniteData } from "@tanstack/react-query";
import { Suspense } from "react";
import { get_StrapiRepository } from "~/core";
import { getQueryClient } from "~/core/getQueryClient";
import { Exchange_Repository } from "~/modules/exchange/infrastructure";
import { Exchange_QueryKeys } from "~/modules/exchange/queryKeys";
import { ExchangeList } from "./ExchangeList";

//

export const dynamic = "force-dynamic";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const strapi_repository = await get_StrapiRepository();
  const repository = new Exchange_Repository(strapi_repository);

  const category = searchParams["category"] ?? undefined;
  const search = searchParams["q"] ?? undefined;

  const filter = { category, search };
  const queryClient = getQueryClient();
  {
    await queryClient.prefetchInfiniteQuery({
      queryKey: Exchange_QueryKeys.lists(filter),
      queryFn: () =>
        repository.find_all({
          filter,
          sort: ["createdAt:desc"],
          pagination: { pageSize: 4 },
        }),
    });
  }
  {
    const { pages } = queryClient.getQueryData<
      InfiniteData<Awaited<ReturnType<typeof repository.find_all>>>
    >(Exchange_QueryKeys.lists(filter)) ?? { pages: [] };

    for (const { data: exchanges } of pages) {
      for (const data of exchanges ?? []) {
        queryClient.setQueryData(
          Exchange_QueryKeys.item(Number(data?.id)),
          data,
        );
      }
    }
  }

  const dehydratedState = dehydrate(queryClient);
  return (
    <Hydrate state={dehydratedState}>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <Suspense>
          <ExchangeList />
        </Suspense>
      </main>
    </Hydrate>
  );
}
