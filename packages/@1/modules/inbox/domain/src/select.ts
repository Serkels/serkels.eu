//

import { PROFILE_UNKNOWN, type Profile } from "@1.modules/profile.domain";

//

export function thread_recipient({
  participants,
  profile_id,
}: {
  participants: Pick<Profile, "id">[];
  profile_id: string;
}) {
  const participant =
    participants.filter(({ id }) => id !== profile_id).pop() ?? PROFILE_UNKNOWN;

  return participant as Profile;
}
