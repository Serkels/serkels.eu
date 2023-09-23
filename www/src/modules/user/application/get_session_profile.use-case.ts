//

import { Profile_RecordSchema } from "@1/modules/profile/infra/strapi";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Lifecycle, scoped } from "~/core/di";

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
      debugger;
      try {
        return Profile_RecordSchema.parse(
          {
            data: profile,
          },
          {
            path: [
              ...JSON.stringify(
                {
                  data: profile,
                },
                null,
                2,
              )
                .replaceAll('"', '"')
                .split("\n"),

              "=",
              "Get_Session_Profile",
              "execute",
              "useMemo",
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
