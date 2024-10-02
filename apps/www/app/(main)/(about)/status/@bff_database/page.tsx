//

import { trpc_server } from "@1.infra/trpc/react-query/server";

//

export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await trpc_server.health.database.fetch();
  return <div title={`${response.status}`}>🟩</div>;
}
