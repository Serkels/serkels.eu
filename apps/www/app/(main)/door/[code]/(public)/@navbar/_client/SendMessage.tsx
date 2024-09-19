"use client";

import { button } from "@1.ui/react/button/atom";
import { Messenger } from "@1.ui/react/icons";
import Link from "next/link";

//

export default function SendMessage({ profile_id }: { profile_id: string }) {
  return (
    <Link
      className={button({ intent: "secondary", className: "flex gap-2" })}
      href={`@~/inbox/write_to/${profile_id}`}
    >
      <Messenger className="w-4" />
      <span>Écrire</span>
    </Link>
  );
}
