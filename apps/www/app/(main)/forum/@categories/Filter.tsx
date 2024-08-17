"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { context } from ":components/shell/AsideFilter.client";
import { TRPC_React } from ":trpc/client";
import { CATEGORY_ALL } from "@1.modules/category.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useContext, useMemo } from "react";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { data: categories_, status } = TRPC_React.category.forum.useQuery();
  const { close } = useContext(context);

  const categories = useMemo(() => {
    return [...(categories_ ?? []), CATEGORY_ALL];
  }, [status]);

  return (
    <div className="md:block" hidden={close}>
      <FilterRadioList
        active={query ?? ""}
        data={categories}
        name="category"
        onChange={setQuery}
      />
    </div>
  );
}
