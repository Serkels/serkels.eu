import { Fail, IllegalArgs, Result, } from "@1/core/domain";
import { Category } from "../../../category/domain";
import { category_to_domain } from "../../../category/infra/strapi";
import { Profile_SchemaToDomain } from "../../../profile/infra/strapi";
import { Exchange } from "../../domain";
import { Type } from "../../domain/Type.value";
//
export class Exchange_ItemSchemaToDomain {
    build({ id, attributes, }) {
        if (id === undefined)
            return Fail(new IllegalArgs("id undefined", {}));
        if (attributes === undefined)
            return Fail(new IllegalArgs("attributes undefined"));
        const { createdAt, category: raw_category, updatedAt, profile: raw_profile, type, in_exchange_of, when, slug, ...other_props } = attributes;
        const profile_to_domain = new Profile_SchemaToDomain().fromItemDto(raw_profile?.data);
        if (profile_to_domain.isFail())
            return Fail(new IllegalArgs("Exchange_ItemSchemaToDomain/profile_to_domain", {
                cause: profile_to_domain.error(),
            }));
        const category = raw_category?.data
            ? category_to_domain(raw_category.data)
            : Category.all;
        const in_exchange_of_to_domain = in_exchange_of?.data
            ? category_to_domain(in_exchange_of.data)
            : undefined;
        return Exchange.create({
            ...other_props,
            //c
            createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
            //
            id,
            slug: String(slug),
            category,
            in_exchange_of: in_exchange_of_to_domain,
            profile: profile_to_domain.value(),
            type: Type.create(type).value(),
            when: when ? new Date(when) : new Date(NaN),
        });
    }
}
