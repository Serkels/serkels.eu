//

import type { Bookmark_Category } from "@1/modules/bookmark/domain";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Bookmarks_Repository } from "../bookmarks.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Is_In_Bookmarks_UseCase {
  #log = debug(`~:modules:bookmarks:app:${Is_In_Bookmarks_UseCase.name}`);

  constructor(
    @inject(Bookmarks_Repository)
    private readonly repository: Bookmarks_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(type: Bookmark_Category, id: number) {
    return useQuery({
      queryFn: () => this.repository.check(type, id),
      queryKey: Bookmarks_Repository.keys.check(type, id),
    });
  }
}
