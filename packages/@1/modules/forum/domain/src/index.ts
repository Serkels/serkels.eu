//

import { Entity_Schema, Entity_Timestamps } from "@1.modules/core/domain";
import { Profile_Schema, Studient_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Question_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    answers: z.array(Entity_Schema),
    accepted_answer: Entity_Schema.optional(),
    // category: Category_Schema,
    owner: Studient_Schema.pick({ university: true }).extend({
      profile: Profile_Schema.pick({ name: true, image: true }),
    }),
    title: z.string(),
  })
  .describe("Question_PropsSchema");

export interface Question extends z.TypeOf<typeof Question_Schema> {}

//

export const Answer_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    // parent: Question_Schema,
    owner: Studient_Schema.pick({ id: true, university: true }).extend({
      profile: Profile_Schema.pick({ id: true, name: true, image: true }),
    }),
    content: z.string(),
  })
  .describe("Answer_PropsSchema");

export interface Answer extends z.TypeOf<typeof Answer_Schema> {}

export const Forum_Filter = z.enum([
  "ALL",
  "AWNSERED",
  "LAST_QUESTIONS",
  "MINE",
]);
