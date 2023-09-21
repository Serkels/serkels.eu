//

import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { KoaContext, PolicyImplementation } from "~/types";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";
import { query_one_filters } from "../services/query_one_filters";

//

export async function assert_deal_access(
  ...[policyContext, config]: Parameters<PolicyImplementation>
) {
  const ctx = policyContext as any as KoaContext<
    unknown,
    unknown,
    { deal_id: string; exchange_id: string }
  >;
  try {
    const { filters } = await query_one_filters(ctx);

    const deal = await strapi.entityService.count(
      EXCHANGE_DEAL_API_CONTENT_ID,
      {
        filters,
      },
    );

    return deal === 1;
  } catch (error) {
    if (error instanceof ZodError) {
      return ctx.badRequest(fromZodError(error));
    }

    return ctx.badRequest(error);
  }
}
