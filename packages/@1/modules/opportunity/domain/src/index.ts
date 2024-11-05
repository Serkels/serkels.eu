//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema, ID_Schema } from "@1.modules/core/domain";
import { AvatarProfile_Entity } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Opportunity_Create_Schema = z.object({
  category_id: ID_Schema,
  cover: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .url({ message: "Ce champs doit être une URL" }),
  description: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .min(10, "La description doit contenir 10 caractères minimum")
    .max(1_400, "La description doit contenir 1400 caractères maximum"),
  expiry_date: z.coerce.date({
    required_error: "Ce champs est requis",
  }),
  link: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .url({ message: "Ce champs doit être une URL" }),
  title: z
    .string({ required_error: "Ce champs est requis" })
    .trim()
    .min(10, "Le titre doit contenir 10 caractères minimum")
    .max(100, "La description doit contenir 100 caractères maximum"),
  location: z.string().trim().min(1).nullable(),
});

export interface Opportunity_Create
  extends z.TypeOf<typeof Opportunity_Create_Schema> {}

//

export const Opportunity_Schema = Entity_Schema.merge(
  Opportunity_Create_Schema.omit({
    category_id: true,
  }),
)
  .extend({
    category: Category_Schema,
    owner: z.object({ profile: AvatarProfile_Entity }),
    slug: z.string(),
  })
  .describe("Opportunity Schema");

export interface Opportunity extends z.TypeOf<typeof Opportunity_Schema> {}

//

export const Partner_Filter = z.enum(["ALL", "MY_OPPORTUNITIES"]);

//

export type CardOportunity = Pick<
  Opportunity,
  | "category"
  | "cover"
  | "slug"
  | "expiry_date"
  | "id"
  | "location"
  | "owner"
  | "title"
>;

export type OpportunitySearchParams = Promise<{
  category: string;
  q: string;
  f: string;
}>;
