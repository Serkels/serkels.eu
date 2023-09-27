//

import { Profile } from "@1/modules/profile/domain";
import { Profile_Record } from "@1/modules/profile/infra/strapi";
import { useQuery } from "@tanstack/react-query";
import debug from "debug";
import { z } from "zod";
import { Lifecycle, inject, scoped } from "~/core/di";
import { Profile_Repository } from "../profile.repository";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Profile_UseCase {
  #log = debug(`~:modules:exchange:${Get_Profile_UseCase.name}`);

  constructor(
    @inject(Profile_Repository)
    private readonly repository: Profile_Repository,
  ) {
    this.#log("new");
  }

  //

  execute(id: number) {
    return useQuery({
      queryFn: () => this.repository.find_by_id(id),
      queryKey: Profile_Repository.keys.profile(id),
      select: (data) => {
        return Profile_Record.pipe(z.instanceof(Profile)).parse(data, {
          path: [`<${Get_Profile_UseCase.name}.execute(${id})>`, "data"],
        });
      },
    });
  }
}
