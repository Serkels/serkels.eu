//

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

//

export function useSyncSearchQuery<TQuery extends string = string>(
  name: string,
) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams() ?? new URLSearchParams();
  const searchQuery = searchParams.get(name);
  const [query, setQuery] = useState<TQuery | undefined>(
    (searchQuery as TQuery) ?? undefined,
  );

  useEffect(() => {
    if (searchQuery === query) return;

    const params = updateURLSearchParams(searchParams.toString(), [
      name,
      query,
    ]);

    if (params === searchParams.toString()) return;

    router.push(`${pathname}?${params}`);
  }, [query, setQuery]);

  useEffect(() => {
    if (searchQuery === query) return;

    setQuery((searchQuery as TQuery) ?? undefined);
  }, [searchQuery]);

  return { query, setQuery };
}

//

function updateURLSearchParams(
  searchParams: string,
  [queryKey, queryValue]: [string, string | undefined],
) {
  const params = new URLSearchParams(searchParams);

  if (!queryValue) {
    params.delete(queryKey);
  } else {
    params.set(queryKey, queryValue);
  }
  return params.toString();
}
