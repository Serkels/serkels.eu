"use client";

import { FilterRadioList } from "@0.__legacy__/www/src/components/FilterRadioList";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export function ExchangeFilter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Sans échange", slug: Exchange_Filter.Enum.WITHOUT_RETURN },
    { name: "Contre un échange", slug: Exchange_Filter.Enum.WITH_RETURN },
    { name: "En ligne", slug: Exchange_Filter.Enum.ONLINE },
    { name: "Sur place", slug: Exchange_Filter.Enum.ON_SITE },
    { name: "Tout", slug: Exchange_Filter.Enum.ALL },
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
