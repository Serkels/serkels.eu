//
import { Fail, IllegalArgs, InputError, Result, } from "@1/core/domain";
import { z } from "zod";
import { Profile } from "../../domain";
//
const StrapiResponseDataObject = z
    .object({
    id: z.number().describe("The profile record id"),
    attributes: z.any().describe("The profile record attributes"),
})
    .describe("Strapi Response Data Object");
export class Profile_SchemaToDomain {
    fromItemDto(record) {
        try {
            const schema = StrapiResponseDataObject.parse(record, {
                path: ["record"],
            });
            const domain = this.build(schema);
            if (domain.isFail())
                throw new InputError("Invalid domain", { cause: domain.error() });
            return domain;
        }
        catch (cause) {
            return Fail(new InputError("Profile_Schema Error", { cause }));
        }
    }
    build({ id, attributes }) {
        if (id === undefined)
            return Fail(new IllegalArgs("id undefined", {}));
        if (attributes === undefined)
            return Fail(new IllegalArgs("attributes undefined"));
        const { createdAt, updatedAt, owner, about, university, ...other_props } = attributes;
        return Profile.create({
            ...other_props,
            //
            createdAt: createdAt ? new Date(createdAt) : new Date(NaN),
            updatedAt: updatedAt ? new Date(updatedAt) : new Date(NaN),
            //
            id,
            about: String(about),
            university: String(university),
            image: attributes.image?.data?.id
                ? { data: { id: attributes.image.data.id } }
                : {},
        });
    }
}
