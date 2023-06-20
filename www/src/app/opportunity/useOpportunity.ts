//

import { client } from "@/app/client";
import { useQuery } from "@tanstack/react-query";

export function useOpportunity() {
  return useQuery({
    queryKey: ["opportunity"],
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
