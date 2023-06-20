"use client";

import { Spinner } from "@1/ui/components/Spinner";
import { useOpportunityCategories } from "./useOpportunityCategories";

//

export function OpportunityCategories() {
  const {
    isLoading,
    isFetching,
    error,
    data: categories,
  } = useOpportunityCategories();

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
            <input type="radio" name="category" value={slug} />
            <span className="ml-2">{name}</span>
          </label>
        </li>
      ))}
    </ul>
  );
}
