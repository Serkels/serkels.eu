//

import type { InjectionToken } from "tsyringe";
import { z } from "zod";

export * from "rich-domain";

//

export const ID_Schema = z.coerce
  .number({ description: "ID" })
  .safe()
  .finite()
  .nonnegative()
  .int();

export * from "./mapper";

//

export const USER_PROFILE_ID_TOKEN = Symbol.for(
  "user_profile_id",
) as InjectionToken<number>;
