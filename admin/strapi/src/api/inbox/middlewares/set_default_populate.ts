import type { KoaContext, Next, Params } from "~/types";

export function set_default_populate(context: KoaContext, next: Next) {
  const query = {
    populate: {
      participant: true,
      thread: { populate: { last_message: true, participants: true } },
    },
  } satisfies Params.Pick<"api::inbox.inbox", "populate">;

  context.query.populate = {
    ...(context.query.populate || {}),
    ...query.populate,
  };

  //
  //
  //

  return next();
}

export default () => set_default_populate;
