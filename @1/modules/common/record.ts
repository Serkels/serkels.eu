//

import { z } from "zod";

//

export const Strapi_Timestamps = z
  .object({
    createdAt: z.coerce.date().default(new Date()),
    updatedAt: z.coerce.date().default(new Date()),
  })
  .describe("Strapi Timestamps");
