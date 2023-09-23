//

import {
  Aggregate,
  Fail,
  Ok,
  Result,
  type ErrorInstance,
} from "@1/core/domain";
import { z } from "zod";
import { Strapi_ID, Strapi_Timestamps } from "../../common/record";

//

export const Inbox_PropsSchema = z
  .object({})
  .merge(Strapi_ID)
  .merge(Strapi_Timestamps)
  .describe("Inbox_PropsSchema");

type Props = z.TypeOf<typeof Inbox_PropsSchema>;
type Props_Input = z.input<typeof Inbox_PropsSchema>;

export class Inbox extends Aggregate<Props> {
  //

  static override create(props: Props_Input): Result<Inbox, ErrorInstance> {
    try {
      return Ok(
        new Inbox(
          Inbox_PropsSchema.parse(props, {
            path: ["Profile.create(props)"],
          }),
        ),
      );
    } catch (error) {
      return Fail(error as ErrorInstance);
    }
  }

  static zero = Inbox.create({ id: Number.MIN_SAFE_INTEGER }).value();

  //

  get thread() {
    return {};
    // return this.props.thread;
  }
}
