//

import type { IAdapter } from "@1/core/domain";
import type { Profile_Schema } from "@1/strapi-openapi";
import { Profile } from "../../domain";

//

export class Profile_SchemaToDomain
  implements IAdapter<Profile_Schema, Profile>
{
  build(record: Profile_Schema) {
    return Profile.create({
      about: String(record.about),
      createdAt: new Date(String(record.createdAt)),
      firstname: String(record.firstname),
      id: record.id,
      lastname: String(record.lastname),
      university: String(record.university),
      updatedAt: new Date(String(record.updatedAt)),
    });
  }
}
