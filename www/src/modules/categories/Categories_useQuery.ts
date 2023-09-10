//

import { category_to_domain } from "@1/modules/category/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import { Strapi_useQuery } from "../user/Strapi_useQuery";
import { Categories_Repository } from "./Categories_Repository";

//

export class Categories_useQuery extends Strapi_useQuery {
  category_repository = new Categories_Repository(this.repository);

  //

  exchange = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.exchange(),
        queryFn: () => this.category_repository.exchange(),
        select: (datas) => {
          return datas.map((data) => category_to_domain(data));
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
          return datas.map((data) => category_to_domain(data));
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
          return datas.map((data) => category_to_domain(data));
        },
      });
    },
  };

  // to_domain(records: Category_ItemSchema ) {
  //   return records.map((data) => category_to_domain(data));

  // }
}
