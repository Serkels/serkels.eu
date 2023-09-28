//

import { Entity, Result } from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { ZodError, z } from "zod";
import { StrapiEntity } from "../../common";
import { Entity_Schema } from "../../common/record";
import { Profile } from "../../profile/domain";

//

export const Deal_Status = z.union([
  z.literal("approved"),
  z.literal("approved by the organizer"),
  z.literal("denied"),
  z.literal("idle"),
]);

export const Deal_PropsSchema = Entity_Schema.augment({
  exchange: StrapiEntity(z.any()), // z.instanceof(Exchange).optional(),
  // // last_message: z.instanceof(Message),
  participant_profile: z.instanceof(Profile),
  organizer: z.instanceof(Profile),
  status: Deal_Status,
}).describe("Deal_PropsSchema");

//

type Props = z.TypeOf<typeof Deal_PropsSchema>;
type Props_Input = z.input<typeof Deal_PropsSchema>;

//

export class Deal extends Entity<Props> {
  static override create(props: Props_Input): Result<Deal, ZodError> {
    const result = Deal_PropsSchema.safeParse(props, {
      path: ["<Deal.create>", "props"],
    });
    if (result.success) {
      return Result.Ok(new Deal(result.data));
    } else {
      return Result.fail(result.error);
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
    return Profile.zero;
    // return this.props.organizer;
  }
  get status() {
    return Deal_Status.parse("idle");
    // return this.props.status;
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
  get organizer() {
    return this.props.organizer;
  }
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
