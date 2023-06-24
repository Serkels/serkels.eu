//

import { client } from "@/app/client";
import { useQuery } from "@tanstack/react-query";

export function useOpportunities({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
} = {}) {
  const limitQuery = limit ? { "pagination[limit]": limit } : {};
  const categoryQuery = category ? { filters: { category } } : {};

  return useQuery({
    queryKey: ["opportunities", limit, category],
    queryFn: async () => {
      const { data } = await client.get("/opportunities", {
        params: { query: { populate: "*", ...limitQuery, ...categoryQuery } },

        querySerializer: (q) => {
          const populate = `populate=${q.populate}`;
          const limit =
            q["pagination[limit]"] &&
            `pagination[limit]=${q["pagination[limit]"]}`;
          const category =
            q.filters &&
            q.filters["category"] &&
            `filters[opportunity_category][slug][$eq]=${q.filters["category"]}`;
          const sort = `sort[0]=expireAt:desc`;
          return [populate, limit, category, sort].filter(Boolean).join("&");
        },
      });
      if (!data) return [];
      if (!data.data) return [];

      return data.data!.map(({ id, attributes }) => ({ id, ...attributes }));
    },
  });
}
