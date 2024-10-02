"use client";

import { trpc_client } from "@1.infra/trpc/react-query/client";
import { match } from "ts-pattern";

//

//
export const dynamic = "force-dynamic";

export default async function Page() {
  const { status } = trpc_client.health.ping.useQuery();

  return (
    <div>
      {match(status)
        .with("loading", () => <>⏳️</>)
        .with("error", () => <>🟥</>)
        .with("success", () => <>🟩</>)
        .exhaustive()}
    </div>
  );
}
