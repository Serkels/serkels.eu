//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Exchange_TypeSchema = z.enum(["PROPOSAL", "RESEARCH"]);
export const Exchange_Schema = Entity_Schema.extend({
  available_places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
  // category: z.instanceof(Category).default(Category.unknown), //Category_DataRecord,
  description: z.string().default(""),
  // in_exchange_of: z.instanceof(Category).optional(),
  is_online: z.boolean().default(true),
  location: z.string().default(""),
  places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
  // profile: z.instanceof(Profile).default(Profile.zero),
  // owner: z.instanceof(Profile).default(Profile.zero),
  slug: z.string().default(""),
  title: z.string().default(""),
  type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
  when: z.coerce.date().default(new Date(0)),
}).describe("Exchange_PropsSchema");

export interface Exchange extends z.TypeOf<typeof Exchange_Schema> {}
