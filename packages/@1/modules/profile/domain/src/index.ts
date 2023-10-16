//

import { z } from "zod";

//

export const PROFILE_ROLES = z.union([
  z.literal("admin"),
  z.literal("partner"),
  z.literal("studient"),
]);

export type PROFILE_ROLES = z.TypeOf<typeof PROFILE_ROLES>;
