//

import {
  Entity_Schema,
  Entity_Timestamps,
  ID_Schema,
} from "@1.modules/core/domain";
import { Profile_Schema, Student_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Question_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    answers: z.array(Entity_Schema),
    accepted_answer: Entity_Schema.nullable(),
    owner: Student_Schema.pick({ id: true, university: true }).extend({
      profile: Profile_Schema.pick({ id: true, name: true, image: true }),
    }),
    title: z.string(),
  })
  .describe("Question_PropsSchema");

export interface Question extends z.TypeOf<typeof Question_Schema> {}

//

export const Answer_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    accepted_for: Entity_Schema.nullable(),
    content: z.string(),
    owner: Student_Schema.pick({ id: true, university: true }).extend({
      profile: Profile_Schema.pick({ id: true, name: true, image: true }),
    }),
    parent_id: ID_Schema,
  })
  .describe("Answer_PropsSchema");

export interface Answer extends z.TypeOf<typeof Answer_Schema> {}

export const Forum_Filter = z.enum([
  "ALL",
  "APPROVED",
  "AWNSERED",
  "LAST_QUESTIONS",
  "MINE",
  "NOT_APPROVED",
]);

export type ForumSearchParams = Promise<{
  category: string;
  q: string;
  f: string;
}>;
