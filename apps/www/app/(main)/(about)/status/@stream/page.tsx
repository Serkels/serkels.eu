//

import { HTTPError } from "@1.modules/core/errors";
import { z } from "zod";

//

const schema = z.object({
  app: z.object({
    wss: z.object({
      clients: z.number(),
    }),
  }),
});

//
export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await fetch(`${process.env["API_URL"]}/ready`, {
    cache: "no-cache",
  });
  if (!response.ok) throw new HTTPError(response.statusText);
  const status = schema.parse(await response.json());
  return <div title={`${status.app.wss.clients} clients`}>🟩</div>;
}
