//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema, Entity_Timestamps } from "@1.modules/core/domain";
import { Studient_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Exchange_TypeSchema = z.enum(["PROPOSAL", "RESEARCH"]);
export type Exchange_Type = z.TypeOf<typeof Exchange_TypeSchema>;

//

export const Exchange_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    available_places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
    category: Category_Schema,
    description: z.string().default(""),
    is_online: z.boolean().default(true),
    location: z.string().default(""),
    owner: Studient_Schema,
    deals: z.array(Studient_Schema),
    places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
    return: Category_Schema.nullable(),
    slug: z.string().default(""),
    title: z.string().default(""),
    type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
    when: z.coerce.date().default(new Date(0)),
  })
  .describe("Exchange_PropsSchema");

export interface Exchange extends z.TypeOf<typeof Exchange_Schema> {}

//

export const Deal_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    available_places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
    category: Category_Schema,
    description: z.string().default(""),
    is_online: z.boolean().default(true),
    location: z.string().default(""),
    owner: Studient_Schema,
    deals: z.array(Studient_Schema),
    places: z.coerce.number().default(Number.MIN_SAFE_INTEGER),
    return: Category_Schema.nullable(),
    slug: z.string().default(""),
    title: z.string().default(""),
    type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
    when: z.coerce.date().default(new Date(0)),
  })
  .describe("Exchange_PropsSchema");

export interface Exchange extends z.TypeOf<typeof Deal_Schema> {}

//

export const Exchange_Filter = z.enum([
  "ALL",
  "ON_SITE",
  "ONLINE",
  "WITH_RETURN",
  "WITHOUT_RETURN",
]);

//

export const Deal_Status_Schema = z.enum([
  "IDLE",
  "DENIED",
  "APPROVED_BY_THE_ORGANIZER",
  "APPROVED",
]);

export type Deal_Status = z.TypeOf<typeof Deal_Status_Schema>;
