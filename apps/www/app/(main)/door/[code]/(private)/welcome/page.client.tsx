"use client";

import { useSession } from "@1.modules/auth.next/react";
import { Avatar } from "@1.ui/react/avatar";

//

export default function Welcome_Flow() {
  const { data: session } = useSession({ required: true });

  return (
    <>
      <div className="">
        <Avatar image={session?.profile?.image} className="mt-5 h-32" />
        <p className="mt-5 text-xl font-extrabold">{session?.profile?.name}</p>
      </div>
    </>
  );
}
