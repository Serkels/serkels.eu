import { z } from "zod";

//

export const Profile_Schema = z.object({
  id: z.number(),
  firstname: z.string(),
  lastname: z.string(),
  about: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
  university: z.string(),
});
export type Profile_Schema = z.TypeOf<typeof Profile_Schema>;
