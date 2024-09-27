//

import { PROFILE_ROLES } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const password_validation_schema = z.object({
  confirm_password: z.string({
    required_error: "Confirmation du mot de passe",
  }),
  password: z
    .string({ required_error: "Le mot de passe est requis" })
    .min(8, {
      message: "Le mot de passe doit contenir au moins 8 caractères",
    })
    .refine(
      (value: string) =>
        /[-._!"`'#%&,:;<>=@{}~\$\(\)\*\+\/\\\?\[\]\^\|]+/.test(value),
      "Le mot de passe doit contenir au moins un caractère spécial",
    )
    .refine(
      (value: string) => /[a-z]/.test(value),
      "Le mot de passe doit contenir au moins une lettre",
    )
    .refine(
      (value: string) => /[A-Z]/.test(value),
      "Le mot de passe doit contenir au moins une lettre majuscule",
    )
    .refine(
      (value: string) => /[0-9]/.test(value),
      "Le mot de passe doit contenir au moins un chiffre",
    ),
});

export const signup_form_schema = z
  .object({
    email: z.string().email(),
    role: PROFILE_ROLES,
  })
  .merge(password_validation_schema)
  .superRefine(({ confirm_password, password }, ctx) => {
    if (confirm_password !== password) {
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas",
        path: ["confirm_password"],
        fatal: true,
      });
      ctx.addIssue({
        code: "custom",
        message: "Les mots de passe ne correspondent pas",
        path: ["password"],
        fatal: true,
      });
    }
  });

export type SignupForm = z.infer<typeof signup_form_schema>;
