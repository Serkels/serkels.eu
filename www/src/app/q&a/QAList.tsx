"use client";

import { fromClient } from "@/app/api/v1";
import { useSetQueryCacheById } from "@/components/useSetQueryCacheById";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";
import { QARepository } from "./QARepository";
import { QACard } from "./components/QACard/QACard";

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
    queryFn: async () =>
      new QARepository(fromClient).load({
        category,
        limit: 6,
        page: undefined,
        pageSize: undefined,
        search,
      }),
    staleTime: 10_000,
  });

  useSetQueryCacheById(data, ({ id }) => ["q&a", Number(id)]);

  //

  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!data) return <>No data O_o</>;
  if (data.length === 0) return <EmptyList />;

  return (
    <ul className="grid grid-cols-1 gap-9">
      {data
        .sort(
          (a, b) =>
            Date.parse(b.attributes?.createdAt!) -
            Date.parse(a.attributes?.createdAt!),
        )
        .map((qa) => (
          <li key={qa.id}>
            <QACard id={Number(qa.id)} />
          </li>
        ))}
    </ul>
  );
}

//

function EmptyList() {
  return (
    <h5 className="py-5 text-center font-bold">Pas plus de résultats ...</h5>
  );
}
