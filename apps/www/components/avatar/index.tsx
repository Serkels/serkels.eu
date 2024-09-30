"use client";

import type { AvatarProfile } from "@1.modules/profile.domain";
import { AvatarMedia, type AvatarMediaProps } from "@1.ui/react/avatar";
import Link from "next/link";

//

export function SeeProfileAvatarMedia(
  props: AvatarMediaProps & { profile: AvatarProfile },
) {
  const { profile, ...other_props } = props;

  return (
    <AvatarMedia
      image={profile.image}
      id={profile.id}
      name={profile.name}
      {...other_props}
    >
      <AvatarMedia.SubTitle>
        <Link href={`/@${profile.id}`}>Voir profil</Link>
      </AvatarMedia.SubTitle>
    </AvatarMedia>
  );
}

export function ProfileAvatarMedia(
  props: AvatarMediaProps & { profile: AvatarProfile },
) {
  const { profile, ...other_props } = props;

  return (
    <AvatarMedia
      className="items-center"
      id={profile.id}
      image={profile.image}
      name={profile.name}
      {...other_props}
    />
  );
}
