//

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//

export function useSyncSearchQuery(name: string) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get(name);
  const [query, setQuery] = useState(searchQuery ?? "");

  useEffect(() => {
    if (searchQuery === query) return;

    const params = updateURLSearchParams(searchParams.toString(), [
      name,
      query,
    ]);

    if (params === searchParams.toString()) return;

    router.push(`${pathname}?${params}`);
  }, [searchQuery, query, setQuery]);

  return { query, setQuery };
}

//

function updateURLSearchParams(
  searchParams: string,
  [queryKey, queryValue]: [string, string],
) {
  const params = new URLSearchParams(searchParams.toString());

  if (!queryValue) {
    params.delete(queryKey);
  } else {
    params.set(queryKey, queryValue);
  }
  return params.toString();
}
