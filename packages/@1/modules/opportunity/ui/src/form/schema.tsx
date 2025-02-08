//

import type {
  Opportunity,
  OpportunityCreateInput,
} from "@1.modules/opportunity.domain";
import { format } from "date-fns";
import { useFormContext } from "react-hook-form";

//

export const useOpportunityFormContext = useFormContext<OpportunityCreateInput>;

export function dto_to_form(dto: Opportunity): OpportunityCreateInput {
  return {
    ...dto,
    expiry_date: format(dto.expiry_date, "yyyy-MM-dd"),
    category_id: dto.category.id,
  };
}
