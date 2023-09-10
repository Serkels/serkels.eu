//

import { Category, OTHER_CATEGORY_SLUGS } from "@1/modules/category/domain";
import debug from "debug";
import { useMemo } from "react";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Get_Category_UseCase } from "./get_categories.use-case";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Other_Category_UseCase {
  #log = debug(`~:modules:question:app:${Get_Other_Category_UseCase.name}`);

  constructor(
    @inject(Get_Category_UseCase)
    private readonly get_other_category: Get_Category_UseCase,
  ) {
    this.#log("new");
  }

  //

  execute(): Category {
    const categories = this.get_other_category.execute();

    return useMemo(
      () =>
        categories.find(({ slug }) =>
          OTHER_CATEGORY_SLUGS.includes(
            slug as (typeof OTHER_CATEGORY_SLUGS)[number],
          ),
        ) ?? Category.all,
      [],
    );
  }
}
