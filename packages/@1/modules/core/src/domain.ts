//

import { z } from "zod";

//

export const ID_Schema = z.string({ description: "ID" });

export type ID_Schema = z.TypeOf<typeof ID_Schema>;

export const Entity_Schema = z
  .object({
    id: ID_Schema,
  })
  .describe("Entity");
export type Entity = z.TypeOf<typeof Entity_Schema>;
export interface Entity_Schema extends z.TypeOf<typeof Entity_Schema> {}

export const Entity_Timestamps = z
  .object({
    created_at: z.coerce.date().default(new Date()),
    updated_at: z.coerce.date().default(new Date()),
  })
  .describe("Entity Timestamps");
export interface Entity_Timestamps extends z.TypeOf<typeof Entity_Timestamps> {}
