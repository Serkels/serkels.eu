"use client";

import { TRPC_React } from ":trpc/client";
import { useOpportunityFilterContext } from "@0.__legacy__/www/src/app/(main)/opportunity/OpportunityFilter.context";
import { CategoryFilterRadioList } from "@0.__legacy__/www/src/components/FilterRadioList";

//

export function CategoriesList() {
  const { category, setCategory } = useOpportunityFilterContext();
  const { data: categories } = TRPC_React.category.exchange.useQuery();
  // const categories = mock;
  if (!categories) return [];
  return (
    <CategoryFilterRadioList
      active={category ?? ""}
      data={categories as any}
      name="category"
      onChange={() => console.log("...")}
    />
  );
}
