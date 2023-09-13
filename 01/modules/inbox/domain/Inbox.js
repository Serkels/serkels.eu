//
import { Aggregate, Ok, Result } from "@1/core/domain";
export class Inbox extends Aggregate {
    constructor(props) {
        super(props);
    }
    static create(props) {
        return Ok(new Inbox(props));
    }
}
