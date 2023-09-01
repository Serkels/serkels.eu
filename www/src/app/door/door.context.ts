//

import { createStateContext } from "react-use";
import { z } from "zod";

//

export const DoorId = z.coerce.number();
export const [useDoor_Value, Door_ValueProvider] = createStateContext<{
  is_yours: boolean;
  door_id: z.TypeOf<typeof DoorId>;
}>({
  is_yours: false, // All doors are closes by default. sorry.
  door_id: NaN, // NaN is the default door.
});
