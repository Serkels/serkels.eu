//

import { z } from "zod";

//

export const create_report = z.object({
  attachments: z.string().optional(),
  category: z.enum(
    [
      "Arnaques ou fraude",
      "Atteintes aux droits de propriété intellectuelle",
      "Discours ou symboles haineux",
      "Fausses informations",
      "Intimidation ou harcèlement",
      "Nudité et activités sexuelles",
      "Suicide ou automutilation",
      "Troubles de l’alimentation",
      "Vente de biens illégaux ou réglementés",
      "Violence ou organisations dangereuses",
      "Autre",
    ],
    {
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    },
  ),
  email: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .email({
      message: "Cet email n'est pas valide",
    }),
  link: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .url({
      message: "Ce lien n'est pas valide",
    }),
  comment: z
    .string({
      required_error: "Obligatoire",
      invalid_type_error: "Invalide",
    })
    .max(500, {
      message: "La description ne doit pas dépasser 500 caractères",
    })
    .optional(),
});
