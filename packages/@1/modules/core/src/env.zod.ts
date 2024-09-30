//

import { z } from "zod";

//

export const env_app_url_schema = z
  .object({
    APP_URL: z.string().url().default("http://localhost:3000"),
    VERCEL_URL: z.string().url().optional(),
  })
  .transform(({ APP_URL, VERCEL_URL }) => ({
    APP_URL: VERCEL_URL ?? APP_URL,
  }));
