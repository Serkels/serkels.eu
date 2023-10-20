"use client";

import { FilterRadioList } from "@0.__legacy__/www/src/components/FilterRadioList";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export function ExchangeFilter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Sans échange", slug: "sans-echange" },
    { name: "Contre un échange", slug: "contre un-echange" },
    { name: "En ligne", slug: "en-ligne" },
    { name: "Sur place", slug: "sur-place" },
  ];

  return (
    <FilterRadioList
      active={query ?? ""}
      data={filters}
      name="filter"
      onChange={setQuery}
    />
  );
}
