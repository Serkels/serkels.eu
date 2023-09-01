"use client";

import { useSession } from "next-auth/react";
import { useDoor_Value } from "../../../door.context";

//

export function About() {
  const { data: session } = useSession();
  const [{ owner }] = useDoor_Value();

  const about = session?.user?.profile.attributes?.about;

  //

  if (!about) {
    return (
      <p className="text-center">
        <i>N/A</i>
      </p>
    );
  }
  return (
    <p>
      <pre>{JSON.stringify(owner, null, 2)}</pre>
    </p>
  );
}
