//

import { Entity, Fail, Ok, Result, type ErrorInstance } from "@1/core/domain";
import { z } from "zod";
import { z_strapi_entity_data } from "../../common";
import { Strapi_ID, Strapi_Timestamps } from "../../common/record";

//

export const Profile_PropsSchema = z
  .object({
    firstname: z.string(),
    lastname: z.string(),
    about: z.string().default(""),
    university: z.string(),
    image: z_strapi_entity_data(z.any()).optional(),
  })
  .merge(Strapi_ID)
  .merge(Strapi_Timestamps)
  .describe("Profile_PropsSchema");

export type Profile_Props = z.TypeOf<typeof Profile_PropsSchema>;

export class Profile extends Entity<Profile_Props> {
  static override create(
    props: z.input<typeof Profile_PropsSchema>,
  ): Result<Profile, ErrorInstance> {
    try {
      return Ok(
        new Profile(
          Profile_PropsSchema.parse(props, { path: ["Profile.create(props)"] }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
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
