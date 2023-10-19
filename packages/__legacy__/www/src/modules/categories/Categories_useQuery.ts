//

import { Lifecycle, inject, scoped } from "@1/core/di";
import { Category_Record } from "@1/modules/category/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Categories_Repository } from "./Categories_Repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Categories_useQuery {
  #log = debug(`~:modules:categories:${Categories_useQuery.name}`);

  constructor(
    @inject(Categories_Repository)
    private readonly category_repository: Categories_Repository,
  ) {
    this.#log("new");
  }

  //

  //

  exchange = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.exchange(),
        queryFn: () => this.category_repository.exchange(),
        select: (datas) => {
          return datas.map((data) => Category_Record.parse({ data })!);
        },
      });
    },
  };

  question = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.question(),
        queryFn: () => this.category_repository.question(),
        select: (datas) => {
          return datas.map((data) => Category_Record.parse({ data })!);
        },
      });
    },
  };

  opportunity = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.opportunity(),
        queryFn: () => this.category_repository.opportunity(),
        select: (datas) => {
          return datas.map((data) => Category_Record.parse({ data })!);
        },
      });
    },
  };
}
