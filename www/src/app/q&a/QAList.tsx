"use client";

import { fromClient } from "@/app/api/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
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

  useCacheQAItemQueries(data);

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

//

function useCacheQAItemQueries(list: { id?: number }[] | undefined) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!list) return;
    Promise.all(
      list.map((data) =>
        queryClient.setQueryData(["q&a", Number(data.id)], data),
      ),
    );
  }, [list?.length]);
}
