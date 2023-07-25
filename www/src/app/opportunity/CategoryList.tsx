"use client";

import { useOpportunityFilterContext } from "./OpportunityFilter.context";
import { OpportunityCategories } from "./OpportunityRepository";

//

export function CategoriesList({
  categories,
}: {
  categories: Awaited<ReturnType<(typeof OpportunityCategories)["load"]>>;
}) {
  const { category, setCategoryAndUrl } = useOpportunityFilterContext();

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
