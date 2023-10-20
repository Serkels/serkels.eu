//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Opportunity_Schema = Entity_Schema.augment({}).describe(
  "Opportunity_PropsSchema",
);

export interface Opportunity extends z.TypeOf<typeof Opportunity_Schema> {}
