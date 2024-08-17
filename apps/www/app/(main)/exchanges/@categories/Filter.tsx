"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { useAutoClose } from ":components/shell/AsideFilter.client";
import { TRPC_React } from ":trpc/client";
import { CATEGORY_ALL } from "@1.modules/category.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { useMemo } from "react";

//

export function Filter() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { data: categories_, status } = TRPC_React.category.exchange.useQuery();
  const { close } = useAutoClose();
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
