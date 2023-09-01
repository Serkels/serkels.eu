"use client";

import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { useDeal_Value } from "../Deal.context";

//

export function Thread_Avatar() {
  const [deal] = useDeal_Value();
  if (!deal) return null;
  return <Avatar_Show_Profile profile={deal.profile} />;
}
