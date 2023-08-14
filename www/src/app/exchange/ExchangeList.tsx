"use client";

import { fromClient } from "@/app/api/v1";
import { useSyncSearchQuery } from "@/components/useSyncSearchQuery";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { ExchangeCard } from "./ExchangeCard";
import { ExchangeRepository } from "./data/ExchangeRepository";
import { ExchangeViewModel } from "./models/ExchangeViewModel";

//

export function ExchangeList() {
  const { query: category } = useSyncSearchQuery("category");
  const { query: search } = useSyncSearchQuery("q");
  const { query: page } = useSyncSearchQuery("p");

  const {} = useSession();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchange", { category, search, page }],
    queryFn: () =>
      new ExchangeRepository(fromClient).load({
        category,
        page,
        search,
      }),
  });

  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;

  const { data: exchanges } = data;

  return (
    <ul className="grid grid-cols-1 gap-8">
      {exchanges.map(ExchangeViewModel.from_server).map((exchange) => (
        <li key={exchange.id} className="mx-auto xl:max-w-3xl">
          <ExchangeCard exchange={exchange} />
        </li>
      ))}
    </ul>
  );
}
