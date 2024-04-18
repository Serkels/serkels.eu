"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { Partner_Filter } from "@1.modules/opportunity.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { usePathname } from "next/navigation";
import { useRouter } from "next/router";

//

export function Partner_Opportunities_Filter() {
  const { query, setQuery } = useSyncSearchQuery("f");
  const { query: category } = useSyncSearchQuery("category");
  const pathname = usePathname() ?? "";
  const router = useRouter();

  const filters = [
    { name: "Mes publications", slug: Partner_Filter.Enum.MY_OPPORTUNITIES },
    { name: "Tout", slug: Partner_Filter.Enum.ALL },
  ];

  //

  const onChange =
    pathname === "/opportunities"
      ? (filter: string) => setQuery(filter === "" ? undefined : filter)
      : (filter: string) => {
          router.push(
            `/opportunities?${new URLSearchParams({ f: filter, category: category ?? "" })}`,
          );
        };

  //

  return (
    <FilterRadioList
      active={query ?? ""}
      data={filters}
      name="filter"
      onChange={onChange}
    />
  );
}
