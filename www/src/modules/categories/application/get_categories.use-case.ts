//

import { Category_Type } from "@1/modules/category/domain";
import debug from "debug";
import { match } from "ts-pattern";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Categories_useQuery } from "../Categories_useQuery";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Category_UseCase {
  #log = debug(`~:modules:categories:app:${Get_Category_UseCase.name}`);

  constructor(
    @inject(Categories_useQuery)
    private readonly categories_query: Categories_useQuery,
  ) {
    this.#log("new");
  }

  //

  execute(type: Category_Type) {
    const target = match(type)
      .with("exchange", () => this.categories_query.exchange)
      .with("opportunity", () => this.categories_query.opportunity)
      .with("question", () => this.categories_query.question)
      .exhaustive();

    const { data: categories } = target.useQuery();

    if (!categories) return [];

    return categories;
  }
}
