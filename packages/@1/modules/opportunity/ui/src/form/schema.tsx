//

import type { Opportunity_Create_Schema } from "@1.modules/opportunity.domain";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

//

export type FieldValues = z.infer<typeof Opportunity_Create_Schema>;
export const useOpportunityFormContext = useFormContext<FieldValues>;

export function form_to_dto(form: FieldValues) {
  return {
    ...form,
    location: form.location ?? null,
  };
}
