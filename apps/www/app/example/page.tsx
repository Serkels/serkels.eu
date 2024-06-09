//

import get_categories from "@1.modules/category.api/get_categories";
import { Hydrate, QueryClient, dehydrate } from "@tanstack/react-query";
import PageClient from "./page.client";

//

// export const dynamic = "force-dynamic";
export const revalidate = 3600;

export default async function Page() {
  const query_client = new QueryClient();

  await query_client.prefetchQuery({
    queryKey: ["use_category"],
    queryFn: get_categories,
  });

  return (
    <div>
      Page
      <Hydrate state={dehydrate(query_client)}>
        <PageClient />
      </Hydrate>
    </div>
  );
}
