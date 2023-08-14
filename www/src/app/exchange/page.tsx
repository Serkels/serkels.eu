//

import { Hydrate, dehydrate } from "@tanstack/react-query";
import { fromServer } from "../api/v1";
import { getQueryClient } from "../getQueryClient";
import { ExchangeList } from "./ExchangeList";
import { SeeAlso } from "./SeeAlso";
import { ExchangeRepository } from "./data/ExchangeRepository";

//

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const search = searchParams["q"] as string | undefined;
  const page = searchParams["p"] as string | undefined;
  const category = searchParams["category"] as string | undefined;

  const queryClient = getQueryClient();
  await queryClient.prefetchQuery(
    ["exchange", { category, search, page }],
    () =>
      new ExchangeRepository(fromServer).load({
        category,
        page,
        search,
      }),
  );
  const dehydratedState = dehydrate(queryClient);

  return (
    <Hydrate state={dehydratedState}>
      <main className="col-span-full my-10 md:col-span-6 xl:col-span-6 ">
        <ExchangeList />
      </main>
      <aside className="col-span-3 hidden lg:px-10 xl:block">
        <SeeAlso />
      </aside>
    </Hydrate>
  );
}
