//

import { z } from "zod";

//

export const env_app_url_schema = z
  .object({
    APP_URL: z.string().url().default("http://localhost:3000"),
    NEXT_PUBLIC_VERCEL_ENV: z.string().optional(),
    NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL: z
      .string()
      .transform((hostname) => `https://${hostname}`)
      .pipe(z.string().url())
      .optional(),
    NEXT_PUBLIC_VERCEL_URL: z
      .string()
      .transform((hostname) => `https://${hostname}`)
      .pipe(z.string().url())
      .optional(),
    VERCEL_URL: z
      .string()
      .transform((hostname) => `https://${hostname}`)
      .pipe(z.string().url())
      .optional(),
  })
  .transform(
    ({
      APP_URL,
      NEXT_PUBLIC_VERCEL_ENV,
      NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL,
      NEXT_PUBLIC_VERCEL_URL,
      VERCEL_URL,
    }) => ({
      APP_URL:
        (NEXT_PUBLIC_VERCEL_ENV === "production"
          ? NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL
          : undefined) ??
        (NEXT_PUBLIC_VERCEL_ENV === "preview"
          ? NEXT_PUBLIC_VERCEL_URL
          : undefined) ??
        VERCEL_URL ??
        APP_URL,
    }),
  );
