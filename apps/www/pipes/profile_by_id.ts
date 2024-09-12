//

import { ID_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

export const Profile_Schema = z.object({ profile_id: ID_Schema });
export type Params = z.TypeOf<typeof Profile_Schema>;
