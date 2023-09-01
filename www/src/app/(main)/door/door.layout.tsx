//

import { getServerSession } from "next-auth/next";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { DoorId } from "./door.context";

export async function this_door_is_yours(code: number | string) {
  const session = await getServerSession(authOptions);
  const user_id = DoorId.parse(session?.user?.profile.id);
  const door_id = DoorId.parse(code);
  return door_id === user_id;
}
