"use client";

import { fromClient } from "@/app/api/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { QACard } from "./QACard";
import { QARepository } from "./QARepository";

//

export function QAList({
  category,
  search,
}: {
  category: string | undefined;
  search: string | undefined;
}) {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["q&a", { category, search }],
    queryFn: () =>
      new QARepository(fromClient).load({
        category,
        limit: 6,
        page: undefined,
        pageSize: undefined,
        search,
      }),
  });
  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;

  return (
    <ul className="grid grid-cols-1 gap-9">
      {data
        .sort(
          (a, b) =>
            Date.parse(b.attributes?.createdAt!) -
            Date.parse(a.attributes?.createdAt!),
        )
        .map((exchange) => (
          <li key={exchange.id}>
            <QACard {...exchange} />
          </li>
        ))}
    </ul>
  );
}
