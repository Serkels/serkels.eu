"use client";

import { useSession } from "next-auth/react";

//

export function About() {
  const { data: session } = useSession();
  // if (1) throw new Error("lolZ");
  if (!session) return null;
  const about = session.user?.profile.attributes?.about;

  //

  if (!about) {
    return (
      <p className="text-center">
        <i>N/A</i>
      </p>
    );
  }
  return <p>{session.user?.profile.attributes?.about}</p>;
}
