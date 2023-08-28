"use client";

import { Avatar } from "~/components/Avatar";
import { useDeal_Value } from "../Deal.context";

//

export function Participant_Avatar() {
  const [deal] = useDeal_Value();
  return (
    <figure className="flex">
      <Avatar className="h-12 w-12" u={deal.profile.get("id")} />
      <figcaption className="ml-2 mt-0.5">
        <span className="block text-base font-medium leading-snug text-black">
          {deal.profile.name}
        </span>
        <span className="block text-sm font-light leading-snug text-gray-500 ">
          Voir le profil
        </span>
      </figcaption>
    </figure>
  );
}
