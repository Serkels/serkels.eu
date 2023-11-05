//

import type { Profile } from "@1.modules/profile.domain";
import { Avatar } from "@1.ui/react/avatar";
import type { PropsWithChildren } from "react";
import { tv } from "tailwind-variants";

//

export function ProfileMessages({
  is_you,
  profile,
  children,
}: PropsWithChildren<{
  is_you: boolean;
  profile: Omit<Profile, "bio">;
}>) {
  const { avatar, base, group } = profile_messages({ is_you });
  return (
    <div className={base()}>
      <Avatar image={profile.image} id={profile.id} className={avatar()} />
      <div className={group()}>{children}</div>
    </div>
  );
}

export const profile_messages = tv({
  base: "mb-4 flex flex-row justify-start",
  slots: {
    avatar: "relative flex h-8 w-8 flex-shrink-0",
    group: "grid flex-1 grid-flow-row gap-2 px-1.5 text-sm",
  },
  variants: {
    is_you: {
      true: "flex-row-reverse",
    },
  },
});
