//

import { z } from "zod";

//

export const Strapi_Timestamps = z
  .object({
    createdAt: z.coerce.date().optional(),
    updatedAt: z.coerce.date().optional(),
  })
  .describe("Strapi Timestamps");
