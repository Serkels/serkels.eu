//

import { trpc_caller } from "@1.infra/trpc/react-query/server";
import { match } from "ts-pattern";

//

export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await trpc_caller.health.session();
  return (
    <div title={`${response.status}`}>
      {match(response.status)
        .with("AUTHENTICATED", () => <>🈯️</>)
        .with("OK", () => <>🟩</>)
        .exhaustive()}
    </div>
  );
}
