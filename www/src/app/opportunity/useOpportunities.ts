//

import { client } from "@/app/client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { Opportunities } from "./OpportunityRepository";

export function useOpportunitiesInfinite({ category = "", query = "" }) {
  return useInfiniteQuery({
    queryKey: ["opportunities", { category, query }],
    queryFn: fetchOpportunities({ category, query }),
    getNextPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination ?? { pageCount: 0, page: 0 };
      if (!pagination.pageCount || !pagination.page) return;

      return pagination.page >= pagination.pageCount
        ? undefined
        : pagination.page + 1;
    },
    getPreviousPageParam: (lastPage) => {
      const pagination = lastPage.meta?.pagination ?? { page: 0 };
      if (!pagination.page) return;

      return pagination.page > 0 ? pagination.page - 1 : undefined;
    },
  });
}

export function useOpportunities({
  category,
  limit,
}: {
  category?: string;
  limit?: number;
} = {}) {
  return useQuery({
    queryKey: ["opportunities", limit, category],
    queryFn: async () => {
      return Opportunities.load({
        category,
        limit,
        page: undefined,
        pageSize: undefined,
      });
    },
  });
}

//

function fetchOpportunities({ category = "", query = "" }) {
  return async ({ pageParam = 0 }) => {
    const { data } = await client.GET("/opportunities", {
      params: {
        query: {
          "pagination[page]": pageParam,
          "pagination[pageSize]": 6,
          filters: { category, query },
          populate: "*",
        },
      },

      querySerializer: (q) => {
        const populate = [
          `populate[partner][populate]=avatar`,
          `populate[opportunity_category]=${q.populate}`,
          `populate[cover]=${q.populate}`,
        ].join("&");
        const limit =
          q["pagination[limit]"] &&
          `pagination[limit]=${q["pagination[limit]"]}`;
        const category =
          q.filters &&
          q.filters["category"] &&
          `filters[$and][0][opportunity_category][slug][$eq]=${q.filters["category"]}`;
        const search =
          q.filters &&
          q.filters["query"] &&
          [
            `filters[$or][0][title][$containsi]=${q.filters["query"]}`,
            `filters[$or][1][description][$containsi]=${q.filters["query"]}`,
          ].join("&");
        const sort = `sort[0]=expireAt:desc`;
        const page =
          q["pagination[page]"] && `pagination[page]=${q["pagination[page]"]}`;
        const pageSize =
          q["pagination[pageSize]"] &&
          `pagination[pageSize]=${q["pagination[pageSize]"]}`;
        return [populate, limit, sort, page, pageSize, search, category]
          .filter(Boolean)
          .join("&");
      },
    });
    if (!data) return {};
    if (!data.data) return {};

    return data;
  };
}
