"use client";

import { useSyncSearchQuery } from ":components/hooks/useSyncSearchQuery";
import { TRPC_React } from ":trpc/client";
import { CATEGORY_ALL } from "@1.modules/category.domain";
import { FilterRadioList } from "@1.ui/react/form/FilterRadioList";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

//

export function Categoriy_Filter() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const { data: categories_, status } =
    TRPC_React.category.opportunity.useQuery();

  //

  const onChange =
    pathname === "/opportunities"
      ? async (category: string) =>
          setQuery(category === "" ? undefined : category)
      : async (category: string) => {
          await router.push(`/opportunities?category=${category}`);
        };

  //

  const categories = useMemo(() => {
    return [...(categories_ ?? []), CATEGORY_ALL];
  }, [status]);

  return (
    <FilterRadioList
      active={query ?? ""}
      data={categories}
      name="category"
      onChange={onChange}
    />
  );
}
