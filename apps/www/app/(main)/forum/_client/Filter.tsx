"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import { useSession } from "@1.modules/auth.next/react";
import { Forum_Filter } from "@1.modules/forum.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useContext } from "react";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");
  const { status } = useSession();
  const { close } = useContext(context);

  const filters = [
    { name: "Les dernières questions", slug: Forum_Filter.Enum.LAST_QUESTIONS },
    ...(status === "authenticated"
      ? [{ name: "Mes questions", slug: Forum_Filter.Enum.MINE }]
      : []),
    { name: "Questions répondues", slug: Forum_Filter.Enum.AWNSERED },
    { name: "Questions approuvées", slug: Forum_Filter.Enum.APPROVED },
    // { name: "Tout", slug: Forum_Filter.Enum.ALL },
  ];

  return (
    <div className="md:block" hidden={close}>
      <FilterRadioList
        active={query ?? ""}
        data={filters}
        name="filter"
        onChange={setQuery}
      />
    </div>
  );
}
