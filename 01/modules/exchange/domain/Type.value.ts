//

import { Ok, ValueObject } from "@1/core/domain";

export interface TypeProps {
  value: "proposal" | "research";
}

export class Type extends ValueObject<TypeProps> {
  static override create(value: TypeProps["value"]) {
    return Ok(new Type({ value }));
  }
}
