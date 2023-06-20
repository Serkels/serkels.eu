//

import { client } from "@/app/client";
import { useQuery } from "@tanstack/react-query";

export function useOpportunityCategories() {
  return useQuery({
    queryKey: ["opportunity-categories"],
    queryFn: async () => {
      const { data } = await client.get("/opportunity-categories", {
        params: { query: {} },
      });
      if (!data) return [];
      if (!data.data) return [];

      return data.data!.map(({ id, attributes }) => ({ id, ...attributes }));
    },
  });
}
