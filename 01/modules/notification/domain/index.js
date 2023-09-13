//
import { Entity, Ok, Result } from "@1/core/domain";
//
export class New_Answer extends Entity {
    static create(props) {
        return Ok(new New_Answer({ ...props }));
    }
}
//
