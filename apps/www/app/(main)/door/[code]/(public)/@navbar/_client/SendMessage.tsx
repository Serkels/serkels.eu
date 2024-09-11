"use client";

import { button } from "@1.ui/react/button/atom";
import Link from "next/link";

//

export default function SendMessage({ profile_id }: { profile_id: string }) {
  return (
    <Link className={button()} href={`@~/inbox/write_to/${profile_id}`}>
      Envoyer un message privé
    </Link>
  );
}
