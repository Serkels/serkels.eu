"use client";

import type { Profile } from "@1.modules/profile.domain";
import { AvatarMedia, type AvatarMediaProps } from "@1.ui/react/avatar";
import Link from "next/link";

//

export function SeeProfileAvatarMedia(
  props: AvatarMediaProps & { profile: Pick<Profile, "image" | "id" | "name"> },
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
        <Link href={`/@${profile.id}`}>Voir profile</Link>
      </AvatarMedia.SubTitle>
    </AvatarMedia>
  );
}
