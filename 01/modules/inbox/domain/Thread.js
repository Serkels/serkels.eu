//
import { Aggregate, Ok, Result } from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
export class Thread extends Aggregate {
    constructor(props) {
        super(props);
    }
    static create(props) {
        return Ok(new Thread(props));
    }
    //
    get profile() {
        return this.props.profile;
    }
    get last_message() {
        return this.props.last_message;
    }
    get last_update() {
        return formatDistance(this.props.updated_at, new Date(), {
            locale: fr,
        });
    }
}
