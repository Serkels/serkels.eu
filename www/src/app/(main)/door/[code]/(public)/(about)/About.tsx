"use client";

import { useDoorProfile } from "../layout.client";

//

export function About() {
  const profile = useDoorProfile();

  return <p>{profile.get("about")}</p>;
}
