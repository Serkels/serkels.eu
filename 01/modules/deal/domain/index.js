//
import { Entity, Fail, IllegalArgs, Ok, Result, } from "@1/core/domain";
import { formatDistance } from "date-fns";
import { fr } from "date-fns/locale";
import { z } from "zod";
//
export const Deal_PropsSchema = z.object({
    createdAt: z.date(),
    id: z.number(),
    last_message: z.string(),
    profile: z.any(),
    updatedAt: z.date(),
    // slug: z.string(),
});
//
//
export const Deal_CreatePropsSchema = z.object({
    exchange: z.any(),
});
//
export class Deal extends Entity {
    constructor(props) {
        super(props);
    }
    static create(props) {
        if (!this.isValidProps(props)) {
            let cause = undefined;
            try {
                Deal_PropsSchema.parse(props);
            }
            catch (e) {
                cause = e;
            }
            return Fail(new IllegalArgs("Invalid props to create an instance of " + this.name, {
                cause,
            }));
        }
        return Ok(new Deal(props));
    }
    static isValidProps(props) {
        return (!this.validator.isUndefined(props) &&
            !this.validator.isNull(props) &&
            Deal_PropsSchema.safeParse(props).success);
    }
    //
    get profile() {
        return this.props.profile;
        // console.log("this.props.profile", this.props.profile);
        // const profile_maybe = Profile.create(this.props.profile);
        // if (profile_maybe.isFail()) console.error(profile_maybe.error());
        // return profile_maybe.value();
    }
    get last_update() {
        return formatDistance(this.props.updatedAt, new Date(), {
            locale: fr,
        });
    }
    get updated_at() {
        return this.props.updatedAt;
    }
    get last_message() {
        const message = this.props.last_message;
        const prefix = "";
        return `${prefix}${message}`;
    }
}
