//

import { TRPC_Hydrate, TRPC_SSR } from ":trpc/server";
import { Filter } from "./Filter";

//

export const revalidate = 0;

//

export default async function Page() {
  await TRPC_SSR.category.exchange.prefetch();
  return (
    <TRPC_Hydrate>
      <Filter />
    </TRPC_Hydrate>
  );
}
