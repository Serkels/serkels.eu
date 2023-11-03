//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Bookmark_Schema = Entity_Schema.augment({}).describe(
  "Bookmark_PropsSchema",
);

export interface Bookmark extends z.TypeOf<typeof Bookmark_Schema> {}

//

export const Bookmark_Category = z.enum(["exchange", "opportunity"]);
export type Bookmark_Category = z.TypeOf<typeof Bookmark_Category>;
