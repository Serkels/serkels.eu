//

import { PROFILE_UNKNOWN, type Profile } from "@1.modules/profile.domain";
import { z } from "zod";

//

export const Params_Schema = z.object({ thread_id: z.string() });

export interface Params {
  thread_id: string;
}

// TODO(douglasduteil): might want to move this to "@1.modules/inbox.domain"
/**
 *
 * @param param0
 * @deprecated
 */
export function thread_recipient({
  participants,
  profile_id,
}: {
  participants: Pick<Profile, "id">[];
  profile_id: String;
}) {
  const participant =
    participants.filter(({ id }) => id !== profile_id).pop() ?? PROFILE_UNKNOWN;

  return participant as Profile;
}
