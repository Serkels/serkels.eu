//

import { Entity_Schema, Entity_Timestamps } from "@1.modules/core/domain";
import { Profile_Schema } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Inbox_Schema = Entity_Schema.extend({}).describe(
  "Inbox_PropsSchema",
);

export interface Inbox extends z.TypeOf<typeof Inbox_Schema> {}

//

export const Message_Schema = Entity_Schema.merge(Entity_Timestamps)
  .extend({
    id: z.string(),
    content: z.string(),
    author: Profile_Schema.omit({ bio: true }),
  })
  .describe("Message_Schema");

export interface Message extends z.TypeOf<typeof Message_Schema> {}
