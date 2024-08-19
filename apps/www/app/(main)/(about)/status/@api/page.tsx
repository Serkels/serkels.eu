//

import { HTTPError } from "@1.modules/core/errors";
import { z } from "zod";

//

const schema = z.object({
  uptime: z.number(),
  message: z.enum(["OK"]),
  timestamp: z.coerce.date(),
});

//
export const dynamic = "force-dynamic";

export default async function Page() {
  const response = await fetch(`${process.env["API_URL"]}/health`, {
    cache: "no-cache",
  });
  if (!response.ok) throw new HTTPError(response.statusText);
  const status = schema.parse(await response.json());
  return <div title={`${status.timestamp}`}>🟩</div>;
}
