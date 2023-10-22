"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Forum_Filter } from "@1.modules/forum.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  const filters = [
    { name: "Les dernières questions", slug: Forum_Filter.Enum.LAST_QUESTIONS },
    { name: "Questions fréquentes", slug: Forum_Filter.Enum.FREQUENTLY_ASKED },
    { name: "Mes questions", slug: Forum_Filter.Enum.MINE },
    { name: "Les dernières réponses", slug: Forum_Filter.Enum.LASTEST_ANSWERS },
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
