"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Forum_Filter } from "@1.modules/forum.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useSession } from "next-auth/react";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");
  const { status } = useSession();

  const filters = [
    { name: "Les dernières questions", slug: Forum_Filter.Enum.LAST_QUESTIONS },
    ...(status === "authenticated"
      ? [{ name: "Mes questions", slug: Forum_Filter.Enum.MINE }]
      : []),
    { name: "Questions répondus", slug: Forum_Filter.Enum.AWNSERED },
    { name: "Questions approuvé", slug: Forum_Filter.Enum.APPROVED },
    // { name: "Tout", slug: Forum_Filter.Enum.ALL },
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
