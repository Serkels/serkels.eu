//

import { Entity, Ok, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
import { z_strapi_entity_data } from "../../common";

//

export const Profile_PropsSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  university: z.string(),
  image: z_strapi_entity_data(z.any()).optional(),
});

export type Profile_Props = z.TypeOf<typeof Profile_PropsSchema>;

export class Profile extends Entity<Profile_Props> {
  static override create(props: Profile_Props): Result<Profile, ErrorInstance> {
    return Ok(new Profile(props));
  }

  static zero = Profile.create({
    about: "",
    createdAt: new Date(0),
    firstname: "",
    id: NaN,
    lastname: "",
    university: "",
    updatedAt: new Date(0),
  }).value();

  //

  get university() {
    return this.props.university;
  }
  get name() {
    return [this.props.firstname, this.props.lastname].join(" ");
  }

  get url() {
    return `/@${this.props.id}`;
  }
}
