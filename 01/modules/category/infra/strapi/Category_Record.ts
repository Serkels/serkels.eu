//

import { StrapiEntity } from "../../../common";
import { Category, Category_PropsSchema } from "../../domain";

//

export const Category_Record = StrapiEntity(Category_PropsSchema).transform(
  ({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Category.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  },
);
