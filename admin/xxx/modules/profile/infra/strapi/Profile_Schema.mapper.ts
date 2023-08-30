import type { IAdapter, IResult } from "@1/core/domain";
import { Profile } from "../../domain";
import type { Profile_DataSchema } from "./Profile_Schema";

export class Profile_Schema_ToDomain
  implements IAdapter<Profile_DataSchema, Profile>
{
  build({ id, attributes }: Profile_DataSchema): IResult<Profile, Error> {
    return Profile.create({
      ...attributes,
      id: Number(id),
    });
  }
}
