"use client";

import type { components } from "@1/strapi-openapi/v1";
import { Spinner } from "@1/ui/components/Spinner";
import { useQuery } from "@tanstack/react-query";

//

function useOpportunityCategories() {
  return useQuery({
    queryKey: ["opportunity_categories"],
    queryFn: opportunity_categories_query,
  });
}

export async function OpportunityCategories() {
  const { data: categories, isLoading, isError } = useOpportunityCategories();
  if (isLoading) return <Spinner />;
  if (isError) return <>Epic fail...</>;
  if (!categories) return <>No data O_o</>;
  // useEffect(() => {}, [])
  // const categories = await (async () => {
  //   try {
  //     return await opportunity_categories_query();
  //   } catch (e) {
  //     console.error(e);
  //     return [];
  //   }
  // })();
  // const categories = [] as { name: string; slug: string }[];
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

// async function opportunity_categories_query() {
//   return Promise.resolve([] as { name: string; slug: string }[]);
// }
async function opportunity_categories_query() {
  const res = await fetch(
    `${process.env["NEXT_PUBLIC_STRAPI_API_URL"]}/api/opportunity-categories`
  );
  const result = await res.json();
  console.log(result);
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
/*
export async function _opportunity_categories_query() {
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
*/
