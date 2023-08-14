"use client";

import { OpportunityCategoriesViewModel } from "@/app/opportunity/models/OpportunityCategories";
import { useSyncSearchQuery } from "@/components/useSyncSearchQuery";
import type { components } from "@1/strapi-openapi/v1";
import { FilterRadioList } from "../../components/FilterRadioList";
import type { QAFilterType } from "./models/QAFilterType";

//

export function CategoriesList({
  data,
}: components["schemas"]["OpportunityCategoryListResponse"]) {
  const { query, setQuery } = useSyncSearchQuery("category");

  //

  if (!data) return <>0_o</>;

  const categories = data.map(OpportunityCategoriesViewModel.from_server);
  categories.push(
    new OpportunityCategoriesViewModel(NaN, "Tout", { slug: "" }),
  );

  return (
    <FilterRadioList
      data={categories}
      active={query}
      name="category"
      onChange={setQuery}
    />
  );
}

const data: { name: string; slug: QAFilterType }[] = [
  { name: "Les dernières questions", slug: "" },
  // { name: "Questions fréquentes", slug: "frequently" },
  // { name: "Mes questions", slug: "mine" },
  // { name: "Les dernières réponses", slug: "lastest-awnsers" },
  // { name: "Questions répondus", slug: "awnsered" },
];

export function QAFilter() {
  const { query, setQuery } = useSyncSearchQuery("f");

  return (
    <FilterRadioList
      data={data}
      active={query}
      name="filter"
      onChange={setQuery}
    />
  );
}
