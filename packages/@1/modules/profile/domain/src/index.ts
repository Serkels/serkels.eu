//

export * from "./AvatarProfile";

//

import { Category_Schema } from "@1.modules/category.domain";
import { Entity_Schema } from "@1.modules/core/domain";
import { z } from "zod";

//

// TODO(douglasduteil): consider using uppercases here...
export const PROFILE_ROLES = z.enum(["ADMIN", "PARTNER", "STUDENT"] as const);

export type PROFILE_ROLES = z.TypeOf<typeof PROFILE_ROLES>;

//

export const Profile_Schema = Entity_Schema.extend({
  bio: z.string().trim().nullable().default(""),
  image: z.string().trim().default("/opengraph-image.png"),
  name: z.string().trim().default("Unkown Profile"),
  role: PROFILE_ROLES,
}).describe("Profile_PropsSchema");

export interface Profile extends z.TypeOf<typeof Profile_Schema> {}

//

export const AuthProfile_Schema = Profile_Schema.omit({
  bio: true,
}).describe("AuthProfile_PropsSchema");
export interface AuthProfile extends z.TypeOf<typeof AuthProfile_Schema> {}

export const NewProfile_Schema = AuthProfile_Schema.omit({
  id: true,
  image: true,
}).describe("NewProfile_PropsSchema");
//

export const AvatarProfile_Schema = Profile_Schema.pick({
  id: true,
  image: true,
  name: true,
}).describe("AvatarProfile_Schema");
export interface AvatarProfile extends z.TypeOf<typeof AvatarProfile_Schema> {}

//

export const PROFILE_UNKNOWN: Profile = Profile_Schema.parse(
  { id: "PROFILE_UNKNOWN", role: "STUDENT" },
  { path: ["PROFILE_UNKNOWN"] },
);

//

export const Partner_Schema = Entity_Schema.extend({
  city: z.string().default("Unkown city"),
  link: z.string().url(),
  profile: Profile_Schema.default(PROFILE_UNKNOWN),
}).describe("Partner_PropsSchema");

export const NewPartner_Schema = Partner_Schema.omit({
  id: true,
  profile: true,
});

export interface Partner extends z.TypeOf<typeof Partner_Schema> {}

//

export const Student_Schema = Entity_Schema.extend({
  city: z.string().default("Unkown city"),
  field_of_study: z.string().default("Unkown field_of_study"),
  interest: z.array(Category_Schema).default([]),
  language: z.string().default("Unkown language"),
  profile: AuthProfile_Schema.default(PROFILE_UNKNOWN),
  university: z.string().default("Unkown university"),
}).describe("Student_Schema");

export const NewStudent_Schema = Student_Schema.omit({
  id: true,
  interest: true,
  profile: true,
}).extend({ interest_id: z.string().default("") });

export interface Student extends z.TypeOf<typeof Student_Schema> {}
