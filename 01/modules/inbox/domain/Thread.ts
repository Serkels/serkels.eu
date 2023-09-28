//

import {
  Aggregate,
  Fail,
  Ok,
  Result,
  type ErrorInstance,
} from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
import { Entity_Schema } from "../../common/record";
import { Profile } from "../../profile/domain";
import { Message } from "./Message";

//
//
//

export const Thread_PropsSchema = Entity_Schema.augment({
  profile: z.instanceof(Profile).default(Profile.zero),
  last_message: z.instanceof(Message).optional(),
}).describe("Thread_Props");

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

  get profile() {
    return this.props.profile;
  }
  get last_message() {
    return this.props.last_message ?? Message.zero;
  }
  get last_update() {
    return formatDistance(this.props.updatedAt, new Date(), {
      locale: fr,
    });
  }
}
