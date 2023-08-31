//

import { InputError } from "@1/core/error";
import { z } from "zod";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile } from "../../domain";

//

export const Profile_Record = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    university: z.string().default(""),
    about: z.string().default(""),
  })
  .merge(Strapi_Timestamps)
  .describe("Profile Record");

export type Profile_Record = z.TypeOf<typeof Profile_Record>;

//

export function to_domain(record: Profile_Record): Profile {
  const domain = Profile.create({
    ...record,
    id: Number(),
  });

  if (domain.isFail()) {
    throw new InputError("Profile_Record.to_domain", { cause: domain.error() });
  }

  return domain.value();
}

export const profile_to_domain = z.preprocess(
  (record) => to_domain(record as Profile_Record),
  Profile_Record,
);
