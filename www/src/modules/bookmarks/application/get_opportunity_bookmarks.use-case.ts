//

import {
  Opportunity_DataRecord,
  opportunity_to_domain,
} from "@1/modules/opportunity/infra/strapi";
import { useInfiniteQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { getNextPageParam, getPreviousPageParam } from "~/core/use-query";
import { Bookmarks_Repository } from "../bookmarks.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Opportunity_Bookmarks_UseCase {
  #log = debug(
    `~:modules:question:app:${Get_Opportunity_Bookmarks_UseCase.name}`,
  );

  constructor(
    @inject(Bookmarks_Repository)
    private readonly repository: Bookmarks_Repository,
  ) {
    this.#log("new");
  }

  //

  execute({ pageSize }: { pageSize: number }) {
    return useInfiniteQuery({
      enabled: this.repository.is_authorized,
      queryFn: (options) => {
        return this.repository.find_opportunity_bookmarks({
          pagination: { pageSize, page: options.pageParam ?? 1 },
        });
      },
      queryKey: Bookmarks_Repository.keys.opportunity(),
      getNextPageParam,
      getPreviousPageParam,
      select: (data) => {
        return {
          ...data,
          pages: data.pages
            .map((page) => page.data!)
            .flat()
            .map((data) => {
              return opportunity_to_domain(
                Opportunity_DataRecord.parse({ data }),
              );
            }),
        };
      },
    });
  }
}
