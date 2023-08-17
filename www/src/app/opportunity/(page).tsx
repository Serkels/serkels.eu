"use client";

import { usePathname, useRouter } from "next/navigation";
import { FilterRadioList } from "../../components/FilterRadioList";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { useOpportunityCategoriesQuery } from "./data/useOpportunityCategoriesQuery";
import { OpportunityCategoriesViewModel } from "./models/OpportunityCategoriesViewModel";

//

export function CategoriesList() {
  const { category, setCategory } = useOpportunityFilterContext();
  const { data: raw_categories } = useOpportunityCategoriesQuery();
  const pathname = usePathname();
  const router = useRouter();

  //

  const onChange =
    pathname === "/opportunity"
      ? setCategory
      : async (category: string) => {
          await setCategory(category);
          await router.push(`/opportunity`);
        };

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
      active={category}
      name="category"
      onChange={onChange}
    />
  );
}
