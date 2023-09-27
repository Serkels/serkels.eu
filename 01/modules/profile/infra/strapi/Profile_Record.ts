//

import { z } from "zod";
import { StrapiEntity } from "../../../common";
import { Profile, Profile_PropsSchema } from "../../domain";

export const Profile_Record = StrapiEntity(Profile_PropsSchema)
  .transform(({ data }, ctx) => {
    if (!data) {
      return;
    }

    const entity = Profile.create({ id: data.id, ...data.attributes });
    if (entity.isFail()) {
      entity.error().issues.map(ctx.addIssue);
    }
    return entity.value();
  })
  .describe("Profile_Record");

//

export const Profile_Mapper = Profile_Record;

export const Profile_UpdateRecord = z.object({
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  university: z.string().optional(),
  about: z.string().optional(),
  image: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
  contacts: z.object({ set: z.array(z.object({ id: z.number() })) }).optional(),
});
export type Profile_UpdateRecord = z.TypeOf<typeof Profile_UpdateRecord>;
