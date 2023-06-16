"use client";

import type { components } from "@1/strapi-openapi/v1";

//

export async function OpportunityCategories() {
  // const {
  //   data: categories,
  //   isLoading,
  //   isError,
  // } = useQuery({
  //   queryKey: ["opportunity_categories"],
  //   queryFn: opportunity_categories_query,
  // });

  // if (isLoading) return <Spinner />;
  // if (isError) return <>Epic fail...</>;
  // if (!categories) return <>No data O_o</>;
  const categories = await opportunity_categories_query();
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

export async function opportunity_categories_query() {
  const res = await fetch(`/api/v1/opportunity-categories`);
  const result = await res.json();
  if (result.error) {
    console.error(result.error);
    throw result.error;
  }
  const { data } = result as NonNullable<
    components["schemas"]["OpportunityCategoryListResponse"]
  >;
  if (!data) {
    return [];
  }
  return await data.map(({ id, attributes }) => ({ id, ...attributes }));
}
