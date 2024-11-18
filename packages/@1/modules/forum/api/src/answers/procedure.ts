import { procedure, session_procedure } from "@1.modules/trpc";
import { z } from "zod";

export const answers_procedure = procedure.input(
  z.object({ question_id: z.string() }),
);

export const protected_answers_procedure = session_procedure.input(
  z.object({ question_id: z.string() }),
);
