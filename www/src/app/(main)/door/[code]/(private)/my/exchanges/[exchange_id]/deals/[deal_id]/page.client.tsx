"use client";

import { useDoor_Value } from "~/app/(main)/door/door.context";
import { Avatar_Show_Profile } from "~/components/Avatar_Show_Profile";
import { useExchange_Value } from "~/modules/exchange/Exchange.context";
import { useDeal_Value } from "../Deal.context";

//

export function Thread_Avatar() {
  const [deal] = useDeal_Value();
  const [exchange] = useExchange_Value();
  const [{ door_id }] = useDoor_Value();
  const is_owner = exchange.profile.get("id") === door_id;
  const profile = is_owner ? deal.profile : deal.organizer;
  if (!deal) return null;
  return <Avatar_Show_Profile profile={profile} />;
}
