//

import { client } from "@/app/client";
import { useQuery } from "@tanstack/react-query";

export function useOpportunities() {
  return useQuery({
    queryKey: ["opportunities"],
    queryFn: async () => {
      const { data } = await client.get("/opportunities", {
        params: { query: { populate: "*" } },
      });
      if (!data) return [];
      if (!data.data) return [];

      return data.data!.map(({ id, attributes }) => ({ id, ...attributes }));
    },
  });
}
