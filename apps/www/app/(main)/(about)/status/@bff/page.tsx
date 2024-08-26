"use client";

import { TRPC_React } from ":trpc/client";
import { match } from "ts-pattern";

//

//
export const dynamic = "force-dynamic";

export default async function Page() {
  const { status } = TRPC_React.health.useQuery();

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
