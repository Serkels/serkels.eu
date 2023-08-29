"use client";

import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { useThread_Value } from "./Thread.context";

//

export function Thread_Avatar() {
  const [thread] = useThread_Value();
  if (!thread) return null;
  return <Avatar_Show_Profile profile={thread.profile} />;
}
