import { Fail, IllegalArgs, Result, } from "@1/core/domain";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";
import { Deal } from "../../domain";
//
export class Exchange_DealSchemaToDomain {
    build({ id, attributes }) {
        if (id === undefined)
            return Fail(new IllegalArgs("id undefined", {}));
        if (attributes === undefined)
            return Fail(new IllegalArgs("attributes undefined"));
        const { createdAt, updatedAt, profile: raw_profile, last_message, ...other_props } = attributes;
        const profile_to_domain = new Profile_SchemaToDomain().fromItemDto(raw_profile?.data);
        if (profile_to_domain.isFail())
            return Fail(new IllegalArgs("Exchange_DealSchemaToDomain/profile_to_domain", {
                cause: profile_to_domain.error(),
            }));
        return Deal.create({
            ...other_props,
            //
            createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
            //
            id,
            last_message: last_message?.data?.attributes?.content ?? "",
            profile: profile_to_domain.value(),
        });
    }
}
