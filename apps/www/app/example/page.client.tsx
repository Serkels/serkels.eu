"use client";

import get_categories from "@1.modules/category.api/get_categories";
import { useQuery } from "@tanstack/react-query";

//

function query_category() {
  return useQuery({
    queryKey: ["use_category"],
    queryFn: get_categories,
  });
}

export default function PageClient() {
  const { data, isError, isLoading } = query_category();
  return <pre>{JSON.stringify({ isError, isLoading, data }, null, 2)}</pre>;
}
