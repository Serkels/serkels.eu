"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Partner_Filter } from "@1.modules/opportunity.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";

//

export function Partner_Opportunities_Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Mes publications", slug: Partner_Filter.Enum.MY_OPPORTUNITIES },
    { name: "Tout", slug: Partner_Filter.Enum.ALL },
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
