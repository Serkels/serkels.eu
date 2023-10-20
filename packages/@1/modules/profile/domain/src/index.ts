//

import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

// TODO(douglasduteil): consider using uppercases here...
export const PROFILE_ROLES = z.enum(["ADMIN", "PARTNER", "STUDIENT"] as const);

export type PROFILE_ROLES = z.TypeOf<typeof PROFILE_ROLES>;

//

export const Profile_Schema = Entity_Schema.augment({
  name: z.string().default("Unkown Profile"),
  image: z.string().default("/opengraph-image.png"),
  role: PROFILE_ROLES,
  // about: z.string().default(""),
  // university: z.string(),
}).describe("Profile_PropsSchema");

export interface Profile extends z.TypeOf<typeof Profile_Schema> {}

//

export const Partner_Schema = Entity_Schema.augment({
  // name: z.string().default("Unkown Profile"),
  // image: z.string().default("/opengraph-image.png"),
  // role: PROFILE_ROLES,
  // about: z.string().default(""),
  // university: z.string(),
}).describe("Partner_PropsSchema");

export interface Partner extends z.TypeOf<typeof Partner_Schema> {}
