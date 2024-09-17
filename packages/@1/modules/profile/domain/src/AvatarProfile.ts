//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const AvatarProfile_Entity = Entity_Schema.extend({
  name: z.string(),
  image: z.string(),
});

export type AvatarProfile = z.infer<typeof AvatarProfile_Entity>;
