"use client";

import { useSession } from "next-auth/react";

//

export function About() {
  const { data: session } = useSession();
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
