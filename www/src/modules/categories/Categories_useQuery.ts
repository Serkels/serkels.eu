//

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
      });
    },
  };

  question = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.question(),
        queryFn: () => this.category_repository.question(),
      });
    },
  };

  opportunity = {
    useQuery: () => {
      return useQuery({
        queryKey: Categories_Repository.keys.opportunity(),
        queryFn: () => this.category_repository.opportunity(),
      });
    },
  };
}
