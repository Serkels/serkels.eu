//

import { Lifecycle, inject, scoped } from "@1/core/di";
import type { Category_Type } from "@1/modules/category/domain";
import debug from "debug";
import { match } from "ts-pattern";
import { getQueryClient } from "~/core/getQueryClient";
import { Categories_Repository } from "../Categories_Repository";
import { Categories_useQuery } from "../Categories_useQuery";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Category_UseCase {
  #log = debug(`~:modules:categories:app:${Get_Category_UseCase.name}`);

  constructor(
    @inject(Categories_useQuery)
    private readonly categories_query: Categories_useQuery,
    @inject(Categories_Repository)
    private readonly repository: Categories_Repository,
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

  async prefetch(type: Category_Type) {
    const queryClient = getQueryClient();

    await match(type)
      .with("exchange", () =>
        queryClient.prefetchQuery({
          queryKey: Categories_Repository.keys.exchange(),
          queryFn: () => this.repository.exchange(),
        }),
      )
      .with("opportunity", () =>
        queryClient.prefetchQuery({
          queryKey: Categories_Repository.keys.opportunity(),
          queryFn: () => this.repository.opportunity(),
        }),
      )
      .with("question", () =>
        queryClient.prefetchQuery({
          queryKey: Categories_Repository.keys.question(),
          queryFn: () => this.repository.question(),
        }),
      )
      .exhaustive();

    return queryClient;
  }
}
