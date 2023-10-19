//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Category_Schema = Entity_Schema.augment({
  name: z.string(),
  slug: z.string(),
}).describe("Category_PropsSchema");

export interface Category extends z.TypeOf<typeof Category_Schema> {}
