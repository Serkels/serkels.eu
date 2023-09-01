"use client";

import { useProfile } from "../layout.client";

//

export function About() {
  const profile = useProfile();
  return <p>{profile.get("about")}</p>;
}
