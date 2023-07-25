//

import { GET } from "@/app/api/v1";

//

export async function loadOpportunityCategories() {
  const { data: response } = await GET("/opportunity-categories", {
    params: {},
  });

  if (!response) return [];
  if (!response.data) return [];

  return response.data!.map(({ id, attributes }) => ({ id, ...attributes }));
}
