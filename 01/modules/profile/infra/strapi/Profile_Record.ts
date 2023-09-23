//

import { z } from "zod";
import { StrapiEntity } from "../../../common";
import { Profile, Profile_PropsSchema } from "../../domain";

// z_strapi_entity_data_strict(z.any())
//   .merge(schema)
// .transform((data) => {
//   data.
//   return { id, ...data. attributes };
// });
// .refine(schema.parse)
// .transform((sdf) => {
//   return { ...data.attributes, ...data } as T;
// })

// export const Profile_RecordSchema = StrapiEntity.merge(Profile_PropsSchema)//.merge(Profile_PropsSchema);
export const Profile_RecordSchema = StrapiEntity.pipe(Profile_PropsSchema)
  .transform(Profile.create)
  .transform((result) => {
    return result.isOk() ? result.value() : Profile.zero;
  })
  .describe("Profile_RecordSchema");

//

export const Profile_Mapper = Profile_RecordSchema;

export const Profile_UpdateRecord = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  university: z.string().optional(),
  about: z.string().optional(),
  image: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
  contacts: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
});
export type Profile_UpdateRecord = z.TypeOf<typeof Profile_UpdateRecord>;
