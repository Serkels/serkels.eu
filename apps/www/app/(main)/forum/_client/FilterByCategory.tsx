"use client";

import { TRPC_React } from ":trpc/client";
import { CategoryFilterRadioList } from "@0.__legacy__/www/src/components/FilterRadioList";
import { Category } from "@1/modules/category/domain";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { data: categories } = TRPC_React.category.forum.useQuery();

  if (!categories) return [];

  const categories_ = [...(categories as any as Category[]), Category.all];

  return (
    <CategoryFilterRadioList
      active={query ?? ""}
      data={categories_}
      name="category"
      onChange={setQuery}
    />
  );
}
