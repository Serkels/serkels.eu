import { deal_state_action_schema } from "@1.modules.exchange/domain";
import { Deal_Status } from "@1/modules/deal/domain";
import { Next } from "koa";
import { interpret } from "xstate";
import { ZodError } from "zod";
import { fromZodError } from "zod-validation-error";
import { KoaContext, Params } from "~/types";
import { EXCHANGE_DEAL_API_CONTENT_ID } from "../content-types/exchange-deal";
import { deal_flow } from "../services/deal.machine";
import { query_one_filters } from "../services/query_one_filters";

//
export function status_patching() {
  return async function status_patching(ctx: KoaContext, next: Next) {
    try {
      const type = deal_state_action_schema
        .transform((status) => status.toUpperCase() as Uppercase<typeof status>)
        .parse(ctx.params.action, {
          path: ["ctx.params.action"],
        });

      const { deal_id, profile } = await query_one_filters(ctx);

      const { status, organizer, participant_profile } =
        await strapi.entityService.findOne(
          EXCHANGE_DEAL_API_CONTENT_ID,
          deal_id,
          {
            fields: ["status"],
            populate: { organizer: true, participant_profile: true },
          },
        );

      const machine = deal_flow.withConfig({
        guards: {
          is_organizer: () => organizer.id === profile.id,
          is_participant: () => participant_profile.id === profile.id,
        },
      });

      const interperter = interpret(machine).start(status);

      interperter.send({ type });

      const state = interperter.getSnapshot();

      if (!state.changed) {
        return ctx.badRequest("Illegal action");
      }

      {
        const status = Deal_Status.parse(state.value);
        const update_context = ctx as KoaContext<
          Params.Pick<typeof EXCHANGE_DEAL_API_CONTENT_ID, "data:partial">
        >;
        update_context.request.body = { data: { status } };
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return ctx.badRequest(fromZodError(error));
      }

      return ctx.badRequest(error);
    }

    //
    //
    //
    return next();
  };
}
