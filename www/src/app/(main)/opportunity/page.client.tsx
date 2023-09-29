"use client";

import { Category } from "@1/modules/category/domain";
import { usePathname, useRouter } from "next/navigation";
import { CategoryFilterRadioList } from "~/components/FilterRadioList";
import { useInject } from "~/core/react.client";
import { Get_Category_UseCase } from "~/modules/categories/application/get_categories.use-case";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";

//

export function CategoriesList() {
  const { category, setCategory } = useOpportunityFilterContext();
  const categories = useInject(Get_Category_UseCase).execute("opportunity");
  const pathname = usePathname() ?? "";
  const router = useRouter();

  //

  const onChange =
    pathname === "/opportunity"
      ? async (category: string) =>
          setCategory(category === "" ? undefined : category)
      : async (category: string) => {
          await setCategory(category === "" ? undefined : category);
          await router.push(`/opportunity`);
        };

  //

  categories.push(Category.all);

  return (
    <CategoryFilterRadioList
      data={categories}
      active={category ?? ""}
      name="category"
      onChange={onChange}
    />
  );
}
