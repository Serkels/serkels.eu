"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { useOpportunityCategories } from "./useOpportunityCategories";

//

export function OpportunityCategories() {
  const { isLoading, error, data: categories } = useOpportunityCategories();
  const { category, setCategoryAndUrl } = useOpportunityFilterContext();

  if (isLoading)
    return (
      <div className="mt-10 text-center">
        <Spinner />
      </div>
    );

  if (error) return <>Epic fail....</>;
  if (!categories) return <>No data O_o</>;

  return (
    <ul className="mt-7 text-Dove_Gray">
      {categories.map(({ name, slug }) => (
        <li className="mb-3" key={slug}>
          <label>
            <input
              type="radio"
              name="category"
              value={slug}
              checked={category === slug}
              onChange={() => setCategoryAndUrl(slug ?? "")}
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
            onChange={() => setCategoryAndUrl("")}
          />
          <span className="ml-2">Tout</span>
        </label>
      </li>
    </ul>
  );
}
