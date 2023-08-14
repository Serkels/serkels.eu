"use client";

import type { components } from "@1/strapi-openapi/v1";
import { usePathname, useRouter } from "next/navigation";
import { FilterRadioList } from "../../components/FilterRadioList";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { OpportunityCategoriesViewModel } from "./models/OpportunityCategoriesViewModel";

//

export function CategoriesList({
  data,
}: components["schemas"]["OpportunityCategoryListResponse"]) {
  const { category, setCategory } = useOpportunityFilterContext();
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
  if (!data) return <>0_o</>;
  const categories = data.map(OpportunityCategoriesViewModel.from_server);
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
