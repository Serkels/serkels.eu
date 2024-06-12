//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema } from "@1.modules/core/domain";
import { Profile_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Opportunity_Schema = Entity_Schema.extend({
  category: Category_Schema,
  cover: z.string(),
  description: z.string(),
  location: z.string().nullable(),
  owner: z.object({ profile: Profile_Schema }),
  slug: z.string(),
  title: z.string(),
  link: z.string().url(),
  expiry_date: z.date(),
}).describe("Opportunity_PropsSchema");

export interface Opportunity extends z.TypeOf<typeof Opportunity_Schema> {}

//

export const Opportunity_Create_Schema = z.object({
  is_online: z.boolean(),
  category: z.string(),
  cover: z.string().url(),
  link: z.string().url(),
  title: z.string().trim().min(11).max(100),
  expiry_date: z.coerce.date(),
  location: z.string().trim().min(1).optional(),
  description: z.string().trim().min(11).max(1400),
});
export interface Opportunity_Create
  extends z.TypeOf<typeof Opportunity_Create_Schema> {}

export const Partner_Filter = z.enum(["ALL", "MY_OPPORTUNITIES"]);
