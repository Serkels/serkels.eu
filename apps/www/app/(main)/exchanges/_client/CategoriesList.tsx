"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { TRPC_React } from ":trpc/client";
import { CATEGORY_ALL } from "@1.modules/category.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useMemo } from "react";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { data: categories_, status } = TRPC_React.category.exchange.useQuery();

  const categories = useMemo(() => {
    return [...(categories_ ?? []), CATEGORY_ALL];
  }, [status]);

  return (
    <FilterRadioList
      active={query ?? ""}
      data={categories}
      name="category"
      onChange={setQuery}
    />
  );
}
