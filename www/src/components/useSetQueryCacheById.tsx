"use client";
import { useQueryClient, type QueryKey } from "@tanstack/react-query";
import { useEffect } from "react";

//
export function useSetQueryCacheById<Id extends { id?: number }>(
  list: Id[] | undefined,
  queryKey: (item: Id) => QueryKey,
) {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!list) return;
    Promise.all(
      list.map((data) => queryClient.setQueryData(queryKey(data), data)),
    );
  }, [list?.length]);
}
