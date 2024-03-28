//

import { z } from "zod";

//

export const create_report = z.object({
  email: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .email({
      message: "Cette email n'est pas valide",
    }),
  link: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .url({
      message: "Ce link n'est pas valide",
    }),
  comment: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .max(11_111, {
      message: "La description ne doit pas dépasser 11 111 caractères",
    })
    .optional(),
});
