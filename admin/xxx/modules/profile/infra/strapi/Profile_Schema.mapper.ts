import type { IAdapter, IResult } from "@1/core/domain";
import { Profile } from "../../domain";
import type { Profile_Schema } from "./Profile_Schema";

export class Profile_Schema_ToDomain
  implements IAdapter<Profile_Schema, Profile>
{
  build(target: Profile_Schema): IResult<Profile, Error> {
    const id = target.id;
    const firstname = target.firstname;
    const lastname = target.lastname;
    const about = target.about;
    const createdAt = new Date();
    const updatedAt = new Date();
    const university = target.university;

    return Profile.create({
      id,
      firstname,
      lastname,
      about,
      createdAt,
      updatedAt,
      university,
    });
  }
}
