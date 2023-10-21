//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema, Entity_Timestamps } from "@1.modules/core/domain";
import { Studient_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Question_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    category: Category_Schema,
    owner: Studient_Schema,
    title: z.string(),
  })
  .describe("Question_PropsSchema");

export interface Question extends z.TypeOf<typeof Question_Schema> {}

export const Forum_Filter = z.enum([
  "ALL",
  "AWNSERED",
  "FREQUENTLY_ASKED",
  "LAST_QUESTIONS",
  "LASTEST_ANSWERS",
  "MINE",
]);
