"use client";

import { OpportunityCategoriesViewModel } from "~/app/opportunity/models/OpportunityCategoriesViewModel";
import { useSyncSearchQuery } from "~/components/useSyncSearchQuery";
import { FilterRadioList } from "../../components/FilterRadioList";
import { useOpportunityCategoriesQuery } from "../opportunity/data/useOpportunityCategoriesQuery";
import type { QAFilterType } from "./models/QAFilterType";

//

export function CategoriesList() {
  const { query, setQuery } = useSyncSearchQuery("category");
  const { data: raw_categories } = useOpportunityCategoriesQuery();

  //

  if (!raw_categories) return <>0_o</>;

  const categories = raw_categories.map(
    OpportunityCategoriesViewModel.from_server,
  );

  categories.push(
    new OpportunityCategoriesViewModel({
      id: NaN,
      name: "Tout",
      slug: "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }),
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
  // { name: "Les dernières réponses", slug: "lastest-answers" },
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
