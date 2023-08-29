//

import type { Profile } from "@1/modules/profile/domain";
import Link from "next/link";
import { Avatar } from "~/components/Avatar";

//

export function Avatar_Show_Profile({ profile }: { profile: Profile }) {
  return (
    <figure className="flex">
      <Avatar className="h-12 w-12" u={profile.get("id")} />
      <figcaption className="ml-2 mt-0.5">
        <span className="block text-base font-medium leading-snug text-black">
          {profile.name}
        </span>
        <Link
          href={profile.url}
          className="block text-sm font-light leading-snug text-gray-500 "
        >
          Voir le profil
        </Link>
      </figcaption>
    </figure>
  );
}
