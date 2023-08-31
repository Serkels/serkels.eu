//

import { z } from "zod";

//

export const Strapi_Timestamps = z
  .object({
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
  })
  .describe("Strapi Timestamps");
