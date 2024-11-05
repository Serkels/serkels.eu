//

import { TRPC_Hydrate } from ":trpc/server";
import { trpc_server } from "@1.infra/trpc/react-query/server";
import { Filter } from "./Filter";

//

export default async function Page() {
  await trpc_server.category.exchange.prefetch();
  return (
    <TRPC_Hydrate>
      <Filter />
    </TRPC_Hydrate>
  );
}
