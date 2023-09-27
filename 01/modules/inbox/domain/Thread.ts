//

import {
  Aggregate,
  Fail,
  Ok,
  Result,
  type ErrorInstance,
} from "@1/core/domain";
import { z } from "zod";
import { Entity_Schema } from "../../common/record";

//
//
//

export const Thread_PropsSchema = Entity_Schema
  // .object({
  //   profile: z.instanceof(Profile).default(Profile.zero),
  //   last_message: z.instanceof(Message).optional(),
  //   updated_at: z.coerce.date().default(new Date(0)),
  // })
  // .merge(Strapi_ID)
  // .merge(Strapi_Timestamps)
  .describe("Thread_Props");
// export interface Thread_Props {
//   id: number;
//   profile: Profile;
//   last_message: Message | undefined;
//   updated_at: Date;
// }

//

type Props = z.TypeOf<typeof Thread_PropsSchema>;
type Props_Input = z.input<typeof Thread_PropsSchema>;

//
export class Thread extends Aggregate<Props> {
  static override create(props: Props_Input): Result<Thread, ErrorInstance> {
    try {
      return Ok(
        new Thread(
          Thread_PropsSchema.parse(props, {
            path: ["Thread.create(props)"],
          }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
  }

  static zero = z.instanceof(Thread).parse(Thread.create({}).value());

  //
  // get profile() {
  //   return this.props.profile;
  // }
  get last_message() {
    return {};
    // return this.props.last_message;
  }

  get last_update() {
    return "";
    // return formatDistance(this.props.updated_at, new Date(), {
    //   locale: fr,
    // });
  }
}
