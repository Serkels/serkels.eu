//

import type { Profile, Studient } from "@1.modules/profile.domain";
import type { AvatarMediaProps, AvatarProps } from "@1.ui/react/avatar";
import {
  Avatar as UI_Avatar,
  AvatarMedia as UI_AvatarMedia,
} from "@1.ui/react/avatar";

//

export function Avatar(props: AvatarProps & { profile: Profile }) {
  const { profile, ...other_props } = props;
  return <UI_Avatar image={profile.image} id={profile.id} {...other_props} />;
}

export function StudientAvatarMedia(
  props: AvatarMediaProps & { studient: Studient },
) {
  const { studient, ...other_props } = props;
  const { profile } = studient;
  return (
    <UI_AvatarMedia
      image={profile.image}
      id={profile.id}
      name={profile.name}
      university={studient.university}
      {...other_props}
    />
  );
}
