//

import { Lifecycle, scoped } from "@1/core/di";
import { Profile_Record } from "@1/modules/profile/infra/strapi";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useMemo } from "react";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Session_Profile {
  #log = debug(`~:modules:user:app:${Get_Session_Profile.name}`);

  constructor() {
    this.#log("new");
  }

  //

  execute() {
    const { data: session } = useSession();
    const profile = session?.user?.profile;
    return useMemo(() => {
      if (!profile) return undefined;

      try {
        return Profile_Record.parse(
          {
            data: profile,
          },
          {
            path: [
              "<Get_Session_Profile.execute>",
              "<useMemo>",
              "{data: profile}",
            ],
          },
        );
      } catch (error) {
        console.error(error);
        console.info({
          data: profile,
        });
        return undefined;
      }
    }, [profile]);
  }
}
