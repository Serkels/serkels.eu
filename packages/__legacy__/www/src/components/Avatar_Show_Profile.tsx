//

import type { Profile } from "@1/modules/profile/domain";
import Link from "next/link";
import { AvatarMedia } from "~/components/Avatar";

//

export function Avatar_Show_Profile({ profile }: { profile: Profile }) {
  return (
    <AvatarMedia
      u={profile.get("id")}
      username={profile.name}
      sub_name={(tvStyle) => (
        <Link
          href={profile.url}
          className={tvStyle({
            className: "block text-sm font-light leading-snug text-gray-500 ",
          })}
        >
          Voir le profil
        </Link>
      )}
    />
  );
}
