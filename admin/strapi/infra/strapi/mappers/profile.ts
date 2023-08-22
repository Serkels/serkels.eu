//

import type { Mapper } from "@1/core";
import { Profile } from "@1/models";
import type { Profile_DTO } from "~/types";

//

export const Profile_Mapper: Mapper<Profile, Profile_DTO> = {
  toPersistence(entity: Profile): Profile_DTO {
    throw new Error("Method not implemented.");
  },
  toDomain(record: Profile_DTO): Profile {
    return new Profile(String(record.id), {
      about: String(record.about),
      createdAt: new Date(String(record.createdAt)),
      firstname: String(record.firstname),
      id: record.id,
      lastname: String(record.lastname),
      university: String(record.university),
      updatedAt: new Date(String(record.updatedAt)),
    });
  },
};
