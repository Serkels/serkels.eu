//
import { Entity, Ok, Result } from "@1/core/domain";
export class Exchange extends Entity {
    constructor(props) {
        super(props);
    }
    static create(props) {
        return Ok(new Exchange(props));
    }
    get profile() {
        return this.props.profile;
    }
    get updatedAt() {
        return this.props.updatedAt;
    }
    get title() {
        return this.props.title;
    }
    get description() {
        return this.props.description;
    }
    get type() {
        return this.props.type.get("value");
    }
    get is_online() {
        return this.props.is_online;
    }
    get location() {
        return this.props.location;
    }
    get category() {
        return this.props.category;
    }
    get in_exchange_of() {
        return this.props.in_exchange_of;
    }
}
