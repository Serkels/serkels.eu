//

import { Entity, Fail, Ok, Result, type ErrorInstance } from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { Strapi_ID, Strapi_Timestamps } from "../../common/record";
import { Exchange } from "../../exchange/domain";
import { Profile } from "../../profile/domain";

//
export const Deal_Status = z.union([
  z.literal("approved"),
  z.literal("approved by the organizer"),
  z.literal("denied"),
  z.literal("idle"),
]);

export const Deal_PropsSchema = z
  .object({
    exchange: z.instanceof(Exchange),
    // last_message: z.instanceof(Message),
    participant_profile: z.instanceof(Profile),
    organizer: z.instanceof(Profile),
    status: Deal_Status,
  })
  .merge(Strapi_ID)
  .merge(Strapi_Timestamps)
  .describe("Deal_PropsSchema");

//

type Props = z.TypeOf<typeof Deal_PropsSchema>;
type Props_Input = z.input<typeof Deal_PropsSchema>;

//

export class Deal extends Entity<Props> {
  static override create(props: Props_Input): Result<Deal, ErrorInstance> {
    try {
      return Ok(
        new Deal(
          Deal_PropsSchema.parse(props, {
            path: ["Deal.create(props)"],
          }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
  }

  static override isValidProps(props: any): boolean {
    return (
      !this.validator.isUndefined(props) &&
      !this.validator.isNull(props) &&
      Deal_PropsSchema.safeParse(props).success
    );
  }

  //

  static zero = Deal.create({} as any).value();
  //

  get profile() {
    return this.props.organizer;
  }
  get status() {
    return this.props.status;
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
  // get last_message() {
  //   return this.props.last_message;
  // }
}

//
//
//

export const Deal_CreatePropsSchema = z.object({
  exchange: z.any(),
  status: Deal_Status,
});
export type Deal_CreateProps = z.TypeOf<typeof Deal_CreatePropsSchema>;

//
