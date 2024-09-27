//

import { z } from "zod";

//
export const login_form_schema = z.object({
  email: z.string().email(),
});

export type LoginForm = z.infer<typeof login_form_schema>;
