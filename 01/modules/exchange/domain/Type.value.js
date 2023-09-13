//
import { Ok, ValueObject } from "@1/core/domain";
export class Type extends ValueObject {
    static create(value) {
        return Ok(new Type({ value }));
    }
}
