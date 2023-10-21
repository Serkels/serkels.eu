//

import type { Profile } from "@1.modules/profile.domain";
import type { AvatarProps } from "@1.ui/react/avatar";
import { Avatar as UI_Avatar } from "@1.ui/react/avatar";

//

export function Avatar(props: AvatarProps & { profile: Profile }) {
  const { profile, ...other_props } = props;
  return <UI_Avatar image={profile.image} id={profile.id} {...other_props} />;
}
