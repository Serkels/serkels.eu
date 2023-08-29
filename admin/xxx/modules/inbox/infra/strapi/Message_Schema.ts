//

import { z } from "zod";

//

export const Message_Schema = z.object({
  id: z.number(),
  content: z.string(),
});

export type Message_Schema = z.TypeOf<typeof Message_Schema>;
