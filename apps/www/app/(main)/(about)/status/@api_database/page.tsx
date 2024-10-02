//

import { HTTPError } from "@1.modules/core/errors";
import { z } from "zod";

//

const schema = z.object({
  database: z.object({
    status: z.enum(["OK", "FAIL"]),
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
  return <div title={`${status.database.status}`}>🟩</div>;
}
