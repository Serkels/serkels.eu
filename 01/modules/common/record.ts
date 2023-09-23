//

import { ID_Schema } from "@1/core/domain";
import { z } from "zod";

//

export const Strapi_ID = z.object({ id: ID_Schema.describe("Strapi ID") });
export const Strapi_Timestamps = z
  .object({
    createdAt: z.coerce.date().default(new Date()),
    updatedAt: z.coerce.date().default(new Date()),
  })
  .describe("Strapi Timestamps");
