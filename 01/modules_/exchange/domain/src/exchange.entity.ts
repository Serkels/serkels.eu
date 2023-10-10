//

import { Entity, Entity_Schema, Result } from "@1/core_";
import { ZodError, z } from "zod";

//

export const Exchange_PropsSchema = Entity_Schema.augment({
  firstname: z.string(),
}).describe("Exchange_PropsSchema");

type Props = z.TypeOf<typeof Exchange_PropsSchema>;
type Props_Input = z.input<typeof Exchange_PropsSchema>;

export class Exchange extends Entity<Props> {
  static override create(props: Props_Input): Result<Exchange, ZodError> {
    const result = Exchange_PropsSchema.safeParse(props, {
      path: [`<${Exchange.name}.create>`, "props"],
    });
    if (result.success) {
      return Result.Ok(new Exchange(result.data));
    } else {
      return Result.fail(result.error);
    }
  }
}
