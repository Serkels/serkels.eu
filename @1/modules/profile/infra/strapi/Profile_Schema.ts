import { z } from "zod";

//

export const Profile_Schema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  university: z.string(),
});
export type Profile_Schema = z.TypeOf<typeof Profile_Schema>;
