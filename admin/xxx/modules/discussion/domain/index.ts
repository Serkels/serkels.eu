//

import {
  Entity,
  Fail,
  IllegalArgs,
  Ok,
  Result,
  type ErrorInstance,
} from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";

export const Discussion_PropsSchema = z.object({
  createdAt: z.date(),
  id: z.number(),
  last_message: z.string(),
  profile: z.any(),
  updatedAt: z.date(),
  // slug: z.string(),
});

export type Discussion_Props = z.TypeOf<typeof Discussion_PropsSchema>;

//

export class Discussion extends Entity<Discussion_Props> {
  private constructor(props: Discussion_Props) {
    super(props);
  }

  static override create(
    props: Discussion_Props,
  ): Result<Discussion, ErrorInstance> {
    if (!this.isValidProps(props)) {
      let cause = undefined;
      try {
        Discussion_PropsSchema.parse(props);
      } catch (e) {
        cause = e;
      }
      return Fail(
        new IllegalArgs("Invalid props to create an instance of " + this.name, {
          cause,
        }),
      );
    }
    return Ok(new Discussion(props));
  }

  static override isValidProps(props: any): boolean {
    return (
      !this.validator.isUndefined(props) &&
      !this.validator.isNull(props) &&
      Discussion_PropsSchema.safeParse(props).success
    );
  }

  //

  get profile() {
    return this.props.profile;
    // console.log("this.props.profile", this.props.profile);
    // const profile_maybe = Profile.create(this.props.profile);
    // if (profile_maybe.isFail()) console.error(profile_maybe.error());
    // return profile_maybe.value();
  }

  get last_update() {
    return formatDistance(this.props.updatedAt, new Date(), {
      locale: fr,
    });
  }

  get updated_at() {
    return this.props.updatedAt;
  }
  get last_message() {
    const message = this.props.last_message;
    const prefix = "";
    return `${prefix}${message}`;
  }
}
