//

import { z } from "zod";

export * from "rich-domain";
// export * from "./entity";
export * from "../error";
//

export const ID_Schema = z.coerce
  .number({ description: "ID" })
  .safe()
  .finite()
  .nonnegative()
  .int();

export * from "./mapper";

//

export const USER_PROFILE_ID_TOKEN = Symbol("user_profile_id");
