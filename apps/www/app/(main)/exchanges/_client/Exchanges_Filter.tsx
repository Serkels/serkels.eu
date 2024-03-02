"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Exchange_Filter } from "@1.modules/exchange.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";

//

export function Exchanges_Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Sans échange", slug: Exchange_Filter.Enum.WITHOUT_RETURN },
    { name: "Contre un échange", slug: Exchange_Filter.Enum.WITH_RETURN },
    { name: "En ligne", slug: Exchange_Filter.Enum.ONLINE },
    { name: "Sur place", slug: Exchange_Filter.Enum.ON_SITE },
    { name: "Mes abonnements", slug: Exchange_Filter.Enum.MY_FOLLOWS },
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
