//

import { z } from "zod";
import { Profile_Schema } from "../../../profile/infra/strapi";
import { Message_Schema } from "./Message_Schema";

//

export const Thread_Schema = z.object({
  id: z.number(),
  profile: Profile_Schema,
  last_message: Message_Schema,
  updatedAt: z.coerce.date(),
});

export type Thread_Schema = z.TypeOf<typeof Thread_Schema>;
