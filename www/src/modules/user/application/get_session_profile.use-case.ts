//

import { Profile } from "@1/modules/profile/domain";
import {
  Profile_DataRecord,
  profile_to_domain,
} from "@1/modules/profile/infra/strapi";
import debug from "debug";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { Lifecycle, scoped } from "~/core/di";

//

@scoped(Lifecycle.ContainerScoped)
export class Get_Session_Profile {
  #log = debug(`~:modules:question:app:${Get_Session_Profile.name}`);

  constructor() {
    this.#log("new");
  }

  //

  execute(): Profile | undefined {
    const { data: session } = useSession();
    const profile = session?.user?.profile;
    return useMemo(() => {
      if (!profile) return undefined;

      try {
        return profile_to_domain(
          Profile_DataRecord.parse({
            data: { attributes: profile, id: profile.id },
          }),
        );
      } catch (error) {
        console.error(error);
        return undefined;
      }
    }, [profile]);
  }
}
