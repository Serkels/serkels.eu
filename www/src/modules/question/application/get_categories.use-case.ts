//

import { Category, Category_Type } from "@1/modules/category/domain";
import {
  Category_DataRecord,
  category_to_domain,
} from "@1/modules/category/infra/strapi";
import debug from "debug";
import { match } from "ts-pattern";
import { Lifecycle, scoped } from "~/core/di";
import { useCategories_Query } from "~/modules/categories";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Category_UseCase {
  #log = debug(`~:modules:question:app:${Get_Category_UseCase.name}`);

  constructor() {
    this.#log("new");
  }

  //

  execute(type: Category_Type): Category[] {
    const categories_query = useCategories_Query();

    const target = match(type)
      .with("exchange", () => categories_query.exchange)
      .with("opportunity", () => categories_query.opportunity)
      .with("question", () => categories_query.question)
      .exhaustive();

    const { data: categories_data } = target.useQuery();

    if (!categories_data) return [];

    const categories = categories_data.map((data, index) =>
      category_to_domain(
        Category_DataRecord.parse(
          { data },
          { path: [`categories_data.${index}`] },
        ),
      ),
    );

    return categories;
  }
}
