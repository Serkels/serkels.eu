//

import { Category } from "@1/modules/category/domain";
import {
  Category_DataRecord,
  category_to_domain,
} from "@1/modules/category/infra/strapi";
import debug from "debug";
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

  execute(): Category[] {
    const { question } = useCategories_Query();
    const { data: categories_data } = question.useQuery();

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
