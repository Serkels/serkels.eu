import type { Comment, GetValues, KoaContext, Next } from "~/types";

export function set_default_populate(
  context: KoaContext<
    { data: GetValues<"api::inbox.inbox"> },
    Comment,
    { profile_id: string }
  >,
  next: Next,
) {
  context.query.populate = {
    ...(context.query.populate || {}),
    thread: true,
    participant: true,
  };

  //
  //
  //
  return next();
}

export default () => set_default_populate;
