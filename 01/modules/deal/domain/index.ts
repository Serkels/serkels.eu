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
import { Strapi_Timestamps } from "../../common/record";
import { Message } from "../../inbox/domain";
import { Profile } from "../../profile/domain";

//

export const Deal_PropsSchema = z
  .object({
    exchange: z.any(),
    id: z.number(),
    last_message: z.instanceof(Message),
    profile: z.instanceof(Profile),
  })
  .merge(Strapi_Timestamps);

export type Deal_Props = z.TypeOf<typeof Deal_PropsSchema>;

//

//

export const Deal_CreatePropsSchema = z.object({
  exchange: z.any(),
});
export type Deal_CreateProps = z.TypeOf<typeof Deal_CreatePropsSchema>;

//

export class Deal extends Entity<Deal_Props> {
  private constructor(props: Deal_Props) {
    super(props);
  }

  static override create(props: Deal_Props): Result<Deal, ErrorInstance> {
    if (!this.isValidProps(props)) {
      let cause = undefined;
      try {
        Deal_PropsSchema.parse(props);
      } catch (e) {
        cause = e;
      }
      return Fail(
        new IllegalArgs("Invalid props to create an instance of " + this.name, {
          cause,
        }),
      );
    }
    return Ok(new Deal(props));
  }

  static override isValidProps(props: any): boolean {
    return (
      !this.validator.isUndefined(props) &&
      !this.validator.isNull(props) &&
      Deal_PropsSchema.safeParse(props).success
    );
  }

  //

  get profile() {
    return this.props.profile;
  }

  get exchange() {
    return this.props.exchange;
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
    return this.props.last_message;
  }
}
