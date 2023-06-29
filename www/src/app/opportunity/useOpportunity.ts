//

import { client } from "@/app/client";
import { useQuery } from "@tanstack/react-query";

export function useOpportunity(slug: string, options: { initialData: any }) {
  async function get_opportunity_by_slug() {
    const { data } = await client.get("/opportunities", {
      params: {
        query: {
          populate: "*",
          filters: {
            slug: { $eq: slug },
          },
        },
      },
      querySerializer: (q) =>
        `populate[partner][populate]=avatar&populate[cover]=${q.populate}&filters[slug][$eq]=${slug}`,
    });

    return data;
  }

  return useQuery({
    queryKey: ["opportunity", slug],
    queryFn: get_opportunity_by_slug,
    select: function select_first(data) {
      console.log({ data });
      if (!data) throw new Error("Epic fail 0_o");
      if (!data.data) throw new Error("Epic fail 0_o");
      const first = data.data[0];
      if (!first) throw new Error("Epic fail 0_o");
      return first;
    },
    initialData: options.initialData as Awaited<
      ReturnType<typeof get_opportunity_by_slug>
    >,
  });
}
