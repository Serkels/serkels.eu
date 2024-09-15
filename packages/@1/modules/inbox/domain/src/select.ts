//

import { PROFILE_UNKNOWN, type Profile } from "@1.modules/profile.domain";

//

export function thread_recipient<TProfile extends Pick<Profile, "id">>({
  participants,
  profile_id,
}: {
  participants: TProfile[];
  profile_id: string;
}) {
  const participant =
    participants.filter(({ id }) => id !== profile_id).pop() ?? PROFILE_UNKNOWN;

  return participant as TProfile;
}
