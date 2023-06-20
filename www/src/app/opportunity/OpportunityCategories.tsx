"use client";

import type { components } from "@1/strapi-openapi/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";

//

export function OpportunityCategories() {
  const {
    isLoading,
    isFetching,
    error,
    data: categories,
  } = useQuery({
    queryKey: ["opportunity-categories"],
    queryFn: () =>
      fetch("/api/v1/opportunity-categories")
        .then(
          (res) =>
            res.json() as components["schemas"]["OpportunityCategoryListResponse"]
        )
        .then(({ data }) =>
          data!.map(({ id, attributes }) => ({ id, ...attributes }))
        ),
  });

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
