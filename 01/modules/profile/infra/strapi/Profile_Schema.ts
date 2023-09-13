//

import { z } from "zod";
import { z_strapi_entity } from "../../../common";

//

export const Profile_Schema = z.object({
  id: z.number().optional(),
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  university: z.string(),
});

export type Profile_Schema = z.TypeOf<typeof Profile_Schema>;
export const Profile_DataSchema = z_strapi_entity(Profile_Schema);
export type Profile_DataSchema = z.TypeOf<typeof Profile_DataSchema>;
