"use client";

import { useSession } from "next-auth/react";
import { useProfile } from "../layout.client";

//

export function About() {
  const profile = useProfile();

  const session_context = useSession();
  return <p>{profile.get("about")}</p>;
}
