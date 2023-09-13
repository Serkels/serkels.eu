//
import { Entity, Ok, Result } from "@1/core/domain";
export class Message extends Entity {
    constructor(props) {
        super(props);
    }
    static create(props) {
        return Ok(new Message(props));
    }
    //
    get the_excerpt() {
        return this.props.content.trim().slice(0, 123);
    }
}
