//

import {
  Fail,
  IllegalArgs,
  Result,
  type ErrorInstance,
  type IAdapter,
} from "@1/core/domain";
import type { Profile_Schema } from "@1/strapi-openapi";
import { Profile } from "../../domain";

//

type Profile_Record = Pick<
  NonNullable<Profile_Schema["attributes"]>,
  | "about"
  | "createdAt"
  | "firstname"
  | "lastname"
  | "owner"
  | "university"
  | "updatedAt"
> & { id: number; owner?: any | undefined };

export class Profile_RecordToDomain
  implements IAdapter<Profile_Record, Profile, ErrorInstance>
{
  build(record: Profile_Record | undefined): Result<Profile, ErrorInstance> {
    if (record === undefined) return Fail(new IllegalArgs("record undefined"));

    const {
      id,
      createdAt,
      updatedAt,
      owner,
      about,
      university,
      ...other_props
    } = record;

    return Profile.create({
      ...other_props,
      //
      createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
      updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
      //
      id,
      about: String(about),
      university: String(university),
    });
  }
}
