//

import { Entity, Ok, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";

//

export const Profile_PropsSchema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  university: z.string(),
});

export type Profile_Props = z.TypeOf<typeof Profile_PropsSchema>;

export class Profile extends Entity<Profile_Props> {
  static override create(props: Profile_Props): Result<Profile, ErrorInstance> {
    return Ok(new Profile(props));
  }

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
