//

import { InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
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

export const Profile_DataRecord = z_strapi_entity_data(Profile_Record);
export type Profile_DataRecord = z.TypeOf<typeof Profile_DataRecord>;

//

export function data_to_domain({
  data: { id, attributes },
}: Profile_DataRecord): Profile {
  const domain = Profile.create({
    ...attributes,
    id,
  });

  if (domain.isFail()) {
    throw new InputError("Profile_Record.to_domain", { cause: domain.error() });
  }

  return domain.value();
}
