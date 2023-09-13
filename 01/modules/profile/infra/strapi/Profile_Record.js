//
import { InputError } from "@1/core/error";
import { z } from "zod";
import { z_strapi_entity_data } from "../../../common";
import { Strapi_Timestamps } from "../../../common/record";
import { Profile } from "../../domain";
//
export const Profile_Record = z
    .object({
    firstname: z.string(),
    lastname: z.string(),
    university: z.string().default(""),
    about: z.string().default(""),
    image: z_strapi_entity_data(z.any()).optional(),
})
    .merge(Strapi_Timestamps)
    .describe("Profile Record");
export const Profile_DataRecord = z_strapi_entity_data(Profile_Record);
//
export const Profile_UpdateRecord = z.object({
    firstname: z.string().optional(),
    lastname: z.string().optional(),
    university: z.string().optional(),
    about: z.string().optional(),
    image: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
    contacts: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
});
//
export function profile_to_domain({ data }) {
    const { id, attributes } = data ?? { id: NaN, attributes: {} };
    const domain = Profile.create({
        ...Profile.zero.toObject(),
        ...attributes,
        id,
    });
    if (domain.isFail()) {
        throw new InputError("Profile_Record.to_domain", { cause: domain.error() });
    }
    return domain.value();
}
export function data_to_domain({ data }) {
    const { id, attributes } = data ?? { id: NaN, attributes: {} };
    const domain = Profile.create({
        ...Profile.zero.toObject(),
        ...attributes,
        id,
    });
    if (domain.isFail()) {
        throw new InputError("Profile_Record.to_domain", { cause: domain.error() });
    }
    return domain.value();
}
