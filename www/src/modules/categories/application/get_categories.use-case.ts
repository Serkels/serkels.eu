//

import { Category_Type } from "@1/modules/category/domain";
import debug from "debug";
import { match } from "ts-pattern";
import { Lifecycle, scoped } from "~/core/di";
import { useCategories_Query } from "~/modules/categories";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Category_UseCase {
  #log = debug(`~:modules:categories:app:${Get_Category_UseCase.name}`);

  constructor() {
    this.#log("new");
  }

  //

  execute(type: Category_Type) {
    const categories_query = useCategories_Query();

    const target = match(type)
      .with("exchange", () => categories_query.exchange)
      .with("opportunity", () => categories_query.opportunity)
      .with("question", () => categories_query.question)
      .exhaustive();

    const { data: categories } = target.useQuery();

    if (!categories) return [];

    return categories;
  }
}
