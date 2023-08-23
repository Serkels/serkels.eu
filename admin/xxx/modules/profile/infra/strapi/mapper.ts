//
//

import { Mapper } from "@1/core/domain";
import type { Profile_Schema } from "@1/strapi-openapi";
import { Profile } from "../../domain";

//

export const Profile_Mapper: Mapper<Profile, Profile_Schema> = {
  toPersistence(_entity: Profile): Profile_Schema {
    throw new Error("Method not implemented.");
  },
  toDomain(record: Profile_Schema): Profile {
    return Profile.create({
      about: String(record.about),
      createdAt: new Date(String(record.createdAt)),
      firstname: String(record.firstname),
      id: record.id,
      lastname: String(record.lastname),
      university: String(record.university),
      updatedAt: new Date(String(record.updatedAt)),
    }).value();
  },
};
