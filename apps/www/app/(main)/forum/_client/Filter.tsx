"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Forum_Filter } from "@1.modules/forum.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Les dernières questions", slug: Forum_Filter.Enum.LAST_QUESTIONS },
    { name: "Mes questions", slug: Forum_Filter.Enum.MINE },
    { name: "Questions répondus", slug: Forum_Filter.Enum.ALL },
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
