//

import { StrapiEntity } from "../../../common";
import { Category, Category_PropsSchema } from "../../domain";

//

export const Category_RecordSchema = StrapiEntity.pipe(Category_PropsSchema)
  .transform(Category.create)
  .transform((result) => {
    return result.isOk() ? result.value() : Category.unknown;
  })
  .describe("Category Record");
