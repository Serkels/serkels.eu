//

import { Category_Schema } from "@1.modules/category.domain";
import {
  Entity_Schema,
  Entity_Timestamps,
  ID_Schema,
} from "@1.modules/core/domain";
import { Studient_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Exchange_TypeSchema = z.enum(["PROPOSAL", "RESEARCH"]);
export type Exchange_Type = z.TypeOf<typeof Exchange_TypeSchema>;

//

export const Exchange_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    category: Category_Schema,
    deals: z.array(Entity_Schema),
    description: z.string().default(""),
    expiry_date: z.coerce.date().nullable(),
    is_online: z.boolean().default(true),
    location: z.string().nullable().default(""),
    owner: Studient_Schema.pick({ profile: true, university: true }),
    places: z.coerce.number().max(9).default(1),
    return: Category_Schema.nullable(),
    title: z.string().default(""),
    type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
  })
  .describe("Exchange_Schema");

export interface Exchange extends z.TypeOf<typeof Exchange_Schema> {}

export function is_active_exchange(exchange: Exchange) {
  return (
    exchange.deals.length < exchange.places ||
    exchange.expiry_date === null ||
    exchange.expiry_date > new Date()
  );
}

//

export const Exchange_Filter = z.enum([
  "ALL",
  "DATE_FLEXIBLE",
  "DATE_LIMITED",
  "MY_FOLLOWS",
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

//

export const Deal_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({ parent_id: z.string(), status: Deal_Status_Schema })
  .describe("Deal_Schema");

export type Deal = z.TypeOf<typeof Deal_Schema>;

//

export const HANDSHAKE_ACCEPETED = "/exchange handshake accepeted";
export const HANDSHAKE_COMPLETED = "/exchange handshake completed";
export const HANDSHAKE_DENIED = "/exchange handshake denied";
export const HANDSHAKE_TOCTOC = "🚪 Toc Toc !";

//

/**
 * @deprecated To rename or split
 * Used as create and update schema
 */
export const Exchange_Create_Schema = Exchange_Schema.omit({
  category: true,
  deals: true,
  return: true,
  owner: true,
})
  .extend({
    category: ID_Schema,
    return: ID_Schema.nullable(),
  })
  .describe("Exchange_Create_Schema");

export interface Exchange_Create
  extends z.TypeOf<typeof Exchange_Create_Schema> {}

/**
 * @deprecated
 */
export interface Exchange_CreateProps
  extends Omit<
    Exchange,
    | "id"
    | "category"
    | "deals"
    | "created_at"
    | "owner"
    | "return"
    | "updated_at"
  > {
  category: string;
  return?: string;
}
