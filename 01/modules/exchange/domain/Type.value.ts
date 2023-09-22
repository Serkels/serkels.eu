//

import { Ok, ValueObject } from "@1/core/domain";
import { z } from "zod";

//

export type TypeProps = { value: z.TypeOf<typeof Type.schema> };

export class Type extends ValueObject<TypeProps> {
  static schema = z.union([z.literal("proposal"), z.literal("research")]);
  static override create(value: TypeProps["value"]) {
    return Ok(new Type({ value }));
  }

  static override isValidProps(props: any): boolean {
    return (
      !this.validator.isUndefined(props) &&
      !this.validator.isNull(props) &&
      Type.schema.safeParse(props).success
    );
  }
}
