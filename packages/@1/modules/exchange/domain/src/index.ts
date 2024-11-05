//

import { Category_Schema } from "@1.modules/category.domain";
import {
  Entity_Schema,
  Entity_Timestamps,
  ID_Schema,
} from "@1.modules/core/domain";
import {
  AvatarProfile_Entity,
  Student_Schema,
} from "@1.modules/profile.domain";
import { isPast } from "date-fns";
import { z } from "zod";

//

export const Exchange_TypeSchema = z.enum(["PROPOSAL", "RESEARCH"]);
export type Exchange_Type = z.TypeOf<typeof Exchange_TypeSchema>;

//

export const Exchange_Flat_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    category_id: ID_Schema,
    deals: z.array(Entity_Schema),
    description: z.string().default(""),
    expiry_date: z.coerce.date().nullable(),
    is_online: z.boolean().default(true),
    location: z.string().nullable().default(""),
    owner_id: ID_Schema,
    places: z.coerce.number().max(9).default(1),
    return_id: ID_Schema.nullable(),
    title: z.string().default(""),
    type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
  })
  .describe("Exchange_Flat_Schema");

export interface Exchange_Flat_Schema
  extends z.TypeOf<typeof Exchange_Flat_Schema> {}

export const Exchange_Schema = Exchange_Flat_Schema.extend({
  category: Category_Schema,
  deals: z.array(Entity_Schema),
  owner: Student_Schema.pick({ university: true }).extend({
    profile: AvatarProfile_Entity,
  }),
  return: Category_Schema.nullable(),
  type: Exchange_TypeSchema.default(Exchange_TypeSchema.Enum.RESEARCH),
}).describe("Exchange_Schema");

export interface Exchange extends z.TypeOf<typeof Exchange_Schema> {}

export function is_active_exchange(
  exchange: Pick<Exchange, "deals" | "places">,
) {
  return exchange.deals.length < exchange.places;
}

/**
 *
 * @param exchange
 * @returns `true` if all the places in the exchange are taken by
 */
export function is_completed_exchange(
  exchange: Pick<Exchange, "deals" | "places">,
) {
  return exchange.deals.length >= exchange.places;
}

/**
 *
 * @param exchange
 * @returns `true` if the exchange is expired
 */
export function is_expired_exchange(exchange: Pick<Exchange, "expiry_date">) {
  return exchange.expiry_date ? isPast(exchange.expiry_date) : false;
}

//

export const Exchange_Filter = z.enum([
  "ALL",
  "DATE_FLEXIBLE",
  "DATE_LIMITED",
  "MY_CIRCLES",
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

export const Exchange_Create_Schema = z.object({
  category_id: ID_Schema,
  description: z.string(),
  expiry_date: z.date().nullish(),
  is_online: z.boolean(),
  location: z.string().nullish(),
  places: z.number().int().min(1).max(9),
  return_id: ID_Schema.nullish(),
  title: z.string(),
  type: Exchange_TypeSchema,
});

export interface Exchange_Create
  extends z.TypeOf<typeof Exchange_Create_Schema> {}

//

export type ExchangeSearchParams = Promise<{
  category: string;
  q: string;
  f: string;
}>;
