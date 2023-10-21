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
  when: z.date(),
}).describe("Opportunity_PropsSchema");

export interface Opportunity extends z.TypeOf<typeof Opportunity_Schema> {}
