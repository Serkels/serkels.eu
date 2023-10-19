//

import { ID_Schema } from "@1/core/domain";
import { z } from "zod";

//

export const Entity_Schema = z.object({
  // id: ID_Schema.transform(ID.create).describe("Entity ID"),
  id: ID_Schema.or(z.string().uuid()).optional(),
  createdAt: z.coerce
    .date({ description: "created date" })
    .default(new Date(0)),

  updatedAt: z.coerce
    .date({ description: "updated date " })
    .default(new Date(0)),
});

//

export const Strapi_ID = z.object({ id: ID_Schema.describe("Strapi ID") });
export const Strapi_Timestamps = z
  .object({
    createdAt: z.coerce.date().default(new Date()),
    updatedAt: z.coerce.date().default(new Date()),
  })
  .describe("Strapi Timestamps");
