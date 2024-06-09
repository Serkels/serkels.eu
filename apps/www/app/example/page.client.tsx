"use client";

import get_categories from "@1.modules/category.api/get_categories";
import { useQuery } from "@tanstack/react-query";

//

const query_category = () => {
  return useQuery({
    queryKey: ["use_category"],
    queryFn: async () => {
      return get_categories();
    },
  });
};

export default function PageClient() {
  const { data, isError, isLoading } = query_category();
  return <pre>{JSON.stringify({ data, isError, isLoading }, null, 2)}</pre>;
}
