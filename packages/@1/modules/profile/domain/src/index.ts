//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

// TODO(douglasduteil): consider using uppercases here...
export const PROFILE_ROLES = z.enum(["ADMIN", "PARTNER", "STUDIENT"] as const);

export type PROFILE_ROLES = z.TypeOf<typeof PROFILE_ROLES>;

//

export const Profile_Schema = Entity_Schema.extend({
  bio: z.string().nullable().default(""),
  image: z.string().default("/opengraph-image.png"),
  name: z.string().default("Unkown Profile"),
  role: PROFILE_ROLES,
}).describe("Profile_PropsSchema");

export interface Profile extends z.TypeOf<typeof Profile_Schema> {}

export const PROFILE_UNKNOWN: Profile = Profile_Schema.parse(
  { id: "PROFILE_UNKNOWN", role: "STUDIENT" },
  { path: ["PROFILE_UNKNOWN"] },
);

//

export const Partner_Schema = Entity_Schema.extend({
  city: z.string().default("Unkown city"),
  link: z.string().url().optional(),
  profile: Profile_Schema,
}).describe("Partner_PropsSchema");

export interface Partner extends z.TypeOf<typeof Partner_Schema> {}

//

export const Studient_Schema = Entity_Schema.extend({
  citizenship: z.string().default("Unkown citizenship"),
  city: z.string().default("Unkown city"),
  field_of_study: z.string().default("Unkown field_of_study"),
  interest: z.array(Category_Schema),
  profile: Profile_Schema,
  university: z.string().default("Unkown university"),
}).describe("Studient_Schema");

export interface Studient extends z.TypeOf<typeof Studient_Schema> {}
