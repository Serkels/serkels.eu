"use client";

import type { Profile } from "@1.modules/profile.domain";
import { AvatarMedia, type AvatarMediaProps } from "@1.ui/react/avatar";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  forwardRef,
  useMemo,
  type ComponentPropsWithoutRef,
  type ElementRef,
} from "react";
import { tv } from "tailwind-variants";

//

interface AvatarProps extends ComponentPropsWithoutRef<"figure"> {
  u?: string | number | undefined;
}
export const Avatar = forwardRef<ElementRef<"figure">, AvatarProps>(
  function Avatar(props, forwardedRef) {
    const { className, u, ...other_props } = props;

    const { data: session } = useSession();
    const id = u ?? session?.profile?.id ?? "unknown";

    const image = useMemo(
      () => session?.user?.image ?? "/opengraph-image.png",
      [id, session?.user?.image],
    );

    return (
      <figure className={avatar_img({ className })} ref={forwardedRef}>
        <img src={image} alt={`Avatar of the user ${id}`} {...other_props} />
      </figure>
    );
  },
);

export const avatar_img = tv({
  base: "overflow-hidden rounded-full object-cover",
});

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
