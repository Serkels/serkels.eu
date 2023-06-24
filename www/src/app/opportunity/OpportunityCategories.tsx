"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { useOpportunityCategories } from "./useOpportunityCategories";

//

export function OpportunityCategories() {
  const {
    isLoading,
    isFetching,
    error,
    data: categories,
  } = useOpportunityCategories();
  const { category, setCategory } = useOpportunityFilterContext();

  if (isLoading || isFetching)
    <div className="mt-10 text-center">
      <Spinner />
    </div>;

  if (error) return <>Epic fail....</>;
  if (!categories) return <>No data O_o</>;

  return (
    <ul className="mt-7 text-[#656565]">
      {categories.map(({ name, slug }) => (
        <li className="mb-3" key={slug}>
          <label>
            <input
              type="radio"
              name="category"
              value={slug}
              checked={category === slug}
              onChange={() => setCategory(slug ?? "")}
            />
            <span className="ml-2">{name}</span>
          </label>
        </li>
      ))}
      <li className="mb-3">
        <label>
          <input
            type="radio"
            name="category"
            value=""
            checked={category === ""}
            onChange={() => setCategory("")}
          />
          <span className="ml-2">Tout</span>
        </label>
      </li>
    </ul>
  );
}
